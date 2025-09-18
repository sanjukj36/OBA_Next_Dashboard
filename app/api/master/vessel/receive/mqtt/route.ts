import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Parse request body
    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const imo = String(payload.IMO);
    const fk_vessel = await prisma.vessel.findFirst({ where: { imo } });

    if (!fk_vessel) {
      return NextResponse.json(
        { success: false, message: "Vessel not found", imo },
        { status: 400 }
      );
    }

    // Step 2: Round float values
    const roundedPayload: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(payload)) {
      if (
        (key === "V_GPSLAT_act_deg@LAST" || key === "V_GPSLON_act_deg@LAST") &&
        typeof value === "number"
      ) {
        roundedPayload[key] = value; // No rounding for lat/lon
      } else if (typeof value === "number" && !Number.isInteger(value)) {
        roundedPayload[key] = parseFloat(value.toFixed(2)); // Round floats
      } else {
        roundedPayload[key] = value;
      }
    }

    const rawTime = roundedPayload.time;
    const d = new Date(0);
    d.setUTCSeconds(rawTime);

    const vesselData = await prisma.vesselData.create({
      data: {
        payload: roundedPayload,
        fk_vessel: fk_vessel.id,
        vesselTime: d,
        vesselTimeStamp: rawTime
      }
    });

    const existingLiveData = await prisma.vesselDataLive.findFirst({
      where: { fk_vessel: fk_vessel.id }
    });

    if (existingLiveData) {
      await prisma.vesselDataLive.update({
        where: { id: existingLiveData.id },
        data: {
          payload: roundedPayload,
          vesselTime: d,
          vesselTimeStamp: rawTime
        }
      });
    } else {
      await prisma.vesselDataLive.create({
        data: {
          payload: roundedPayload,
          fk_vessel: fk_vessel.id,
          vesselTime: d,
          vesselTimeStamp: rawTime
        }
      });
    }

    try{
      const fuelmasterPayload = {
        "IMO":roundedPayload["IMO"],
        "V_SOG_act_kn@AVG":roundedPayload["V_SOG_act_kn@AVG"],
        "V_STW_act_kn@AVG":roundedPayload["V_STW_act_kn@AVG"],
        "SA_SPD_act_rpm@AVG":roundedPayload["SA_SPD_act_rpm@AVG"],
        "SA_TQU_act_kNm@AVG":roundedPayload["SA_TQU_act_kNm@AVG"],
        "SA_POW_act_kW@AVG":roundedPayload["SA_POW_act_kW@AVG"],
        "WEA_WST_act_kn@AVG":roundedPayload["WEA_WST_act_kn@AVG"],
        "V_HDG_act_deg@AVG":roundedPayload["V_HDG_act_deg@AVG"],
        "WEA_WDT_act_deg@AVG":roundedPayload["WEA_WDT_act_deg@AVG"],
        "ME_FMS_act_kgPh@AVG":roundedPayload["ME_FMS_act_kgPh@AVG"],
      }

      if(roundedPayload["SA_SPD_act_rpm@AVG"] > 10 
      && roundedPayload["SA_SPD_act_rpm@AVG"] != null 
      && roundedPayload["ME_FMS_act_kgPh@AVG"] != 0 
      && roundedPayload["ME_FMS_act_kgPh@AVG"] != null
      && roundedPayload["V_SOG_act_kn@AVG"] != null
      && roundedPayload["V_STW_act_kn@AVG"] != null
      && roundedPayload["SA_TQU_act_kNm@AVG"] != null
      && roundedPayload["SA_POW_act_kW@AVG"] != null
      && roundedPayload["WEA_WST_act_kn@AVG"] != null
      && roundedPayload["V_HDG_act_deg@AVGG"] != null
      && roundedPayload["WEA_WDT_act_deg@AVG"] != null
      ){
    
      try{
        const AIBaseURL = process.env.AI_URL as string;
        const fuelAIResponse = await fetch(`${AIBaseURL}/fuel/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fuelmasterPayload })
        });
        console.log("FUELMASTER SEND")
  
        if(fuelAIResponse.ok){
          const fuelAiJson = await fuelAIResponse.json();
          const fuelaiData = fuelAiJson || [];

          let fuel_alert = false;
          if(fuelaiData.alert === 1){
            fuel_alert = true
          }
          const fuelmasterData = await prisma.FuelMaster.create({
            data:{
              fk_vessel: fk_vessel.id,
              payload: fuelmasterPayload,
              isAlert: fuel_alert,
              predictedValue: fuelaiData.predicted,
              fk_vessel_data: vesselData.id,
              vesselTimeStamp: rawTime,
              vesselTime: d,
            }
          })
        }
      }
  
  
      catch(err){
        console.log(err)
      }
    }
    else{
      console.log("AA")
    }
    
    }
    catch(error){
      console.log("ERROR", error)
    }

    

    
    // Step 2.5: Geofencing
    const lat = roundedPayload["V_GPSLAT_act_deg@LAST"];
    const lon = roundedPayload["V_GPSLON_act_deg@LAST"];

    if (typeof lat === "number" && typeof lon === "number") {
      const point = { lat, lng: lon };

      const geofences = await prisma.geofence.findMany({
        where: { fk_vessel: fk_vessel.id },
        select: {
          id: true,
          coordsArray: true,
          fence_type: true,
          alert_send: true,
          isActive: true
        }
      });

      const isInsidePolygon = (
        point: { lat: number; lng: number },
        polygon: any[]
      ): boolean => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const xi = polygon[i].lat,
            yi = polygon[i].lng;
          const xj = polygon[j].lat,
            yj = polygon[j].lng;

          const intersect =
            yi > point.lng !== yj > point.lng &&
            point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi + 1e-10) + xi;

          if (intersect) inside = !inside;
        }
        return inside;
      };

      for (const fence of geofences) {
        const polygon = Array.isArray(fence.coordsArray)
          ? fence.coordsArray
          : [];
        const inside = isInsidePolygon(point, polygon);

        let shouldTriggerAlarm = false;

        if (fence.fence_type === "permitted" && !inside) {
          shouldTriggerAlarm = true;
        } else if (fence.fence_type === "restricted" && inside) {
          shouldTriggerAlarm = true;
        }

        if (shouldTriggerAlarm && fence.alert_send) {
          await prisma.geofenceAlerts.create({
            data: {
              fk_geofence: fence.id,
              vesselTime: d,
              coordsArray: point,
              fk_vessel_data: vesselData.id
            }
          });
        } else {
          console.log(
            `Vessel at lat:${lat}, lon:${lon} is compliant with ${fence.fence_type} fence`
          );
        }
      }
    } else {
      console.warn(
        "GPS coordinates missing or invalid. Skipping geofence check."
      );
    }

    // Step 3: Filter alarm-like keys
    const keywords = [
      "Trip", "Failure", "Fail", "DPAH", "High", "Low", "Non_Flow",
      "Alarm", "ALM", "Slow_down", "Shut_down", "Abnormal", "Short_circ",
      "HI", "pre_warning", "abn", "SHD", "SLD", "cancel", "dph",
      "locking", "low", "overload", "no_volt", "blocking"
    ];
    const normalize = (str: string) => str.toLowerCase().replace(/[\s_,]/g, "");
    const normalizedKeywords = keywords.map(normalize);

    const filteredPayload: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(roundedPayload)) {
      const normalizedKey = normalize(key);
      const shouldInclude =
        normalizedKeywords.some(kw => normalizedKey.includes(kw)) &&
        (value === 1 || value === "1");

      if (shouldInclude) {
        filteredPayload[key] = value;
      }
    }

    // Step 4: Map to tag descriptions
    const tagRecordQuery = await prisma.tagMaster.findFirst({
      where: { fk_vessel: fk_vessel.id }
    });
    const tagRecordQueryData = tagRecordQuery?.tag_data || [];

    const matchedDescriptions: string[] = [];
    for (const key of Object.keys(filteredPayload)) {
      const match = tagRecordQueryData.find(
        (item: any) => item.tag_from_vessel === key
      );
      if (match) {
        matchedDescriptions.push(match.description);
      }
    }

    // Step 6: Filter out already unacknowledged alarms
    const unacknowledgedAlarms = await prisma.mLAlarm.findMany({
      where: {
        fk_vessel: fk_vessel.id,
        isAcknowledged: false
      },
      select: { alarm_name: true }
    });

    const unacknowledgedSet = new Set(
      unacknowledgedAlarms.map(a => a.alarm_name).filter(Boolean)
    );

    const filteredDescriptions = matchedDescriptions.filter(
      desc => !unacknowledgedSet.has(desc)
    );

    console.log("Matched Descriptions:", matchedDescriptions);
    console.log("Unacknowledged Alarms:", [...unacknowledgedSet]);
    console.log("Filtered Descriptions (to send to AI):", filteredDescriptions);

    if (filteredDescriptions.length === 0 && matchedDescriptions.length > 0) {
      console.log("All matched alarms are already unacknowledged. Skipping ML trigger.");
    } else if (filteredDescriptions.length === 0 && matchedDescriptions.length === 0) {
      console.log("No alarms detected in payload.");
    } else {
      // Step 7: Send to AI only if not already unacknowledged
      try {
        const AIBaseURL = process.env.AI_URL as string;
        const aiResponse = await fetch(`${AIBaseURL}/alarm/analysis/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alarm_name: filteredDescriptions })
        });

        if (aiResponse.ok) {
          const aiJson = await aiResponse.json();
          const mlData = aiJson.data || [];

          for (const alarm of mlData) {
            const alarmName = alarm.alarm_name || "Unknown";

            const existing = await prisma.mLAlarm.findFirst({
              where: {
                fk_vessel: fk_vessel.id,
                alarm_name: alarmName,
                isAcknowledged: false
              }
            });

            if (existing) {
              console.log(`Alarm "${alarmName}" already exists unacknowledged. Skipping insert.`);
              continue;
            }

            await prisma.mLAlarm.create({
              data: {
                alarm_name: alarmName,
                suspected_tags: alarm.suspected_tags,
                MlResponse: alarm,
                fk_vessel: fk_vessel.id,
                fk_vessel_data: vesselData.id,
                isAcknowledged: false
              }
            });
          }
        } else {
          const errText = await aiResponse.text();
          console.error("AI model responded with error:", errText);
        }
      } catch (err) {
        console.error("Failed to call AI model:", err);
      }
    }

    // Step 8: Return success response
    return NextResponse.json({
      success: true,
      message: "Data received successfully",
      data: roundedPayload
    });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

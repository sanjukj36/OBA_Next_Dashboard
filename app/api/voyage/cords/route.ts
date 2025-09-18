import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult;
    if (!auth_usertype) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const is_superuser = auth_usertype.isSuperuser;
    const id = auth_usertype.userTypeId;

    let whereCondition: any = {
      is_deleted: false,
    };

    if (!is_superuser) {
      if (search) {
        whereCondition.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      const userType = await prisma.UserTypePriv.findFirst({ where: { id } });

      if (userType?.fk_company) {
        whereCondition.fk_company = userType.fk_company;
      } else if (userType?.fk_fleet) {
        whereCondition.fk_fleet = userType.fk_fleet;
      } else if (userType?.fk_vessel) {
        whereCondition.id = userType.fk_vessel;
      }
    } else {
      if (search) {
        whereCondition.name = {
          contains: search,
          mode: "insensitive",
        };
      }
    }

    // 👉 Get filtered vessel IDs
    const filteredVessels = await prisma.vessel.findMany({
      where: whereCondition,
      select: { id: true },
    });

    const filteredVesselIds = filteredVessels.map(v => v.id);
    if (filteredVesselIds.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // ✅ Tag mappings
    const tagParams: Record<string, string> = {
      LAT: "V_GPSLAT_act_deg@LAST",
      LONG: "V_GPSLON_act_deg@LAST",
      HDG: "V_HDG_act_deg@AVG"
    };

    // 🔍 Optimized raw SQL query to get latest vesseldata per vessel (with filter)
    const latestVesselData = await prisma.$queryRaw<
      Array<{
        vessel_id: number;
        vessel_name: string;
        payload: any;
        payload_time: Date;
      }>
    >`
      SELECT
        v.id AS vessel_id,
        v.name AS vessel_name,
        vd.payload,
        vd."createdAt" AS payload_time
      FROM "Vessel" v
      LEFT JOIN LATERAL (
        SELECT *
        FROM "VesselData" vd
        WHERE vd."fk_vessel" = v.id
        ORDER BY vd."createdAt" DESC
        LIMIT 1
      ) vd ON true
      WHERE v.is_deleted = false AND v.id = ANY(${filteredVesselIds});
    `;

    // 🔃 Fetch all tagMasters and group by vessel_id
    const allTags = await prisma.tagMaster.findMany();
    const tagMastersMap: Record<number, Record<string, any>> = {};

    allTags.forEach(tag => {
      if (!tagMastersMap[tag.vesselId]) tagMastersMap[tag.vesselId] = {};
      tagMastersMap[tag.vesselId][tag.tag_from_vessel] = {
        unit: tag.unit,
        description: tag.description || tag.unit,
        tag_from_vessel: tag.tag_from_vessel,
        min:
          typeof tag.min === "number" && !Number.isInteger(tag.min)
            ? Number.parseFloat(tag.min.toFixed(2))
            : tag.min,
        max:
          typeof tag.max === "number" && !Number.isInteger(tag.max)
            ? Number.parseFloat(tag.max.toFixed(2))
            : tag.max,
        datatype: tag.datatype
      };
    });

    // ⏱ Current UTC timestamp
    const currentUtc = Math.floor(Date.now() / 1000);

    // 🔁 Format response
    const vesselDataArray = latestVesselData.map(row => {
      const { vessel_id, vessel_name, payload } = row;

      const parsedPayload =
        typeof payload === "string" ? JSON.parse(payload) : payload;

      const tagMap = tagMastersMap[vessel_id] || {};
      const responseData: Record<string, any> = {};

      for (const [responseKey, payloadTag] of Object.entries(tagParams)) {
        if (parsedPayload?.hasOwnProperty(payloadTag)) {
          let value = parsedPayload[payloadTag];
          if (typeof value === "number" && !Number.isInteger(value)) {
            value = Number.parseFloat(value.toFixed(2));
          }
          responseData[responseKey] = value;
        }
      }

      // ⌚ Time info
      let timeInfo = null;
      if (parsedPayload?.time && !isNaN(parsedPayload.time)) {
        timeInfo = {
          payload_time: parsedPayload.time,
          readable_utc: new Date(parsedPayload.time * 1000)
            .toISOString()
            .replace("T", " ")
            .replace("Z", ""),
          time_difference_seconds: currentUtc - parsedPayload.time
        };
      }

      return {
        vessel_id,
        vessel_name,
        data: responseData,
        time_info: timeInfo
      };
    });

    return NextResponse.json(
      { success: true, data: vesselDataArray },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /vesseldata error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

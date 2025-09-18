import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

interface VesselMaster {
  name: string;
  imo: string;
  email: string;
  vessel_type: string;
  hull_no: string;
  flag: string;
  port_of_regd: string;
  vessel_class: string;
  year_built: number;
  no_of_dg: number;
  dg_capacity_indvidual: number[];
  dg_maker: string;
  dg_model: string;
  me_maker: string;
  me_model: string;
  power: number;
  mcr: number;
  geared_or_gearless: boolean;
  fk_company: number;
  fk_fleet: number;
}

export async function PUT(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) return authResult;
  const auth_usertype = authResult.isSuperuser;
  if (!auth_usertype) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required in query params" },
        { status: 400 }
      );
    }

    const body: VesselMaster = await req.json();
    const {
      name,
      imo,
      email,
      vessel_type,
      hull_no,
      flag,
      port_of_regd,
      vessel_class,
      year_built,
      no_of_dg,
      dg_capacity_indvidual,
      dg_maker,
      dg_model,
      me_maker,
      me_model,
      power,
      mcr,
      geared_or_gearless,
      fk_company,
      fk_fleet
    } = body;

    // Validation
    if (
      !name ||
      !imo ||
      !email ||
      !vessel_type ||
      !hull_no ||
      !flag ||
      !port_of_regd ||
      !vessel_class||
      !year_built ||
      !no_of_dg ||
      !dg_capacity_indvidual ||
      !dg_maker ||
      !dg_model ||
      !me_maker ||
      !me_model ||
      !power ||
      !mcr ||
      !geared_or_gearless ||
      !fk_company ||
      !fk_fleet
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if vessel exists
    const existingVessel = await prisma.vessel.findUnique({
      where: { id }
    });

    if (!existingVessel) {
      return NextResponse.json(
        { success: false, message: "Vessel not found" },
        { status: 404 }
      );
    }

    // Update vessel
    const updatedVessel = await prisma.vessel.update({
      where: { id },
      data: {
        name,
        imo,
        email,
        vessel_type,
        hull_no,
        flag,
        port_of_regd,
        vessel_class,
        year_built,
        no_of_dg,
        dg_capacity_indvidual,
        dg_maker,
        dg_model,
        me_maker,
        me_model,
        power,
        mcr,
        geared_or_gearless,
        fk_company,
        fk_fleet
      }
    });

    return NextResponse.json({ success: true, data: updatedVessel });
  } catch (error) {
    console.error("Error updating vessel:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

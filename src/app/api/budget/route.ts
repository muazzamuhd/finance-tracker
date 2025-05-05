import { auth } from "@/auth";
import { getModels } from "@/lib/models";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { Budget } = await getModels();

    const budget = await Budget.findOne({ userId: session.user.id });

    if (!budget) {
      // Return default budget if none exists
      return NextResponse.json({
        limit: 100000,
        period: "monthly",
      });
    }

    return NextResponse.json({
      limit: budget.limit,
      period: budget.period,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { limit, period } = await req.json();

    if (
      typeof limit !== "number" ||
      !["daily", "weekly", "monthly"].includes(period)
    ) {
      return NextResponse.json(
        { error: "Invalid budget data" },
        { status: 400 }
      );
    }

    const { Budget } = await getModels();

    // Update or create budget
    const budget = await Budget.findOneAndUpdate(
      { userId: session.user.id },
      { limit, period },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      limit: budget.limit,
      period: budget.period,
    });
  } catch (error) {
    console.error("Error saving budget:", error);
    return NextResponse.json(
      { error: "Failed to save budget" },
      { status: 500 }
    );
  }
}

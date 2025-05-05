import { auth } from "@/auth";
import { getModels } from "@/lib/models";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { Expense } = await getModels();

    const expenses = await Expense.find({
      userId: session.user.id,
    }).sort({ date: -1 });

    // Transform MongoDB documents to match the frontend Expense type
    const transformedExpenses = expenses.map((expense) => ({
      id: expense._id.toString(),
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString(),
    }));

    return NextResponse.json(transformedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
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

    const { amount, category, description, date } = await req.json();

    if (typeof amount !== "number" || !category) {
      return NextResponse.json(
        { error: "Invalid expense data" },
        { status: 400 }
      );
    }

    const { Expense } = await getModels();

    const expense = new Expense({
      userId: session.user.id,
      amount,
      category,
      description: description || "",
      date: new Date(date),
    });

    await expense.save();

    return NextResponse.json({
      id: expense._id.toString(),
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString(),
    });
  } catch (error) {
    console.error("Error saving expense:", error);
    return NextResponse.json(
      { error: "Failed to save expense" },
      { status: 500 }
    );
  }
}

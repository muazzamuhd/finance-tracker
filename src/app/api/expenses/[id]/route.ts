// import { auth } from "@/auth";
// import { getModels } from "@/lib/models";
// import { isValidObjectId } from "mongoose";
// import { NextResponse } from "next/server";

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth();

//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = params;

//     if (!id || !isValidObjectId(id)) {
//       return NextResponse.json(
//         { error: "Invalid expense ID" },
//         { status: 400 }
//       );
//     }

//     const { Expense } = await getModels();

//     // Ensure the expense belongs to the current user
//     const expense = await Expense.findOne({
//       _id: id,
//       userId: session.user.id,
//     });

//     if (!expense) {
//       return NextResponse.json({ error: "Expense not found" }, { status: 404 });
//     }

//     await Expense.findByIdAndDelete(id);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting expense:", error);
//     return NextResponse.json(
//       { error: "Failed to delete expense" },
//       { status: 500 }
//     );
//   }
// }
import { auth } from "@/auth";
import { getModels } from "@/lib/models";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const { Expense } = await getModels();

    // Ensure the expense belongs to the current user
    const expense = await Expense.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await Expense.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}

import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

export const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const financialTotals = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    financialTotals.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      if (item._id === "expense") totalExpense = item.totalAmount;
    });

    const topSpendingCategories = await Transaction.aggregate([
      { $match: { type: "expense" } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpent: 1,
          transactionCount: 1,
        },
      },
    ]);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      data: {
        users: {
          total: totalUsers,
          breakdown: usersByRole,
          recent: recentUsers,
        },
        financials: {
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
        },
        topSpendingCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};
import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";

export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      note: note || "",
    });

    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: { transactions },
    });
  } catch (error) {
    next(error);
  }
};


export const getMonthlySummary = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || now.getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const userId = req.user._id || req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    summary.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      if (item._id === "expense") totalExpenses = item.totalAmount;
    });

    const recentTransactions = await Transaction.find({ user: userObjectId })
      .populate("category", "name")
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const rawChartAgg = await Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          date: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59, 999),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const chartMap = {};

    rawChartAgg.forEach((item) => {
      const monthIdx = item._id.month - 1;
      const monthLabel = monthNames[monthIdx];
      const type = item._id.type;

      if (!chartMap[monthIdx]) {
        chartMap[monthIdx] = {
          month: monthLabel,
          income: 0,
          expense: 0,
        };
      }

      if (type === "income") {
        chartMap[monthIdx].income = item.total;
      } else if (type === "expense") {
        chartMap[monthIdx].expense = item.total;
      }
    });

    const chartData = Object.keys(chartMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => chartMap[key]);

    res.status(200).json({
      status: "success",
      data: {
        totalBalance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        recentTransactions,
        chartData,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found or unauthorized",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found or unauthorized",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
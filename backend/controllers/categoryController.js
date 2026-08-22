import Category from "../models/categoryModel.js";
import { DEFAULT_CATEGORIES } from "../utility/defaultCategories.js";

export const getCategories = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;

    const customCategories = userId
      ? await Category.find({ user: userId }).lean()
      : [];

    res.status(200).json({
      status: "success",
      data: {
        predefined: DEFAULT_CATEGORIES,
        custom: customCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomCategory = async (req, res, next) => {
  try {
    const { name, type, icon } = req.body;
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized. User ID missing.",
      });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      user: userId,
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "fail",
        message: "A category with this name already exists",
      });
    }

    const newCategory = await Category.create({
      name,
      type,
      icon: icon || "tag",
      isCustom: true,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Custom category created successfully",
      data: { category: newCategory },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const category = await Category.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found or access denied.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
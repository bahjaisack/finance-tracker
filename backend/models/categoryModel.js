import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type must be either income or expense"],
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
    icon: {
      type: String,
      default: "tag", 
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
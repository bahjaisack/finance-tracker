import User from "../models/UserModel.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user ID format" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// // 2. UPDATE User By ID (PUT /users/:id)
// export const updateUserById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, email, role, profilePic } = req.body;

//     if (!isValidObjectId(id)) {
//       return res.status(400).json({ status: "fail", message: "Invalid user ID format" });
//     }

//     // If updating email, check if another user already owns it
//     if (email) {
//       const existingUser = await User.findOne({ email, _id: { $ne: id } });
//       if (existingUser) {
//         return res.status(400).json({
//           status: "fail",
//           message: "Email is already in use by another account",
//         });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { name, email, role, profilePic },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "User updated successfully",
//       data: {
//         user: {
//           id: updatedUser._id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           role: updatedUser.role,
//           profilePic: updatedUser.profilePic,
//           updatedAt: updatedUser.updatedAt,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ status: "fail", message: "Invalid user ID format" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic || "",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (req.body.profilePic) user.profilePic = req.body.profilePic;
    if (name) user.name = name;
    if (email) user.email = email;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
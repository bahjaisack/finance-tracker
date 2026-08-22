import cloudinary from "../utility/cloudinary.js";
import User from "../models/userModel.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {

    if (!req.file) {

      return res.status(400).json({
        status: "fail",
        message: "Please select an image file to upload",
      });
    }


    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_pictures",
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(buffer);
      });
    };

    const cloudinaryResult = await uploadFromBuffer(req.file.buffer);

    console.log("Cloudinary URL:", cloudinaryResult.secure_url);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePic: cloudinaryResult.secure_url,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Profile picture uploaded successfully",
      data: {
        profilePic: cloudinaryResult.secure_url,
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfilePicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "profilePic name email"
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        profilePic: user.profilePic || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
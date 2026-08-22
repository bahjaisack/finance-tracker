import { Router } from "express";

import {
  uploadProfilePicture,
  getProfilePicture,
} from "../controllers/uploadController.js";

import { authenticate } from "../middlewares/auth.js";
import { uploadSingleImage } from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File and profile picture upload operations
 */

/**
 * @swagger
 * /upload/profile-picture:
 *   get:
 *     summary: Get profile picture
 *     description: Get the profile picture URL of the currently authenticated user.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                       nullable: true
 *                       example: https://res.cloudinary.com/demo/image/upload/profile_pictures/user.png
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /upload/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     description: Upload a new profile picture for the currently authenticated user. The image is stored in Cloudinary.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture. Supported formats are PNG, JPEG, JPG and WEBP. Maximum size is 5MB.
 *
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Profile picture uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/profile_pictures/user.png
 *                     user:
 *                       type: object
 *
 *       400:
 *         description: No image provided or invalid image file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Please select an image file to upload
 *
 *       401:
 *         description: Unauthorized
 *
 *       413:
 *         description: Image file exceeds the 5MB limit
 *
 *       500:
 *         description: Internal server error
 */

router.get(
  "/profile-picture",
  authenticate,
  getProfilePicture
);

router.post(
  "/profile-picture",
  authenticate,
  uploadSingleImage,
  uploadProfilePicture
);

export default router;
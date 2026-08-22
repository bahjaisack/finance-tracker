import { Router } from "express";

import {
  getUserById,
  updateUser,
  getUsers,
  deleteUserById,
  getProfile,
  updateProfile,
} from "../controllers/user.js";

import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Profile Management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     description: Returns the profile information of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 64f123456789abcdef123456
 *                         name:
 *                           type: string
 *                           example: Ahmed Ali
 *                         email:
 *                           type: string
 *                           example: ahmed@example.com
 *                         profilePic:
 *                           type: string
 *                           nullable: true
 *                           example: https://res.cloudinary.com/demo/image/upload/profile_pictures/user.png
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     description: Updates the profile information of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Ali
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               phone:
 *                 type: string
 *                 example: "+252612345678"
 *               gender:
 *                 type: string
 *                 example: male
 *               bio:
 *                 type: string
 *                 example: Finance enthusiast and software developer
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *
 *       400:
 *         description: Invalid profile information
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of users. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Returns a specific user using their user ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a user by ID
 *     description: Updates a user's information using their user ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Ali
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               phone:
 *                 type: string
 *                 example: "+252612345678"
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user from the system.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

router.get("/", getUsers);

router
  .route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUserById);

export default router;
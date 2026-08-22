import { Router } from "express";

import {
  register,
  login,
} from "../controllers/auth.js";

import { validate } from "../middlewares/validate.js";

import {
  createUserSchema,
  loginSchema,
} from "../schemas/authSchema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with validated input data.
 *     tags:
 *       - Auth
 *     security: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Jane Doe
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: jane@example.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: securepassword123
 *
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 default: user
 *                 example: user
 *
 *               profilePic:
 *                 type: string
 *                 nullable: true
 *                 description: Optional profile picture URL
 *                 example: https://res.cloudinary.com/demo/image/upload/profile_pictures/avatar.png
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Validation error or invalid request
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
 *                   example: Please provide a valid email address
 *
 *       409:
 *         description: Email address is already registered
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
 *                   example: Email already in use
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user using email and password credentials and returns a JWT authentication token.
 *     tags:
 *       - Auth
 *     security: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email address
 *                 example: jane@example.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Account password
 *                 example: securepassword123
 *
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *
 *                 message:
 *                   type: string
 *                   example: Login successful
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Validation error
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
 *                   example: Email and password are required
 *
 *       401:
 *         description: Invalid email or password
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
 *                   example: Invalid email or password
 *
 *       500:
 *         description: Internal server error
 */

router.post(
  "/register",
  validate(createUserSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

export default router;
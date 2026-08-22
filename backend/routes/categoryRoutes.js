import { Router } from "express";

import {
  getCategories,
  createCustomCategory,
  deleteCustomCategory,
} from "../controllers/categoryController.js";

import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

import { createCategorySchema } from "../schemas/categorySchema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Predefined and custom category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve predefined income/expense categories and custom categories created by the authenticated user.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     predefined:
 *                       type: array
 *                       description: System-defined categories
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 66be2d12f38a9e4b109c123a
 *                           name:
 *                             type: string
 *                             example: Food & Dining
 *                           type:
 *                             type: string
 *                             enum:
 *                               - income
 *                               - expense
 *                             example: expense
 *                           icon:
 *                             type: string
 *                             example: utensils
 *                           isCustom:
 *                             type: boolean
 *                             example: false
 *
 *                     custom:
 *                       type: array
 *                       description: Categories created by the authenticated user
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 66be2d12f38a9e4b109c123a
 *                           name:
 *                             type: string
 *                             example: Subscriptions
 *                           type:
 *                             type: string
 *                             enum:
 *                               - income
 *                               - expense
 *                             example: expense
 *                           icon:
 *                             type: string
 *                             example: tv
 *                           isCustom:
 *                             type: boolean
 *                             example: true
 *
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a custom category
 *     description: Creates a new custom category for the authenticated user.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: Subscriptions
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *                 description: Category transaction type
 *                 example: expense
 *               icon:
 *                 type: string
 *                 description: Icon name for the category
 *                 default: tag
 *                 example: tv
 *
 *     responses:
 *       201:
 *         description: Custom category created successfully
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
 *                   example: Custom category created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 66be2d12f38a9e4b109c123a
 *                         name:
 *                           type: string
 *                           example: Subscriptions
 *                         type:
 *                           type: string
 *                           enum:
 *                             - income
 *                             - expense
 *                           example: expense
 *                         icon:
 *                           type: string
 *                           example: tv
 *                         isCustom:
 *                           type: boolean
 *                           example: true
 *                         user:
 *                           type: string
 *                           example: 66be2880f38a9e4b109c1100
 *
 *       400:
 *         description: Bad request, validation error, or category already exists
 *
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a custom category
 *     description: Deletes a custom category belonging to the authenticated user. Predefined/system categories cannot be deleted.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the custom category
 *         schema:
 *           type: string
 *         example: 66b1a2c3f4e5d6c7b8a90123
 *
 *     responses:
 *       200:
 *         description: Custom category deleted successfully
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
 *                   example: Category deleted successfully
 *
 *       400:
 *         description: Invalid category ID
 *
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *
 *       404:
 *         description: Category not found or user does not have permission to delete it
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
 *                   example: Category not found or you do not have permission to delete it
 *
 *       500:
 *         description: Internal server error
 */

router.get(
  "/",
  authenticate,
  getCategories
);

router.post(
  "/",
  authenticate,
  validate(createCategorySchema),
  createCustomCategory
);

router.delete(
  "/:id",
  authenticate,
  deleteCustomCategory
);

export default router;
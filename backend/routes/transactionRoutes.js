import { Router } from "express";

import {
  createTransaction,
  getTransactions,
  getMonthlySummary,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import { authenticate } from "../middlewares/auth.js";

import { validate } from "../middlewares/validate.js";

import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Income and expense transaction operations
 */

/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     summary: Get monthly transaction summary
 *     description: Returns a summary of the authenticated user's income and expenses by month.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary retrieved successfully
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
 *                     summary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: January
 *                           income:
 *                             type: number
 *                             example: 2500
 *                           expenses:
 *                             type: number
 *                             example: 1200
 *                           balance:
 *                             type: number
 *                             example: 1300
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     description: Creates a new income or expense transaction for the authenticated user.
 *     tags:
 *       - Transactions
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
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               description:
 *                 type: string
 *                 example: Lunch with friends
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-21
 *
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *                   example: Transaction created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all transactions
 *     description: Returns all transactions belonging to the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - income
 *             - expense
 *         description: Filter transactions by type
 *
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter transactions by category
 *
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering transactions
 *         example: 2026-08-01
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering transactions
 *         example: 2026-08-31
 *
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                     transactions:
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
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Updates an existing transaction belonging to the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: 64f123456789abcdef123456
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 200
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Transportation
 *               description:
 *                 type: string
 *                 example: Taxi fare
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-21
 *
 *     responses:
 *       200:
 *         description: Transaction updated successfully
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
 *                   example: Transaction updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       404:
 *         description: Transaction not found
 *
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a transaction
 *     description: Deletes an existing transaction belonging to the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: 64f123456789abcdef123456
 *
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
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
 *                   example: Transaction deleted successfully
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       404:
 *         description: Transaction not found
 *
 *       500:
 *         description: Internal server error
 */

router.get("/monthly-summary", getMonthlySummary);

router
  .route("/")
  .post(
    validate(createTransactionSchema),
    createTransaction
  )
  .get(getTransactions);

router
  .route("/:id")
  .put(
    validate(updateTransactionSchema),
    updateTransaction
  )
  .delete(deleteTransaction);

export default router;
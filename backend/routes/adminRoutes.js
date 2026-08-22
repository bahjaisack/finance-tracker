import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform administration and analytics
 */

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Get overall platform analytics
 *     description: Returns platform-wide user statistics and financial analytics. This endpoint is restricted to authenticated administrators.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
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
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                       description: Total number of registered users
 *
 *                     totalTransactions:
 *                       type: integer
 *                       example: 1250
 *                       description: Total number of transactions
 *
 *                     totalIncome:
 *                       type: number
 *                       example: 125000
 *                       description: Total income recorded on the platform
 *
 *                     totalExpenses:
 *                       type: number
 *                       example: 85000
 *                       description: Total expenses recorded on the platform
 *
 *                     totalBalance:
 *                       type: number
 *                       example: 40000
 *                       description: Total balance across the platform
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
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
 *                   example: Authentication required
 *
 *       403:
 *         description: Forbidden - authenticated user is not an administrator
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
 *                   example: Access denied. Admin privileges required.
 *
 *       500:
 *         description: Internal server error
 */

router.get(
  "/overview",
  authenticate,
  authorize("admin"),
  getAdminOverview
);

export default router;
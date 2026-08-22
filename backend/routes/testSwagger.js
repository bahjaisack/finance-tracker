/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Success
 */

import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Swagger works",
  });
});

export default router;
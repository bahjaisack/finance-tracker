import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { limiter } from "./middlewares/ratelimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import logger from "./middlewares/logger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utility/swagger.js"; 

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(limiter);
app.use(logger);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Api is working" });
});

// swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);


app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(
    process.env.NODE_ENV == "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PRO,
  )
  .then(() => console.log("✅ connected to mongo db"))
  .catch((error) => console.log("❌ connection failed", error));
app.listen(PORT, () => {
  console.log("server is running on", PORT);
});

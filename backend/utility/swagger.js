import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, "../routes");

const options = {
  failOnErrors: true,

  definition: {
    openapi: "3.0.0",

    info: {
      title: "Finance Tracker API",
      version: "1.0.0",
      description: "API documentation for our finance tracker backend",
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api"
            : "https://mentorship-api-eem4.onrender.com/api",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "User Authentication & Account Management",
      },
      {
        name: "Admin",
        description: "Platform Administration & Analytics",
      },
      {
        name: "Users",
        description: "User Profile Management",
      },
      {
        name: "Upload",
        description: "File & Image Upload Operations",
      },
      {
        name: "Transactions",
        description: "Income & Expense Operations",
      },
      {
        name: "Categories",
        description: "Predefined & Custom Categories",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66be2d12f38a9e4b109c123a",
            },

            name: {
              type: "string",
              example: "Jane Doe",
            },

            email: {
              type: "string",
              format: "email",
              example: "jane@example.com",
            },

            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },

            profilePic: {
              type: "string",
              nullable: true,
              example:
                "https://res.cloudinary.com/demo/image/upload/profile_pictures/avatar.png",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  
  apis: [
    path.join(routesPath, "authRoutes.js"),
    path.join(routesPath, "userRoutes.js"),
    path.join(routesPath, "uploadRoute.js"),
    path.join(routesPath, "transactionRoutes.js"),
    path.join(routesPath, "categoryRoutes.js"),
    path.join(routesPath, "adminRoutes.js"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);


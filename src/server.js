import dotenv from "dotenv";
dotenv.config();  // <- must be first

import app from "./app.js";
import prisma from "./config/db.js";

const PORT = process.env.PORT || 5010;
const HOST = process.env.HOST || "0.0.0.0";

// Database Connection Check
async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");

        // MongoDB-friendly test: count documents in any collection (e.g., users)
        await prisma.user.count();
        console.log("✅ Database query test passed");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
}

// Start Server
async function startServer() {
    try {
        // Check database connection first
        await checkDatabaseConnection();

        // Start listening
        const server = app.listen(PORT, HOST, () => {
            console.log("=================================");
            console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode`);
            console.log(`📡 Server URL: http://${HOST}:${PORT}`);
            console.log(`🏥 Health Check: http://${HOST}:${PORT}/health`);
            console.log(`📊 API Base: http://${HOST}:${PORT}/api`);
            console.log("=================================");
            console.log("ENV TEST:", process.env.ACCESS_TOKEN_SECRET, process.env.DATABASE_URL);
        });

        // Graceful Shutdown
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            // Stop accepting new connections
            server.close(async () => {
                console.log("✅ HTTP server closed");

                // Close database connection
                try {
                    await prisma.$disconnect();
                    console.log("✅ Database connection closed");
                } catch (error) {
                    console.error("❌ Error closing database:", error);
                }

                console.log("✅ Graceful shutdown completed");
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error("⚠️ Forced shutdown after timeout");
                process.exit(1);
            }, 10000);
        };

        // Listen for termination signals
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Handle server errors
        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error("❌ Server error:", error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Start the server
startServer();

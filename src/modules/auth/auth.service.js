import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { HTTP_STATUS } from "./auth.constant.js";

class AuthServices {
    /**
     * Generate JWT token for user
     * @param {string} email - User email
     * @returns {Object} - Token and user info
     */
    async generateToken(email) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    console.log("cleanEmail", cleanEmail)

    // AVOID regex. Use exact match.
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        email: true,
        role: true,
        status: true,
        officeId: true,
        name: true,
      },
    });
    console.log("user", user)

    if (!user) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: "User not found",
      };
    }

    if (user.status !== "active") {
      return {
        success: false,
        statusCode: HTTP_STATUS.FORBIDDEN,
        message: "Account is inactive",
      };
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        status: user.status,
        officeId: user.officeId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "24h" }
    );

    return {
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        officeId: user.officeId,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}



    /**
     * Refresh JWT token
     * @param {string} token - Old JWT token
     * @returns {Object} - New token
     */
    async refreshToken(token) {
        try {
            // Verify old token (ignore expiration)
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
                ignoreExpiration: true,
            });

            // Fetch fresh user data
            const user = await prisma.user.findFirst({
                where: {
                    email: {
                        contains: decoded.email.trim().toLowerCase(),
                        mode: "insensitive",
                    },
                },
                select: {
                    email: true,
                    role: true,
                    status: true,
                    officeId: true,
                },
            });

            if (!user) {
                return {
                    success: false,
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    message: "User not found",
                };
            }

            if (user.status !== "active") {
                return {
                    success: false,
                    statusCode: HTTP_STATUS.FORBIDDEN,
                    message: "Account is inactive",
                };
            }

            // Create new JWT payload
            const payload = {
                email: user.email,
                role: user.role,
                status: user.status,
                officeId: user.officeId,
            };

            // Sign new JWT token
            const newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.JWT_EXPIRE || "24h",
            });

            return {
                success: true,
                token: newToken,
            };
        } catch (error) {
            console.error("Error refreshing token:", error);
            return {
                success: false,
                statusCode: HTTP_STATUS.UNAUTHORIZED,
                message: "Invalid token",
            };
        }
    }

    /**
     * Verify if token is valid
     * @param {string} token - JWT token
     * @returns {Object} - Verification result
     */
    async verifyJWT(token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return {
                success: true,
                decoded,
            };
        } catch (error) {
            return {
                success: false,
                statusCode: HTTP_STATUS.UNAUTHORIZED,
                message: "Invalid or expired token",
            };
        }
    }
}

const authServices = new AuthServices();
export default authServices;

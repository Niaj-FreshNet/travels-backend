import prisma from "../../config/db.js";
import { HTTP_STATUS } from "./user.constant.js";

class UserServices {
  /**
   * Get user status by email
   */
  async getUserStatus(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { status: true },
      });

      if (!user) {
        return {
          success: false,
          statusCode: HTTP_STATUS.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        success: true,
        isActive: user.status === "active",
      };
    } catch (error) {
      console.error("Error getting user status:", error);
      throw error;
    }
  }

  /**
   * Check if user is admin
   */
  async checkIsAdmin(email, tokenOfficeId, role) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true, officeId: true },
      });

      if (!user) {
        return {
          success: false,
          statusCode: HTTP_STATUS.NOT_FOUND,
          message: "User not found",
        };
      }

      const isAdmin = user.role === "admin" || user.role === "super-admin";

      // For regular admins, check office restriction
      if (role === "admin" && user.officeId !== tokenOfficeId) {
        return {
          success: false,
          statusCode: HTTP_STATUS.FORBIDDEN,
          message: "Unauthorized Office",
        };
      }

      return {
        success: true,
        isAdmin,
      };
    } catch (error) {
      console.error("Error checking if user is admin:", error);
      throw error;
    }
  }

  /**
   * Check if user is super-admin
   */
  async checkIsSuperAdmin(email, tokenOfficeId, role) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true, officeId: true },
      });

      if (!user) {
        return {
          success: false,
          statusCode: HTTP_STATUS.NOT_FOUND,
          message: "User not found",
        };
      }

      const isSuperAdmin = user.role === "super-admin";

      // For regular admins, check office restriction
      if (role === "admin" && user.officeId !== tokenOfficeId) {
        return {
          success: false,
          statusCode: HTTP_STATUS.FORBIDDEN,
          message: "Unauthorized Office",
        };
      }

      return {
        success: true,
        isSuperAdmin,
      };
    } catch (error) {
      console.error("Error checking if user is super-admin:", error);
      throw error;
    }
  }

  /**
   * Get all users (Super-Admin only)
   */
  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        orderBy: { date: "desc" },
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Get users by office
   */
  async getUsersByOffice(officeId) {
    try {
      return await prisma.user.findMany({
        where: { officeId },
        orderBy: { date: "desc" },
      });
    } catch (error) {
      console.error("Error fetching office users:", error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Set default values
      if (!userData.status) {
        userData.status = "active";
      }
      if (!userData.role) {
        userData.role = "sales";
      }

      return await prisma.user.create({
        data: userData,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return null;
      }

      // Don't allow updating email if it exists and belongs to another user
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (emailExists) {
          throw new Error("Email already in use by another user");
        }
      }

      return await prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(id, status) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return null;
      }

      await prisma.user.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

const userServices = new UserServices();
export default userServices;
import userServices from "./user.service.js";
import { HTTP_STATUS, MESSAGES } from "./user.constant.js";

class UserController {
  // GET /api/users/status/:email - Check if user account is active
  async getUserStatus(req, res) {
    try {
      const { email } = req.params;
      const { role, email: tokenEmail } = req.user;

      // Regular users can only check their own status
      if (role !== "super-admin" && email !== tokenEmail) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN,
        });
      }

      const result = await userServices.getUserStatus(email);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        active: result.isActive,
      });
    } catch (err) {
      console.error("Error fetching user status:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // GET /api/users/admin/:email - Check if user is admin
  async checkIsAdmin(req, res) {
    try {
      const { email } = req.params;
      const { role, email: tokenEmail, officeId: tokenOfficeId } = req.user;

      // Regular users can only check their own admin status
      if (role !== "super-admin" && email !== tokenEmail) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN,
        });
      }

      const result = await userServices.checkIsAdmin(email, tokenOfficeId, role);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        admin: result.isAdmin,
      });
    } catch (err) {
      console.error("Error checking if user is admin:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }

  // GET /api/users/super-admin/:email - Check if user is super-admin
  async checkIsSuperAdmin(req, res) {
    try {
      const { email } = req.params;
      const { role, email: tokenEmail, officeId: tokenOfficeId } = req.user;

      // Regular users can only check their own status
      if (role !== "super-admin" && email !== tokenEmail) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN,
        });
      }

      const result = await userServices.checkIsSuperAdmin(email, tokenOfficeId, role);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        isSuperAdmin: result.isSuperAdmin,
      });
    } catch (err) {
      console.error("Error checking if user is super-admin:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }

  // GET /api/users - Get current logged-in user
  async getCurrentUser(req, res) {
    try {
      const { email, role, officeId } = req.user;

      const user = await userServices.getUserByEmail(email);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      // Authorization: Super-admins can access any user, admins only within their office
      if (role !== "super-admin" && user.officeId !== officeId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED_OFFICE,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.error("Error fetching current user:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // GET /api/users/all - Get all users (Super-Admin only)
  async getAllUsers(req, res) {
    try {
      const users = await userServices.getAllUsers();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: users,
      });
    } catch (err) {
      console.error("Error fetching all users:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // GET /api/users/office - Get users in admin's office
  async getOfficeUsers(req, res) {
    try {
      const { officeId } = req.user;

      const users = await userServices.getUsersByOffice(officeId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: users,
      });
    } catch (err) {
      console.error("Error fetching office users:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // GET /api/users/:id - Get single user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await userServices.getUserById(id);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // POST /api/users - Create new user
  async createUser(req, res) {
    try {
      const { role, officeId: adminOfficeId } = req.user;
      let userData = req.body;

      // Only admins can add users to their own office
      if (role !== "super-admin") {
        userData.officeId = adminOfficeId;
      }

      const user = await userServices.createUser(userData);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.CREATED,
        data: user,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.CREATE_FAILED,
      });
    }
  }

  // PUT /api/users/:id - Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      const user = await userServices.updateUser(id, userData);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.UPDATED,
        data: user,
      });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  // PATCH /api/users/:id/status - Update user status
  async updateUserStatus(req, res) {
    try {
      const { role, officeId: adminOfficeId } = req.user;
      const { id } = req.params;
      const { status } = req.body;

      const user = await userServices.getUserById(id);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      // Restrict regular admins to their own office users
      if (role !== "super-admin" && user.officeId !== adminOfficeId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED_OFFICE,
        });
      }

      const updatedUser = await userServices.updateUserStatus(id, status);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.STATUS_UPDATED,
        data: updatedUser,
      });
    } catch (err) {
      console.error("Error updating user status:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  // DELETE /api/users/:id - Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deleted = await userServices.deleteUser(id);

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.DELETED,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.DELETE_FAILED,
      });
    }
  }
}

export default new UserController();
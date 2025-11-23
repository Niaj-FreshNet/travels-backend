import authServices from "./auth.service.js";
import { HTTP_STATUS, MESSAGES } from "./auth.constant.js";

class AuthController {
  // POST /api/auth/login - Generate JWT token
  async login(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ERROR.EMAIL_REQUIRED,
        });
      }

      const result = await authServices.generateToken(email);
      console.log(result)

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.LOGIN,
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      console.error("Error in login:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }

  // POST /api/auth/refresh - Refresh JWT token
  async refreshToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ERROR.TOKEN_REQUIRED,
        });
      }

      const result = await authServices.refreshToken(token);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          message: result.message,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.TOKEN_REFRESHED,
        token: result.token,
      });
    } catch (err) {
      console.error("Error in refresh token:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }

  // GET /api/auth/verify - Verify if token is valid
  async verifyToken(req, res) {
    try {
      // If middleware passes, token is valid
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.TOKEN_VALID,
        user: req.user,
      });
    } catch (err) {
      console.error("Error in verify token:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }

  // POST /api/auth/logout - Logout (optional)
  async logout(req, res) {
    try {
      // In stateless JWT, logout is handled client-side by removing token
      // You can implement token blacklisting here if needed
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.LOGOUT,
      });
    } catch (err) {
      console.error("Error in logout:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_ERROR,
      });
    }
  }
}

export default new AuthController();
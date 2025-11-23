import paymentServices from "./payment.service.js";
import { HTTP_STATUS, MESSAGES } from "./payment.constant.js";

class PaymentController {
  // GET /api/payments - Get all payments (Admin/Super-Admin only)
  async getPayments(req, res) {
    try {
      const { role } = req.user;

      // Restrict access for sales users
      if (role === "sales") {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          error: "Access denied: Sales users cannot view payments",
        });
      }

      const result = await paymentServices.getAllPayments({
        user: req.user,
        query: req.query,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("Error fetching payments:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // GET /api/payments/:id - Get single payment by ID
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await paymentServices.getPaymentById(id, req.user);

      if (!payment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payment,
      });
    } catch (err) {
      console.error("Error fetching payment:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  // POST /api/payments - Create new payment
  async createPayment(req, res) {
    try {
      const { role } = req.user;

      // Restrict access for sales users
      if (role === "sales") {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          error: "Access denied: Sales users cannot create payments",
        });
      }

      const payment = await paymentServices.createPayment(req.body, req.user);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.CREATED,
        data: payment,
      });
    } catch (err) {
      console.error("Error creating payment:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.CREATE_FAILED,
      });
    }
  }

  // PUT /api/payments/:id - Update payment
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const payment = await paymentServices.updatePayment(
        id,
        req.body,
        req.user
      );

      if (!payment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.UPDATED,
        data: payment,
      });
    } catch (err) {
      console.error("Error updating payment:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  // DELETE /api/payments/:id - Delete payment
  async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await paymentServices.deletePayment(id, req.user);

      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.DELETED,
      });
    } catch (err) {
      console.error("Error deleting payment:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.DELETE_FAILED,
      });
    }
  }
}

export const paymentController = new PaymentController();

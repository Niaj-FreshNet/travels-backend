import supplierServices from "./supplier.service.js";
import { HTTP_STATUS, MESSAGES } from "./supplier.constant.js";

class SupplierController {
  async getSuppliers(req, res) {
    try {
      const result = await supplierServices.getAllSuppliers({
        user: req.user,
        query: req.query,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  async getSupplierById(req, res) {
    try {
      const { id } = req.params;
      const supplier = await supplierServices.getSupplierById(id, req.user);
      if (!supplier) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({ success: true, data: supplier });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  async createSupplier(req, res) {
    try {
      const supplier = await supplierServices.createSupplier(req.body, req.user);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.CREATED,
        data: supplier,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.CREATE_FAILED,
      });
    }
  }

  async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await supplierServices.updateSupplier(id, req.body, req.user);
      if (!supplier) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.UPDATED,
        data: supplier,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  async updateSupplierStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const supplier = await supplierServices.updateSupplierStatus(id, status, req.user);
      if (!supplier) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.STATUS_UPDATED,
        data: supplier,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const deleted = await supplierServices.deleteSupplier(id, req.user);
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
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.DELETE_FAILED,
      });
    }
  }

  // Special: Update totalDue by supplierName (used in sales/payment)
  async updateSupplierTotalDue(req, res) {
    try {
      const { supplierName } = req.params;
      const { totalDue } = req.body;
      const supplier = await supplierServices.updateTotalDueByName(supplierName, totalDue);
      if (!supplier) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: "Supplier not found",
        });
      }
      res.status(HTTP_STATUS.OK).json({ success: true, data: supplier });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || "Failed to update supplier due",
      });
    }
  }
}

export const supplierController = new SupplierController();
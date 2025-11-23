import clientAreaServices from "./clientArea.service.js";
import { HTTP_STATUS, MESSAGES } from "./clientArea.constant.js";

class ClientAreaController {
  async createClientArea(req, res) {
    try {
      const { officeName, officeId, officeAddress } = req.body;

      if (!officeName || !officeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "officeName and officeId are required",
        });
      }

      const clientArea = await clientAreaServices.createClientArea({
        officeName,
        officeId,
        officeAddress,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.CREATED,
        data: clientArea,
      });
    } catch (err) {
      console.error("Error creating client area:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.CREATE_FAILED,
      });
    }
  }

  async getAllClientAreas(req, res) {
    try {
      const result = await clientAreaServices.getAllClientAreas(req.query);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("Error fetching client areas:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  async deleteClientArea(req, res) {
    try {
      const { id } = req.params;
      const deleted = await clientAreaServices.deleteClientArea(id);

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
      console.error("Error deleting client area:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.DELETE_FAILED,
      });
    }
  }
}

export const clientAreaController = new ClientAreaController();
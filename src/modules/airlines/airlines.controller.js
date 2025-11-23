import airlineServices from "./airlines.service.js";
import { HTTP_STATUS, MESSAGES } from "./airlines.constant.js";

class AirlineController {
  async getAirlines(req, res) {
    try {
      const result = await airlineServices.getAllAirlines(req.query);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("Error fetching airlines:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  async getAirlineById(req, res) {
    try {
      const { id } = req.params;
      const airline = await airlineServices.getAirlineById(id);
      if (!airline) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({ success: true, data: airline });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.FETCH_FAILED,
      });
    }
  }

  async createAirline(req, res) {
    try {
      const airline = await airlineServices.createAirline(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.CREATED,
        data: airline,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.CREATE_FAILED,
      });
    }
  }

  async updateAirline(req, res) {
    try {
      const { id } = req.params;
      const airline = await airlineServices.updateAirline(id, req.body);
      if (!airline) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.UPDATED,
        data: airline,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  async updateAirlineStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const airline = await airlineServices.updateAirlineStatus(id, status);
      if (!airline) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: MESSAGES.ERROR.NOT_FOUND,
        });
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.STATUS_UPDATED,
        data: airline,
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
      });
    }
  }

  async deleteAirline(req, res) {
    try {
      const { id } = req.params;
      const deleted = await airlineServices.deleteAirline(id);
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
}

export const airlineController = new AirlineController();
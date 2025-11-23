export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  SUCCESS: {
    CREATED: "Airline created successfully",
    UPDATED: "Airline updated successfully",
    STATUS_UPDATED: "Airline status updated",
    DELETED: "Airline deleted successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch airlines",
    CREATE_FAILED: "Failed to create airline",
    UPDATE_FAILED: "Failed to update airline",
    DELETE_FAILED: "Failed to delete airline",
    NOT_FOUND: "Airline not found",
  },
};
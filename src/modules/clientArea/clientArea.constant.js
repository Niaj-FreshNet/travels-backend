export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  SUCCESS: {
    CREATED: "Office created successfully",
    DELETED: "Office deleted successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch offices",
    CREATE_FAILED: "Failed to create office",
    DELETE_FAILED: "Failed to delete office",
    NOT_FOUND: "Office not found",
  },
};
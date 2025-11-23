export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  SUCCESS: {
    CREATED: "Supplier created successfully",
    UPDATED: "Supplier updated successfully",
    STATUS_UPDATED: "Supplier status updated",
    DELETED: "Supplier deleted successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch suppliers",
    CREATE_FAILED: "Failed to create supplier",
    UPDATE_FAILED: "Failed to update supplier",
    DELETE_FAILED: "Failed to delete supplier",
    NOT_FOUND: "Supplier not found",
  },
};
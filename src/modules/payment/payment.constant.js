// -------------------- HTTP STATUS --------------------
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// -------------------- MESSAGES --------------------
export const MESSAGES = {
  SUCCESS: {
    CREATED: "Payment created successfully",
    UPDATED: "Payment updated successfully",
    DELETED: "Payment deleted successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch payments",
    CREATE_FAILED: "Failed to create payment",
    UPDATE_FAILED: "Failed to update payment",
    DELETE_FAILED: "Failed to delete payment",
    NOT_FOUND: "Payment not found",
    UNAUTHORIZED: "Unauthorized to access this payment",
    ACCESS_DENIED: "Access denied: Sales users cannot access payments",
  },
};

// -------------------- ROLES --------------------
export const ROLES = {
  SALES: "sales",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

// -------------------- PAYMENT METHODS --------------------
export const PAYMENT_METHODS = {
  CASH: "Cash",
  BANK: "Bank",
  CHEQUE: "Cheque",
  CARD: "Card",
  ONLINE: "Online",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
};

// -------------------- SEARCH FIELDS --------------------
export const SEARCH_FIELDS = [
  "method",
  "createdBy",
  "officeId",
];

// -------------------- PAGINATION DEFAULTS --------------------
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  DEFAULT_SORT: "-createdAt",
  MAX_LIMIT: 100,
};

// -------------------- DATE FORMATS --------------------
export const DATE_FORMATS = {
  API: "YYYY-MM-DD",
  DISPLAY: "DD/MM/YYYY",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
};
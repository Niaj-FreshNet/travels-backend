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
    CREATED: "Sale created successfully",
    UPDATED: "Sale updated successfully",
    DELETED: "Sale deleted successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch sales",
    CREATE_FAILED: "Failed to create sale",
    UPDATE_FAILED: "Failed to update sale",
    DELETE_FAILED: "Failed to delete sale",
    NOT_FOUND: "Sale not found",
    UNAUTHORIZED: "Unauthorized to access this sale",
  },
};

// -------------------- ROLES --------------------
export const ROLES = {
  SALES: "sales",
  ADMIN: "admin",
  SUPER_ADMIN: "superAdmin",
};

// -------------------- ACCOUNT TYPES --------------------
export const ACCOUNT_TYPES = {
  CREDIT: "Credit",
  DEBIT: "Debit",
};

// -------------------- MODES --------------------
export const MODES = {
  CASH: "Cash",
  CREDIT: "Credit",
  CHEQUE: "Cheque",
  CARD: "Card",
  ONLINE: "Online",
};

// -------------------- POST STATUS --------------------
export const POST_STATUS = {
  PENDING: "Pending",
  POSTED: "Posted",
};

// -------------------- PAYMENT STATUS --------------------
export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  DUE: "Due",
  CANCELLED: "Cancelled",
};

// -------------------- SEARCH FIELDS --------------------
export const SEARCH_FIELDS = [
  "documentNumber",
  "passengerName",
  "supplierName",
  "rvNumber",
  "sector",
  "airlineCode",
  "iataName",
  "sellBy",
  "officeId",
];

// -------------------- PAGINATION DEFAULTS --------------------
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  DEFAULT_SORT: "-date",
  MAX_LIMIT: 100,
};

// -------------------- DATE FORMATS --------------------
export const DATE_FORMATS = {
  API: "YYYY-MM-DD",
  DISPLAY: "DD/MM/YYYY",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
};

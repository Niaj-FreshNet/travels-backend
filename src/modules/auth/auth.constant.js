// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Auth Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    TOKEN_VALID: "Token is valid",
  },
  ERROR: {
    EMAIL_REQUIRED: "Email is required",
    TOKEN_REQUIRED: "Token is required",
    USER_NOT_FOUND: "User not found",
    ACCOUNT_INACTIVE: "Account is inactive",
    INVALID_CREDENTIALS: "Invalid credentials",
    INTERNAL_ERROR: "Internal server error",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",
  },
};

// Token Configuration
export const TOKEN_CONFIG = {
  EXPIRES_IN: "24h",
  REFRESH_EXPIRES_IN: "7d",
  ALGORITHM: "HS256",
};

// User Status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

export default {
  HTTP_STATUS,
  MESSAGES,
  TOKEN_CONFIG,
  USER_STATUS,
};
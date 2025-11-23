// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// User Messages
export const MESSAGES = {
  SUCCESS: {
    CREATED: "User created successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
    STATUS_UPDATED: "User status updated successfully",
  },
  ERROR: {
    FETCH_FAILED: "Failed to fetch user(s)",
    CREATE_FAILED: "Failed to create user",
    UPDATE_FAILED: "Failed to update user",
    DELETE_FAILED: "Failed to delete user",
    NOT_FOUND: "User not found",
    FORBIDDEN: "Forbidden access",
    UNAUTHORIZED_OFFICE: "Unauthorized Office access",
    EMAIL_EXISTS: "User with this email already exists",
  },
};

// User Roles
export const USER_ROLES = {
  SALES: "sales",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

// User Status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

// User Fields for Selection
export const USER_SELECT_FIELDS = {
  PUBLIC: {
    id: true,
    email: true,
    name: true,
    role: true,
    status: true,
    officeId: true,
    createdAt: true,
  },
  PRIVATE: {
    id: true,
    email: true,
    name: true,
    role: true,
    status: true,
    officeId: true,
    createdAt: true,
    updatedAt: true,
  },
};

export default {
  HTTP_STATUS,
  MESSAGES,
  USER_ROLES,
  USER_STATUS,
  USER_SELECT_FIELDS,
};
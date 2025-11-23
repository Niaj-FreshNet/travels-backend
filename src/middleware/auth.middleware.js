import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access - No token provided",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access - Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    req.user = {
      email: decoded.email,
      role: decoded.role,
      status: decoded.status,
      officeId: decoded.officeId,
    };

    req.decoded = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};

export default verifyToken;

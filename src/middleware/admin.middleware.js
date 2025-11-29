import prisma from "../config/db.js"; // ensure db.js uses ESM export

const verifyAdmin = async (req, res, next) => {
  try {
    const { email, officeId, role } = req.user || req.decoded;
    
    if (role !== "admin" && role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access: NOT ADMIN",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        role: true,
        officeId: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin" && user.officeId !== officeId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access: NOT ADMIN or Unauthorized Office",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization",
    });
  }
};

export default verifyAdmin;

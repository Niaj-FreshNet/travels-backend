import prisma from "../config/db.js"; // ensure db.js uses ESM export

const verifySuperAdmin = async (req, res, next) => {
  try {
    const { email, role } = req.user || req.decoded;

    if (role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access: NOT SUPER-ADMIN",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "super-admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Super-Admin access only",
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
    console.error("Error in verifySuperAdmin middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization",
    });
  }
};

export default verifySuperAdmin;

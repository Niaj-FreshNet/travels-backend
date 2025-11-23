import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";

class SupplierServices {
  async getAllSuppliers({ user, query }) {
    const { role, officeId } = user;
    let where = {};

    if (role === "sales" || role === "admin") {
      where.officeId = officeId;
    }

    return paginate(prisma.supplier, where, {
      page: query.page,
      limit: query.limit || 25,
      sort: query.sort || "supplierName",
      search: query.search,
      searchFields: ["supplierName", "accountType"],
    });
  }

  async getSupplierById(id, user) {
    const { role, officeId } = user;
    const where = { id };
    if (role === "sales" || role === "admin") {
      where.officeId = officeId;
    }
    return prisma.supplier.findFirst({ where });
  }

  async createSupplier(data, user) {
    return prisma.supplier.create({
      data: {
        ...data,
        createdBy: user.email,
        officeId: user.officeId,
      },
    });
  }

  async updateSupplier(id, data, user) {
    const { role, officeId } = user;
    const where = { id };
    if (role === "sales" || role === "admin") where.officeId = officeId;

    const supplier = await prisma.supplier.findFirst({ where });
    if (!supplier) return null;

    return prisma.supplier.update({ where: { id }, data });
  }

  async updateSupplierStatus(id, status, user) {
    const { role, officeId } = user;
    const where = { id };
    if (role === "sales" || role === "admin") where.officeId = officeId;

    return prisma.supplier.update({ where: { id }, data: { status } });
  }

  async deleteSupplier(id, user) {
    const { role, officeId } = user;
    const where = { id };
    if (role === "sales" || role === "admin") where.officeId = officeId;

    const supplier = await prisma.supplier.findFirst({ where });
    if (!supplier) return null;

    await prisma.supplier.delete({ where: { id } });
    return true;
  }

  async updateTotalDueByName(supplierName, totalDue) {
    return prisma.supplier.updateMany({
      where: { supplierName },
      data: { totalDue: Number(totalDue) },
    }).then(() => prisma.supplier.findFirst({ where: { supplierName } }));
  }
}

const supplierServices = new SupplierServices();
export default supplierServices;
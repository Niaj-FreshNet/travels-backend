import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";

class ClientAreaServices {
  async createClientArea(data) {
    const { officeName, officeId, officeAddress } = data;

    // Prevent duplicate officeId
    const existing = await prisma.clientArea.findUnique({
      where: { officeId },
    });
    if (existing) {
      throw new Error("Office ID already exists");
    }

    return prisma.clientArea.create({
      data: {
        officeName,
        officeId,
        officeAddress: officeAddress || "",
        status: "active",
      },
    });
  }

  async getAllClientAreas(query) {
    return paginate(prisma.clientArea, {}, {
      page: query.page,
      limit: query.limit || 20,
      sort: query.sort || "officeName",
      search: query.search,
      searchFields: ["officeName", "officeId", "officeAddress"],
    });
  }

  async deleteClientArea(id) {
    const clientArea = await prisma.clientArea.findUnique({ where: { id } });
    if (!clientArea) return null;

    // Optional: Prevent deletion if users/suppliers/sales exist under this office
    // Uncomment if needed:
    /*
    const hasUsers = await prisma.user.count({ where: { officeId: clientArea.officeId } });
    if (hasUsers > 0) throw new Error("Cannot delete office with active users");
    */

    await prisma.clientArea.delete({ where: { id } });
    return true;
  }
}

const clientAreaServices = new ClientAreaServices();
export default clientAreaServices;
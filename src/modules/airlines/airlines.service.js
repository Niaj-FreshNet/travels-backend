import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";

class AirlineServices {
  async getAllAirlines(query) {
    return paginate(prisma.airline, {}, {
      page: query.page,
      limit: query.limit || 25,
      sort: query.sort || "airlineName",
      search: query.search,
      searchFields: ["airlineName", "iataName", "airlineCode"],
    });
  }

  async getAirlineById(id) {
    return prisma.airline.findUnique({ where: { id } });
  }

  async createAirline(data) {
    return prisma.airline.create({ data });
  }

  async updateAirline(id, data) {
    return prisma.airline.update({ where: { id }, data });
  }

  async updateAirlineStatus(id, status) {
    return prisma.airline.update({
      where: { id },
      data: { status },
    });
  }

  async deleteAirline(id) {
    const airline = await prisma.airline.findUnique({ where: { id } });
    if (!airline) return null;
    await prisma.airline.delete({ where: { id } });
    return true;
  }
}

const airlineServices = new AirlineServices();
export default airlineServices;
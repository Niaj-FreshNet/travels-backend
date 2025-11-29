const paginate = async (model, where = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
    search = "",
    searchFields = [],
  } = options;

  const skip = (page - 1) * limit;
  const orderField = sort.replace(/^-/, "");
  const orderDir = sort.startsWith("-") ? "desc" : "asc";

  let query = { ...where };

  if (search && searchFields.length > 0) {
    query = {
      AND: [
        where,
        {
          OR: searchFields.map(field => ({
            [field]: { contains: search, mode: "insensitive" }
          }))
        }
      ]
    };
  }

  const [total, data] = await Promise.all([
    model.count({ where: query }),
    model.findMany({
      where: query,
      orderBy: { [orderField]: orderDir },
      skip,
      take: +limit,
    }),
  ]);

  return {
    data,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export default paginate;
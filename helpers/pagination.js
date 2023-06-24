export const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? (page-1) * limit : 0;
    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const rows = data.rows.map(us => us.dataValues);
    const { count: totalItems } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, rows, totalPages, currentPage };
};

export const paginate = async (data, params, limit) => {
    const { size, page_no } = params;
    const rows = data.rows.map(us => us.dataValues);
    const { totalItems, totalPages, currentPage } = getPagingData(data, page_no, limit);
    return {
        totalItems,
        rows,
        currentPage,
        totalPages,
        size:5
    };
};
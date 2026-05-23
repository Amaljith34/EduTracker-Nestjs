export type PaginationQuery = {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  subscriberId?: string;
};

export const getPagination = (query: PaginationQuery) => {
  const page = Math.max(1, parseInt(String(query.page || 1), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 10), 10)));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  return { page, limit, skip, sort: { [sortBy]: sortOrder as 1 | -1 } };
};

export const paginated = <T>(data: T[], total: number, page: number, limit: number) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  },
});

export type DateFilterQuery = {
  fromDate?: string;
  toDate?: string;
  period?: 'all' | 'lastMonth' | 'month' | 'year';
};

/** Parse YYYY-MM-DD (or ISO) as local calendar date to avoid UTC day-shift bugs */
export const parseLocalDate = (value: string, endOfDay = false): Date => {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]) - 1;
    const day = Number(dateOnly[3]);
    if (endOfDay) {
      return new Date(year, month, day, 23, 59, 59, 999);
    }
    return new Date(year, month, day, 0, 0, 0, 0);
  }
  const d = new Date(value);
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Resolve from/to range.
 * Custom fromDate/toDate take precedence over period when both are provided.
 */
export const resolveDateRange = (query: DateFilterQuery) => {
  const now = new Date();
  let fromDate = query.fromDate ? parseLocalDate(query.fromDate, false) : undefined;
  let toDate = query.toDate ? parseLocalDate(query.toDate, true) : undefined;

  const hasCustomRange = Boolean(query.fromDate || query.toDate);

  if (!hasCustomRange && query.period === 'lastMonth') {
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    fromDate = lastMonthStart;
    toDate = lastMonthEnd;
  } else if (!hasCustomRange && query.period === 'month') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    toDate = new Date(now);
    toDate.setHours(23, 59, 59, 999);
  } else if (!hasCustomRange && query.period === 'year') {
    fromDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    toDate = new Date(now);
    toDate.setHours(23, 59, 59, 999);
  }

  if (toDate && !query.toDate) {
    // already end-of-day for period branches
  } else if (toDate && query.toDate) {
    // parseLocalDate already set end of day
  }

  return { fromDate, toDate };
};

export const dateRangeMatch = (
  field: string,
  fromDate?: Date,
  toDate?: Date,
): Record<string, unknown> => {
  if (!fromDate && !toDate) return {};
  const range: Record<string, Date> = {};
  if (fromDate) range.$gte = fromDate;
  if (toDate) range.$lte = toDate;
  return { [field]: range };
};

export function toYearMonthDay(date: Date | number | string | null) {
  if (!date) date = new Date();
  else date = new Date(date);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return [year, month.toString().padStart(2, "0"), day].join("-");
}

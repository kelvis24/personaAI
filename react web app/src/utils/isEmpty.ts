/**
 * @description
 * Check if value given is empty/null/undefined
 *
 * @param value any type
 * @returns
 */
export const isEmpty = (value: any) => {
  if (value === null) return true;
  if (typeof value === "undefined") return true;
  if (typeof value === "string") return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  if (typeof value === "number") return false;
};

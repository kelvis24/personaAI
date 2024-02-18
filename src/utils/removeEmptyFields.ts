import { isEmpty } from "./isEmpty";

/**
 * Trim given object and only return the trimmed object with fields that are not empty
 *
 * @param initialObject any object of the form { [key: string]: [value: any]}
 * @returns
 */
export const removeEmptyFields = (initialObject: Record<string, any>) => {
  if (!initialObject) return initialObject;
  let trimmedValue: Record<any, any> = {};
  Object.entries(initialObject).forEach((val) => {
    const key = val[0];
    const value = val[1];
    if (!isEmpty(value)) {
      trimmedValue = { ...trimmedValue, [key]: value };
    }
  });
  return trimmedValue;
};

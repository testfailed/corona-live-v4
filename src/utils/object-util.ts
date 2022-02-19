export const formatObjectValues = <T extends {}>(
  object: T,
  format: (value: T[keyof T] | any, key?: keyof T) => any
) => {
  return Object.fromEntries(
    (Object.entries(object) as [keyof T, T[keyof T]][]).map(([key, value]) => [
      key,
      format(value, key),
    ])
  );
};

export const removeNullFromObject = <T extends {}>(object: T) => {
  return Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== null)
  );
};

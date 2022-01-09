export const chunkArray = <T>(
  _array: Array<T>,
  chunkSize: number
): Array<Array<T>> => {
  const chunkedArray: Array<Array<T>> = [];
  const array = [..._array];
  while (array.length > 0) {
    const chunk = array.splice(0, chunkSize);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
};

export const createEmptyArray = (columns: number, rows?: number) => {
  const array = [...Array(columns)];
  return rows ? array.map(() => [...Array(rows)]) : array;
};

export const isArrayEqual = <T>(
  arrayA: Array<string | number>,
  arrayB: Array<string | number>
) => {
  if (arrayA.length !== arrayB.length) return false;

  const arrayASorted = arrayA.slice().sort();
  const arrayBSorted = arrayB.slice().sort();

  return arrayASorted.every((value, index) => value === arrayBSorted[index]);
};

export const arrayToObject = (array: Array<string | number>) => {
  return array.reduce((obj, element) => ({ ...obj, [element]: true }), {});
};

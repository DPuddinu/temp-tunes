export function spliceArray(array: any[], size: number) {
  const newArray = [];
  while (array.length) {
    newArray.push(array.splice(0, size));
  }
  return newArray;
}

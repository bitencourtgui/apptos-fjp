export function cleanText(input: string) {
  const output = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/"/g, "")
    .toLowerCase();
  return output;
}

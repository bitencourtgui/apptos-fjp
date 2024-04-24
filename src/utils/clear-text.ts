export function cleanText(input: string) {
  const output = input
    .normalize('NFD') // Decompose accented characters into their base character and accent
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/"/g, '') // Remove double quotes
    .toLowerCase(); // Convert to lowercase
  return output;
}
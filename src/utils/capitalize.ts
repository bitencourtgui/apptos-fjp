export function capitalize(text: string) {
  const words = text?.split(" ");

  return words?.map((word) => capitalizeWord(word)).join(" ");
}

function capitalizeWord(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

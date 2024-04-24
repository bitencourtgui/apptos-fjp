export const extensionFiles = (file: string): string => {
  const extensao = file.split(".").pop()?.toLowerCase();

  switch (extensao) {
    case "pdf":
      return "/assets/files/icon-pdf.svg";
    case "jpg":
    case "jpeg":
      return "/assets/files/icon-jpg.svg";
    case "svg":
      return "/assets/files/icon-svg.svg";
    case "png":
      return "/assets/files/icon-png.svg";
    default:
      return "/assets/files/icon-other.svg";
  }
};

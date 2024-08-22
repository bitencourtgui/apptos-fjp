type MaritalStatus = "single" | "married" | "divorced" | "widowed";
type Gender = "male" | "female";

const maritalStatusTranslations: Record<MaritalStatus, { male: string; female: string }> = {
  single: { male: "Solteiro", female: "Solteira" },
  married: { male: "Casado", female: "Casada" },
  divorced: { male: "Divorciado", female: "Divorciada" },
  widowed: { male: "Viúvo", female: "Viúva" },
};

export function translateMaritalStatus(maritalStatus: MaritalStatus, gender: Gender): string {
  const translation = maritalStatusTranslations[maritalStatus];
  return translation ? ` ${translation[gender]},` : "";
}

export const maskPhone = (inputNumber: string): string | undefined => {
  if (inputNumber === undefined || inputNumber === '') {
    return inputNumber;
  }

  const cleaned = inputNumber?.replace(/\D/g, ''); // Remover caracteres não numéricos

  // Identificar se é um telefone ou celular
  const isMobile = cleaned.length === 11;

  // Aplicar a máscara apropriada
  const formatted = isMobile
    ? `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}` // Máscara para celular
    : `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`; // Máscara para telefone

  return formatted;
};

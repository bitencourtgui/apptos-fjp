export const maskDocument = (document: string) => {
  if (document && typeof document === 'string') {
    document = document.replace(/\D/g, '');

    if (document.length === 11) {
      // CPF
      document = document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (document.length === 14) {
      // CNPJ
      document = document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return document;
  }

  return document;
};

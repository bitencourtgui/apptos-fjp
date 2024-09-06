/* eslint-disable prefer-named-capture-group */
export const maskDocument = (document: string): string => {
  let sanitizedDocument = document;

  if (sanitizedDocument && typeof sanitizedDocument === 'string') {
    sanitizedDocument = sanitizedDocument.replace(/\D/g, '');

    if (sanitizedDocument.length === 11) {
      sanitizedDocument = sanitizedDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (sanitizedDocument.length === 14) {
      sanitizedDocument = sanitizedDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return sanitizedDocument;
  }

  return document;
};

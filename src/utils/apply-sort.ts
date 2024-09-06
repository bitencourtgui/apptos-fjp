type Document = Record<string, any>; // Ajuste o tipo conforme a estrutura dos documentos.

function descendingComparator<T>(a: T, b: T, sortBy: keyof T): number {
  // Quando comparado a algo indefinido, sempre retorna false.
  // Isso significa que se um campo não existir em qualquer elemento ('a' ou 'b'), o retorno será 0.

  if (b[sortBy] < a[sortBy]) {
    return -1;
  }

  if (b[sortBy] > a[sortBy]) {
    return 1;
  }

  return 0;
}

function getComparator<T>(sortDir: 'asc' | 'desc', sortBy: keyof T) {
  return (sortDir === 'desc'
    ? (a: T, b: T) => descendingComparator(a, b, sortBy)
    : (a: T, b: T) => -descendingComparator(a, b, sortBy));
}

export function applySort<T>(documents: T[], sortBy: keyof T, sortDir: 'asc' | 'desc'): T[] {
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = documents.map((el, index) => [el, index] as [T, number]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

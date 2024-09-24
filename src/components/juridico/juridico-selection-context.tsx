'use client';

import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
import type { Selection } from '@/hooks/use-selection';

import type { IProcess } from './juridico-tabela';

function noop(): void {
  return undefined;
}

export interface JuridicoSelectionContextValue extends Selection {}

export const JuridicoSelectionContext = React.createContext<JuridicoSelectionContextValue>({
  deselectAll: noop,
  deselectOne: noop,
  selectAll: noop,
  selectOne: noop,
  selected: new Set(),
  selectedAny: false,
  selectedAll: false,
});

interface JuridicoSelectionProviderProps {
  children: React.ReactNode;
  juridico: IProcess[];
}

export function JuridicoSelectionProvider({
  children,
  juridico = [],
}: JuridicoSelectionProviderProps): React.JSX.Element {
  const juridicoIds = React.useMemo(() => juridico.map((juridico) => juridico.id), [juridico]);
  const selection = useSelection(juridicoIds);

  return <JuridicoSelectionContext.Provider value={{ ...selection }}>{children}</JuridicoSelectionContext.Provider>;
}

export function useJuridicoSelection(): JuridicoSelectionContextValue {
  return React.useContext(JuridicoSelectionContext);
}

import { RenderStructural, structuralComponent } from '../core';
import { Th, ThProps } from './Th';
import { Td, TdProps } from './Td';
import { ArgOfChildren, StructuralElement } from '../internals';
import { useStructuralChildren } from '../core/useStructuralChildren';
import { useMemo } from 'react';


export type ColumnDefProps = {
  id: string;
  sortable?: boolean;
};

export type ColumnDefData = {
  id: string,
  sortable?: boolean,
  RenderTh: (p: ArgOfChildren<ThProps>) => JSX.Element,
  RenderTd: (p: ArgOfChildren<TdProps>) => JSX.Element,
};

export const ColumnDef = structuralComponent<ColumnDefProps, StructuralElement<ThProps> | StructuralElement<TdProps>, ColumnDefData>(({
  id,
  sortable,
}) => {
  const RenderTh = useStructuralChildren(Th);
  const RenderTd = useStructuralChildren(Td);
  const columnData = useMemo(() => {
    return {
      id,
      sortable,
      RenderTh,
      RenderTd,
    };
  }, [id, sortable]);

  return <RenderStructural.Data data={columnData}/>;
}, 'ColumnDef');

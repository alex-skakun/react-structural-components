import { useMemo } from 'react';
import { RenderStructural, structuralComponent, useStructuralChildren } from '../../core';
import { ArgOfChildren, StructuralElement } from '../../internals';
import { Td, TdProps } from './Td';
import { Th, ThProps } from './Th';


export type ColumnDefProps = {
  id: string;
  sortable?: boolean;
  children: (StructuralElement<ThProps> | StructuralElement<TdProps>)[];
};

export type ColumnDefData = {
  id: string,
  sortable?: boolean,
  RenderTh: (p: ArgOfChildren<ThProps>) => JSX.Element,
  RenderTd: (p: ArgOfChildren<TdProps>) => JSX.Element,
};

export const ColumnDef = structuralComponent<ColumnDefProps, ColumnDefData>(({ id, sortable }) => {
  const RenderTh = useStructuralChildren(Th);
  const RenderTd = useStructuralChildren(Td);
  const columnData = useMemo(() => {
    return {
      id,
      sortable,
      RenderTh,
      RenderTd
    };
  }, [id, sortable]);

  return <RenderStructural.Data data={columnData}/>;
}, 'ColumnDef', [Th, Td]);

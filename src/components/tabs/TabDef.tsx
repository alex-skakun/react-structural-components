import { FunctionComponent, useMemo } from 'react';
import { RenderStructural, structuralComponent, useStructuralChildren } from '../../core';
import { ArgOfChildren, PropsOfChild, StructuralElement } from '../../internals';
import { TabContent, TabContentProps } from './TabContent';
import { TabLabel, TabLabelProps } from './TabLabel';


export interface TabDefProps {
  id: string;
  disabled?: boolean;
  children: [StructuralElement<TabLabelProps>, StructuralElement<TabContentProps>];
}

export interface TabDefData {
  id: string;
  disabled: boolean;
  Label: FunctionComponent<ArgOfChildren<TabLabelProps>>
  Content: FunctionComponent;
}

export const TabDef = structuralComponent<TabDefProps, TabDefData>(({ id, disabled = false }) => {
  const Label = useStructuralChildren(TabLabel);
  const Content = useStructuralChildren(TabContent);
  const data = useMemo(() => ({
    id,
    disabled,
    Label,
    Content,
  }), [id, disabled]);

  return <RenderStructural.Data data={data} />;
}, 'TabDef', [TabLabel, TabContent]);

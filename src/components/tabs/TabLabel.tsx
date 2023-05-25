import { ReactNode } from 'react';
import { RenderStructural, structuralComponent } from '../../core';


export interface TabLabelProps {
  children: ReactNode | ((state: { disabled: boolean }) => ReactNode);
}

export const TabLabel = structuralComponent<TabLabelProps, never>(({children}) => {
  return <RenderStructural.JSX>{children}</RenderStructural.JSX>
}, 'TabLabel');

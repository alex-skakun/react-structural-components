import { ReactNode } from 'react';
import { RenderStructural, structuralComponent } from '../../core';


export interface TabContentProps {
  children: ReactNode;
}

export const TabContent = structuralComponent<TabContentProps, never>(({ children}) => {
  return <RenderStructural.JSX>{children}</RenderStructural.JSX>
}, 'TabContent');

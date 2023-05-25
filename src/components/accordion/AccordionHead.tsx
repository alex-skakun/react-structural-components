import { ReactNode } from 'react';
import { RenderStructural, structuralComponent } from '../../core';


export interface AccordionHeadProps {
  children: ReactNode | ((state: { expanded: boolean }) => ReactNode);
}

export const AccordionHead = structuralComponent<AccordionHeadProps, never>(({ children }) => {
  return <RenderStructural.JSX>{children}</RenderStructural.JSX>;
}, 'AccordionHead');

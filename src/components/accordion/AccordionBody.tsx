import { ReactNode } from 'react';
import { RenderStructural, structuralComponent } from '../../core';


export interface AccordionBodyProps {
  children: ReactNode | {
    (state: { expanded: boolean }): ReactNode;
  };
}

export const AccordionBody = structuralComponent<AccordionBodyProps, never>(({ children }) => {
  return <RenderStructural.JSX>{children}</RenderStructural.JSX>;
}, 'AccordionBody');

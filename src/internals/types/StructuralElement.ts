import { ReactElement } from 'react';

import { StructuralComponent } from './StructuralComponent';


export type StructuralElement<Props,
  Child extends StructuralElement<any, any> = StructuralElement<any, any>,
  Data = never> = ReactElement<Props, StructuralComponent<Props, Child,  Data>>;

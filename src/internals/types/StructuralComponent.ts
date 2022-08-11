import { FunctionComponent } from 'react';

import { StructuralChildren } from './StructuralChildren';
import { StructuralElement } from './StructuralElement';
import { PropsOfChild } from './PropsOfChild';
import { DataOfChild } from './DataOfChild';
import { STRUCTURAL_COMPONENT_FLAG } from '../constants';


export interface StructuralComponent<
  Props,
  Child extends StructuralElement<any, any> = StructuralElement<any, any>,
  Data = never
> extends FunctionComponent<Props & { children: StructuralChildren<PropsOfChild<Child>, DataOfChild<Child>> }> {
  readonly STRUCTURAL_COMPONENT_FLAG: typeof STRUCTURAL_COMPONENT_FLAG;
  readonly SELECTOR: symbol;
  readonly displayName: string;
}

export interface DevStructuralComponent<
  Props,
  Child extends StructuralElement<any, any> = StructuralElement<any, any>,
  Data = never
  > extends FunctionComponent<Props & { children: StructuralChildren<PropsOfChild<Child>, DataOfChild<Child>> }> {
  STRUCTURAL_COMPONENT_FLAG?: typeof STRUCTURAL_COMPONENT_FLAG;
  SELECTOR?: symbol;
  displayName?: string;
}

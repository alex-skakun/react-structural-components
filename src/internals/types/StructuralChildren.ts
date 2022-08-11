import { ReactNode } from 'react';

import { AnyChild } from './AnyChild';
import { ArgOfChildren } from './ArgOfChildren';


export type StructuralChildren<Props, Data> =
  AnyChild<Props, Data>
  | AnyChild<Props, Data>[]
  | ((props: ArgOfChildren<Props>) => ReactNode);

import { ReactNode, useContext, useMemo } from 'react';
import { Observable } from 'rxjs';

import {
  ArgOfChildren,
  PropsOfChild,
  SafeChildren,
  StructuralComponent,
  StructuralComponentContext,
  StructuralContext,
  StructuralElement,
} from '../internals';


export function useStructural<P, C extends StructuralElement<any, any>, D>(
  selector: StructuralComponent<P, C, D>,
): Observable<{ data: D, children: SafeChildren<ReactNode, ArgOfChildren<PropsOfChild<C>>> }[]> {
  const structuralChildrenContext = useContext<StructuralComponentContext>(StructuralContext);

  return useMemo(() => structuralChildrenContext?.selectAllBy(selector.SELECTOR), [selector.SELECTOR]);
}

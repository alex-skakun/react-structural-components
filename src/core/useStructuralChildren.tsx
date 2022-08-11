import { useContext, useMemo } from 'react';
import { useFunction } from 'react-cool-hooks';
import { Render$ } from 'react-rx-tools';

import {
  ArgOfChildren,
  PropsOfChild,
  StructuralComponent,
  StructuralComponentContext,
  StructuralContext,
  StructuralElement,
} from '../internals';


export function useStructuralChildren<P, C extends StructuralElement<any, any>, D>(
  selector: StructuralComponent<P, C, D>,
): (props: ArgOfChildren<PropsOfChild<C>>) => JSX.Element | null {
  const structuralChildrenContext = useContext<StructuralComponentContext>(StructuralContext);
  const children$ = useMemo(() => structuralChildrenContext?.selectChildrenBy(selector.SELECTOR), [selector.SELECTOR]);

  return useFunction((props: ArgOfChildren<PropsOfChild<C>>) => {
    return <Render$ $={children$} definedOnly>
      {safeChildren => safeChildren.render(props)}
    </Render$>;
  });
}

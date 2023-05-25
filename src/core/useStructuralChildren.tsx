import { useContext, useMemo } from 'react';
import { useFunction } from 'react-cool-hooks';
import { Render$ } from 'react-rx-tools';

import { ArgOfChildren, StructuralComponent, StructuralComponentContext, StructuralContext } from '../internals';


export function useStructuralChildren<P, D>(
  selector: StructuralComponent<P, D>
): (props: ArgOfChildren<P>) => JSX.Element | null {
  const structuralChildrenContext = useContext<StructuralComponentContext>(StructuralContext);
  const children$ = useMemo(() => structuralChildrenContext?.selectChildrenBy(selector.SELECTOR), [selector.SELECTOR]);

  return useFunction((props: ArgOfChildren<P>) => {
    return <Render$ $={children$} definedOnly>
      {safeChildren => safeChildren.render(props)}
    </Render$>;
  });
}

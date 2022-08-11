import { PropsWithChildren, ReactNode, useContext, useMemo } from 'react';
import { SafeChildren, StructuralChildren, StructuralRendererContext, useChildrenChange } from '../internals';

export const RenderStructural = {
  Data<Data>({ data }: { data: Data }): null {
    const rendererContext = useContext(StructuralRendererContext);

    rendererContext.dataSubject.next(data);

    return null;
  },
  JSX<Args extends any[]>({ children }: { children: ReactNode | ((...args: Args) => ReactNode) }): null {
    const rendererContext = useContext(StructuralRendererContext);
    const [childrenArray, childrenChangeFlag] = useChildrenChange(children as StructuralChildren<any, any>);

    useMemo(() => {
      const safeChildren = new SafeChildren();

      childrenArray.forEach(child => safeChildren.push(child));

      rendererContext.childrenSubject.next(safeChildren);
    }, [childrenChangeFlag]);

    return null;
  },
};

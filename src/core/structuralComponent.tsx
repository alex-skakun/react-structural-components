import { ReactNode, useContext, useMemo } from 'react';
import { useFunction, useOnce } from 'react-cool-hooks';
import {
  _useStructuralComponentReport,
  ArgOfChildren,
  DataOfChild,
  DevStructuralComponent,
  PropsOfChild,
  SafeChildren,
  STRUCTURAL_COMPONENT_FLAG,
  StructuralComponent,
  StructuralComponentContext,
  StructuralContext,
  StructuralElement,
  StructuralRendererContext,
  useChildrenChange,
  useStructuralComponentContext,
} from '../internals';


interface ComponentHolder<Props, Child extends StructuralElement<any, any>, Data> {
  [selector: string]: DevStructuralComponent<Props, Child, Data>;
}

export function structuralComponent<Props, Child extends StructuralElement<any, any> = StructuralElement<any, any>, Data = never>(
  component: (props: Props) => JSX.Element | null,
  selector = 'StructuralComponent',
): StructuralComponent<Props, Child, Data> {
  const selectorSymbol = Symbol();
  const componentHolder: ComponentHolder<Props, Child, Data> = {
    [selector]({ children, ...props }): JSX.Element | null {
      const originalProps = props as unknown as Props;
      const [childrenArray, childrenChangeFlag] = useChildrenChange(children);
      const [structuralNodes, usualNodes] = useMemo(() => {
        const structural = new SafeChildren<Child>();
        const usual = new SafeChildren<ReactNode>();

        for (const child of childrenArray) {
          if (isStructuralChild<PropsOfChild<Child>, DataOfChild<Child>, Child>(child)) {
            structural.push(child);
          } else {
            usual.push(child);
          }
        }

        return [structural, usual];
      }, [childrenChangeFlag]);
      const [context, bufferSignal] = useStructuralComponentContext<DataOfChild<Child>, ArgOfChildren<PropsOfChild<Child>>>();

      const StructuralChildrenRenderer = useFunction(() => {
        return structuralNodes.render();
      });

      const BufferSignalRenderer = useFunction(() => {
        bufferSignal.next();

        return null;
      });

      const parentContext = useContext(StructuralContext);

      const StructuralParentRenderer = useFunction((props: Props & { children: SafeChildren }) => {
        const [report, rendererContext] = _useStructuralComponentReport(selectorSymbol);

        useOnce(() => {
          parentContext.reportAboutYourself(report);
        });

        return <StructuralRendererContext.Provider value={rendererContext}>
          {component(props)}
        </StructuralRendererContext.Provider>;
      });

      return <StructuralContext.Provider value={context as StructuralComponentContext}>
        <StructuralChildrenRenderer/>
        <BufferSignalRenderer/>
        <StructuralParentRenderer {...originalProps} children={usualNodes}/>
      </StructuralContext.Provider>;
    },
  };

  const StructuralComponent = componentHolder[selector] as DevStructuralComponent<Props, Child, Data>;

  StructuralComponent.STRUCTURAL_COMPONENT_FLAG = STRUCTURAL_COMPONENT_FLAG;
  StructuralComponent.SELECTOR = selectorSymbol;
  StructuralComponent.displayName = selector;

  return Object.freeze(StructuralComponent) as StructuralComponent<Props, Child, Data>;
}


function isStructuralChild<P, D, C extends StructuralElement<P, C, D>>(
  child: ReactNode | ((props: any) => ReactNode) | C,
): child is C {
  return (child as StructuralElement<P, C, D>)?.type?.STRUCTURAL_COMPONENT_FLAG === STRUCTURAL_COMPONENT_FLAG;
}

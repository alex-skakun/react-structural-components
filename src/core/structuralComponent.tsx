import { ReactNode, useContext, useMemo } from 'react';
import { useFunction, useOnce } from 'react-cool-hooks';
import {
  _useStructuralComponentReport,
  AnyChild,
  ArgOfChildren,
  DataOfChild,
  DevStructuralComponent,
  PropsOfChild,
  SafeChildren,
  STRUCTURAL_COMPONENT_FLAG,
  StructuralChildren,
  StructuralComponent,
  StructuralComponentContext,
  StructuralContext,
  StructuralElement,
  StructuralRendererContext,
  useChildrenChange,
  useStructuralComponentContext
} from '../internals';


export function structuralComponent<Props, Data = never>(
  component: (props: Props) => JSX.Element | null,
  selector = 'StructuralComponent',
  knownChildren?: StructuralComponent<any, any>[]
): StructuralComponent<Props, Data> {
  const selectorSymbol = Symbol(selector);
  const supportedChildren = new Set(knownChildren ?? []);
  const StructuralComponent = function ({ children, ...props }: Props & { children: StructuralChildren }): JSX.Element | null {
    const originalProps = props as unknown as Props;
    const [childrenArray, childrenChangeFlag] = useChildrenChange(children);
    const [structuralNodes, usualNodes] = useMemo(() => {
      const structural = new SafeChildren();
      const usual = new SafeChildren<ReactNode>();

      for (const child of childrenArray) {
        if (isSupportedStructural(supportedChildren, child)) {
          structural.push(child);
        } else {
          usual.push(child);
        }
      }

      return [structural, usual];
    }, [childrenChangeFlag]);
    const [context, bufferSignal] = useStructuralComponentContext<DataOfChild, ArgOfChildren<PropsOfChild>>();

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
  } as DevStructuralComponent<Props, Data>;

  StructuralComponent.STRUCTURAL_COMPONENT_FLAG = STRUCTURAL_COMPONENT_FLAG;
  StructuralComponent.SELECTOR = selectorSymbol;
  StructuralComponent.displayName = selector;

  return Object.freeze(StructuralComponent) as StructuralComponent<Props, Data>;
}


function isStructuralChild(child: AnyChild<unknown, unknown> | ((props: any) => ReactNode)): child is StructuralElement {
  return (child as StructuralElement)?.type?.STRUCTURAL_COMPONENT_FLAG === STRUCTURAL_COMPONENT_FLAG;
}

function isSupportedStructural(
  supportedChildren: Set<StructuralComponent>,
  child: AnyChild<unknown, unknown> | ((props: any) => ReactNode)
): boolean {
  return isStructuralChild(child) ? supportedChildren.has(child.type) : false;
}

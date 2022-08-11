/*
import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  buffer,
  combineLatest,
  connectable,
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { StructuralComponent } from '../internals/types/StructuralComponent';
import { StructuralElement } from '../internals/types/StructuralElement';
import { STRUCTURAL_COMPONENT_FLAG } from '../internals/constants';
import { StructuralChildReport, StructuralContext, StructuralContextData } from '../internals/contexts/StructuralContext';
import { createSafeChildren } from './createSafeChildren';
import { SafeChildren } from './SafeChildren';
import { Output$, useSubject, useSubscription } from 'react-rx-tools';
import { useFunction, useOnce } from 'react-cool-hooks';




export function structuralParent<Props, Child extends StructuralElement<any, any> = StructuralElement<any, any>>(
  component: (props: Props) => ReactElement | null,
) {
  return ({ children, ...props }: Props & { children: StructuralChildren<ChildPropsOf<Child>, ChildDataOf<Child>> }) => {
    const reportsSubject = useSubject(() => new Subject<StructuralChildReport<ChildDataOf<Child>, symbol>>());
    const bufferSignal = useSubject(() => new Subject<void>());
    const reports$ = useOnce(() => connectable(
      reportsSubject.pipe(buffer(bufferSignal)),
      { connector: () => new ReplaySubject(1) },
    ));

    const structuralChildrenContext = useOnce<StructuralContextData<ChildDataOf<Child>>>(() => ({
      reportAboutYourself: (report: StructuralChildReport<ChildDataOf<Child>, symbol>) => {
        reportsSubject.next(report);
      },
      selectAllBy: (selector: symbol): Observable<any> => {
        return reports$.pipe(
          map(reports => reports.reduce<Observable<any>[]>((data, report) => {
            if (report.selector === selector) {
              data.push(combineLatest({
                data: report.data,
                children: report.children,
              }));
            }

            return data;
          }, [])),
          switchMap(reportsArray => combineLatest(reportsArray)),
        );
      },
      selectDataBy: (selector: symbol): Observable<ChildDataOf<Child>[]> => {
        return reports$.pipe(
          map(reports => reports.reduce<Observable<ChildDataOf<Child>>[]>((data, report) => {
            if (report.selector === selector) {
              data.push(report.data);
            }

            return data;
          }, [])),
          switchMap(dataObservables => combineLatest(dataObservables)),
        );
      },
      selectChildrenBy: (selector: symbol): Observable<ReactNode> => {
        return reports$.pipe(
          map(reports => reports.reduce<Observable<SafeChildren>[]>((data, report) => {
            if (report.selector === selector) {
              data.push(report.children);
            }

            return data;
          }, [])),
          switchMap(dataObservables => combineLatest(dataObservables)),
          map(children => children.map(safeChild => safeChild())),
        );
      },
    }));

    const [structuralNodes, usualNodes] = useMemo(() => {
      const structural: Child[] = [];
      const usual: ReactNode[] = [];

      Children.forEach<Child>(children as Child[], (child) => {
        if (child.type.STRUCTURAL_COMPONENT_FLAG === STRUCTURAL_COMPONENT_FLAG) {
          structural.push(child);
        } else {
          usual.push(child as unknown as ReactNode);
        }
      });

      return [structural, usual];
    }, Children.toArray(children));

    const StructuralChildrenRenderer = useFunction(() => {
      return <>{structuralNodes}</>;
    });

    const BufferSignalRenderer = useFunction(() => {
      bufferSignal.next();

      return null;
    });

    const StructuralParentRenderer = useFunction((props: PropsWithChildren<Props>) => {
      return component(props);
    });

    useSubscription(() => reports$.connect(), { immediate: true });

    return <StructuralContext.Provider value={structuralChildrenContext}>
      <StructuralChildrenRenderer/>
      <BufferSignalRenderer/>
      <StructuralParentRenderer {...props as unknown as Props}>{usualNodes}</StructuralParentRenderer>
    </StructuralContext.Provider>;
  };
}

export function structuralChild<Props, Data, Children extends ReactNode = ReactNode>(
  selector: symbol,
  toData: (props: Props) => Data,
): StructuralComponent<Props, Data> {
  function StructuralChild({ children, ...props }: Props & { children: Children }): null {
    const childrenDeps = Array.isArray(children) ? [...children] : [children];
    const data = useMemo(() => toData(props as unknown as Props), [props]);
    const safeChildren = useMemo(() => createSafeChildren(children), childrenDeps);
    const dataSubject = useSubject(() => new ReplaySubject<Data>(1));
    const childrenSubject = useSubject(() => new ReplaySubject<SafeChildren>(1));
    const structuralChildrenContext = useContext(StructuralContext);

    useOnce(() => {
      structuralChildrenContext?.reportAboutYourself({
        data: dataSubject.pipe(distinctUntilChanged()),
        children: childrenSubject.pipe(distinctUntilChanged()),
        selector,
      });
    });

    dataSubject.next(data);
    childrenSubject.next(safeChildren);

    return null;
  }

  StructuralChild.STRUCTURAL_COMPONENT_FLAG = STRUCTURAL_COMPONENT_FLAG;
  StructuralChild.SELECTOR = selector;

  return StructuralChild as StructuralComponent<Props, Data>;
}

export function useStructuralChildrenData<P, D>(selector: StructuralComponent<P, D>): Observable<D[]>;
export function useStructuralChildrenData<P, D>(
  selector: StructuralComponent<P, D>,
  callback: (data: D[]) => void,
): void;

export function useStructuralChildrenData<P, D>(
  selector: StructuralComponent<P, D>,
  callback?: (data: D[]) => void,
): Observable<D[]> | void {
  const structuralChildrenContext = useContext<StructuralContextData<D>>(StructuralContext);
  const data$ = useMemo(() => structuralChildrenContext?.selectDataBy(selector.SELECTOR), [selector.SELECTOR]);

  if (callback) {
    useEffect(() => {
      const subscription = data$?.subscribe(callback) ?? Subscription.EMPTY;

      return () => subscription.unsubscribe();
    }, [data$]);
  } else {
    return data$;
  }
}

export function useStructuralChildren<P, D>(
  selector: StructuralComponent<P, D>,
): () => ReactElement | null {
  const structuralChildrenContext = useContext<StructuralContextData<D>>(StructuralContext);
  const children$ = useMemo(() => structuralChildrenContext?.selectChildrenBy(selector.SELECTOR), [selector.SELECTOR]);

  return useCallback(() => {
    return <Output$ $={children$}/>;
  }, []);
}

export function useStructural<P, D>(
  selector: StructuralComponent<P, D>,
): Observable<{ data: D, children: SafeChildren }[]> {
  const structuralChildrenContext = useContext<StructuralContextData<D>>(StructuralContext);

  return useMemo(() => structuralChildrenContext?.selectAllBy(selector.SELECTOR), [selector.SELECTOR]);
}
*/


export {};

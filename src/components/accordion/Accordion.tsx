import { MouseEvent as ReactMouseEvent, useRef } from 'react';
import { useOnce } from 'react-cool-hooks';
import { multicastForUI, Render$, useRxEvent, useValueChange } from 'react-rx-tools';
import {
  animationFrameScheduler,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  scheduled,
  startWith,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs';
import { structuralComponent, useStructuralChildren } from '../../core';
import { StructuralElement } from '../../internals';
import { CleanButton } from '../clean-button';
import { AccordionBody, AccordionBodyProps } from './AccordionBody';
import { AccordionHead, AccordionHeadProps } from './AccordionHead';
import style from './Accordion.scss';


export interface AccordionProps {
  expanded?: boolean;
  disabled?: boolean;
  unmountCollapsed?: boolean;
  direction?: 'vertical' | 'horizontal',
  children: (StructuralElement<AccordionHeadProps> | StructuralElement<AccordionBodyProps>)[];
}

export const Accordion = structuralComponent<AccordionProps, never>(
  (
    {
      expanded = false,
      disabled = false,
      unmountCollapsed= true,
      direction = 'vertical'
    }
  ) => {
    const RenderAccordionHead = useStructuralChildren(AccordionHead);
    const RenderAccordionBody = useStructuralChildren(AccordionBody);
    const containerRef = useRef<HTMLDivElement>(null);
    const expandedProp$ = useValueChange(disabled ? false : expanded);
    const [click$, onClick] = useRxEvent<ReactMouseEvent<HTMLButtonElement>>();
    const state$ = useOnce(() => expandedProp$.pipe(
      switchMap(expandedProp => click$.pipe(
        map(() => expandedProp = !expandedProp),
        startWith(expandedProp)
      )),
      withLatestFrom(isReducedMotion$),
      switchMap(([isExpanded, isReducedMotion], index) => {
        const targetSize = isExpanded ? 'auto' : '0px';

        if (!index || isReducedMotion) {
          return of({ isExpanded, isVisible: isExpanded, size: targetSize });
        }

        const container = containerRef.current!;
        const isVertical = direction === 'vertical';
        const transitionProperty = isVertical ? 'height' : 'width';
        const getCurrentHeight = () => `${isVertical ? container.scrollHeight : container.scrollWidth}px`;

        return merge(
          of({ isExpanded, isVisible: true, get size() { return isExpanded ? '0px' : getCurrentHeight(); } }),
          scheduled([
            { isExpanded, isVisible: true, get size() { return isExpanded ? getCurrentHeight() : targetSize; } }
          ], animationFrameScheduler),
          fromTransitionEnd(container, transitionProperty).pipe(
            map(() => ({ isExpanded, isVisible: isExpanded, size: targetSize }))
          )
        );
      })
    ));

    return <div className={style.accordion}>
      <Render$ $={state$} definedOnly>
        {({ isExpanded, isVisible, size }) => <>
          <CleanButton disabled={disabled} onClick={onClick}>
            <RenderAccordionHead expanded={isExpanded}/>
          </CleanButton>
          <div ref={containerRef} className={style.accordionBody} style={{ blockSize: size }}>
            {(unmountCollapsed ? isVisible : true) && <RenderAccordionBody expanded={isExpanded}/>}
          </div>
        </>}
      </Render$>
    </div>;
  },
  'Accordion',
  [AccordionHead, AccordionBody]
);

const isReducedMotion$ = multicastForUI(new Observable(subscriber => {
  const mql = matchMedia('screen and (prefers-reduced-motion: reduce)');
  const onChange = () => subscriber.next(mql.matches);

  mql.addEventListener('change', onChange);
  subscriber.next(mql.matches);

  return () => {
    mql.removeEventListener('change', onChange);
    subscriber.complete();
  };
}));

isReducedMotion$.subscribe();

function fromTransitionEnd<T extends Element>(
  element: T,
  propertyName: string | string[]
): Observable<T> {
  return fromEvent<TransitionEvent>(element, 'transitionend')
    .pipe(
      filter(event => {
        return event.target === element && event.propertyName === propertyName;
      }),
      take(1),
      map(() => element)
    );
}


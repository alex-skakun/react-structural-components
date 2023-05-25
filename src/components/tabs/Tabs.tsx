import { MouseEvent as ReactMouseEvent, useRef } from 'react';
import { useOnce } from 'react-cool-hooks';
import { Render$, useRxEvent } from 'react-rx-tools';
import { distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs';
import { structuralComponent, useStructuralData } from '../../core';
import { StructuralElement } from '../../internals';
import { CleanButton } from '../clean-button';
import { TabDef, TabDefData, TabDefProps } from './TabDef';


interface TabsProps {
  children: StructuralElement<TabDefProps, TabDefData>[];
}

export const Tabs = structuralComponent<TabsProps, never>(() => {
  const selectedTabId = useRef<string>();
  const tabs$ = useStructuralData(TabDef);
  const [tabChange$, onTabChange] = useRxEvent<ReactMouseEvent<HTMLButtonElement>, string>(event => {
    return event.currentTarget.dataset.tabId!;
  });
  const selectedTab$ = useOnce(() => tabs$.pipe(
    switchMap(availableTabs => tabChange$.pipe(
      distinctUntilChanged(),
      tap(tabId => selectedTabId.current = tabId),
      map(tabId => findTabById(availableTabs, tabId) ?? availableTabs[0]),
      startWith(selectedTabId.current && findTabById(availableTabs, selectedTabId.current) || availableTabs[0])
    ))
  ));

  return <div>
    <Render$ $={tabs$} definedOnly>
      {tabs => <>
        <div>
          {tabs.map(({ id, disabled, Label }) => (
            <CleanButton key={id} disabled={disabled} data-tab-id={id} onClick={onTabChange}>
              <Label disabled={disabled}/>
            </CleanButton>
          ))}
        </div>
        <div>
          <Render$ $={selectedTab$} definedOnly>
            {({ Content }) => <Content/>}
          </Render$>
        </div>
      </>}
    </Render$>
  </div>;
}, 'Tabs', [TabDef]);

function findTabById<T extends { id: string }>(tabs: T[], tabId: string): T | undefined {
  return tabs.find(tab => tab.id === tabId);
}

import { Accordion, AccordionBody, AccordionHead } from './accordion';
import { Grid, ColumnDef, Th, Td } from './grid';
import { TabContent, TabDef, TabLabel, Tabs } from './tabs';

export function App() {
  return (
    <div>
      <Grid data={[
        { firstName: 'Alex', lastName: 'Skakun' },
        { firstName: 'Valera', lastName: 'Mitar' },
      ]}>
        <ColumnDef id="firstName" sortable>
          <Th>First Name</Th>
          <Td>{({ firstName }) => firstName}</Td>
        </ColumnDef>
        <ColumnDef id="lastName" sortable>
          <Th>Last Name</Th>
          <Td>{({ lastName }) => lastName}</Td>
        </ColumnDef>
      </Grid>
      <Accordion unmountCollapsed={false}>
        <AccordionHead>
          {({ expanded }) => expanded ? 'Collapse' : 'Expand' }
        </AccordionHead>
        <AccordionBody>
          <Tabs>
            <TabDef id="first">
              <TabLabel>First</TabLabel>
              <TabContent>
                <div>First Content</div>
                <div>First Content</div>
                <div>First Content</div>
                <div>First Content</div>
                <div>First Content</div>
                <div>First Content</div>
              </TabContent>
            </TabDef>
            <TabDef id="second">
              <TabLabel>Second</TabLabel>
              <TabContent>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
                <div>Second Content</div>
              </TabContent>
            </TabDef>
          </Tabs>
        </AccordionBody>
      </Accordion>
    </div>

  );
}

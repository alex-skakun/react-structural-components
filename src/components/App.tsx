import { Grid } from './Grid';
import { ColumnDef } from './ColumnDef';
import { Td } from './Td';
import { Th } from './Th';

export function App() {
  return (
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
  );
}

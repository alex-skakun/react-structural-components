import { Render$ } from 'react-rx-tools';
import { structuralComponent } from '../core';
import { useStructuralData } from '../core/useStructuralData';
import { ColumnDef, ColumnDefProps } from './ColumnDef';
import { StructuralElement } from '../internals';

type GridProps = {
  data: any[];
};

export const Grid = structuralComponent<GridProps, StructuralElement<ColumnDefProps>, never>(({ data }) => {
  const columns$ = useStructuralData(ColumnDef);

  return <table>
    <thead>
    <tr>
      <Render$ $={columns$} definedOnly>
        {columns => columns.map(({ id, RenderTh }) => <th data-id={id} key={id}>
          <RenderTh/>
        </th>)}
      </Render$>
    </tr>
    </thead>
    <tbody>
    {data.map((row, i) => <tr key={i}>
      <Render$ $={columns$} definedOnly>
        {columns => columns.map(({ id, RenderTd }) => <td key={id}>
          <RenderTd {...row}/>
        </td>)}
      </Render$>
    </tr>)}
    </tbody>
  </table>;
});

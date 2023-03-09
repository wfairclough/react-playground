import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ApiClient, Company } from '~/api';
import { CopyToClipboard } from '~/components/clipboard/copy-to-cb';
import { DefaultErrorBoundary } from '~/components/errors/error-boundary';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

export async function loader({ params }: LoaderArgs) {
  const { limit, skip } = params;
  const companies = await ApiClient.getCompanies({
    limit: Number(limit) || 10,
    skip: Number(skip) || 0,
    sort: 'name',
  });
  return json({ companies });
}

export const ErrorBoundary = DefaultErrorBoundary;

export default function Index() {
  const { companies } = useLoaderData<typeof loader>();
  console.log({ companies });

  const columnHelper = createColumnHelper<Company>();

  const columns = [
    columnHelper.accessor('_id', {
      header: 'ID',
      cell: ({ row: { original: company } }) => (
        <span style={{ fontFamily: 'var(--font-family-fw)' }}>
          <CopyToClipboard value={'ObjectId("' + company._id + '")'} /> ObjectId("{company._id}")
        </span>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row: { original: company } }) => (
        <Link to={`/companies/${company._id}/workflow-types`}>{company.name}</Link>
      ),
    }),
    columnHelper.accessor('locale', {
      header: 'Locale',
      cell: ({ row: { original: company } }) => <span>{company.locale}</span>,
    }),
  ];

  const table = useReactTable({
    columns: columns as any,
    data: companies,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <h1>Companies</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

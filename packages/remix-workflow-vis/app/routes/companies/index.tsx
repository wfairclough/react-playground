import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ApiClient, Company } from '~/api';
import { CopyToClipboard } from '~/components/clipboard/copy-to-cb';
import { DefaultErrorBoundary } from '~/components/errors/error-boundary';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

export async function loader({ request }: LoaderArgs) {
  const limit = new URL(request.url).searchParams.get('limit');
  const skip = new URL(request.url).searchParams.get('skip');
  console.log({ limit, skip });
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
      header: () => <h5 className="header-id">ID</h5>,
      cell: ({ row: { original: company } }) => (
        <span style={{ fontFamily: 'var(--font-family-fw)' }}>
          <CopyToClipboard value={'ObjectId("' + company._id + '")'} /> ObjectId("{company._id}")
        </span>
      ),
    }),
    columnHelper.accessor('name', {
      header: () => <h5 className="header-name">Name</h5>,
      cell: ({ row: { original: company } }) => (
        <Link to={`/companies/${company._id}/workflow-types`}>{company.name}</Link>
      ),
    }),
    columnHelper.accessor('locale', {
      header: () => <h5 className="header-locale">Locale</h5>,
      cell: ({ row: { original: company } }) => <span>{company.locale}</span>,
    }),
  ];

  const table = useReactTable({
    columns: columns as any,
    data: companies,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <style>
        {`
        .page {
          margin: 2rem;
        }
        .page table {
          width: 100%;
        }
        .header-name {
          min-width: 30vw;
        }
        .header-id {
          width: 22rem;
          max-width: 22rem;
        }
        .header-locale {
          width: 5rem;
        }
        .copy-icon {
          width: 1rem;
          height: 1rem;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .copy-icon:hover {
          color: var(--color-primary, blue);
        }
        .copy-icon:hover svg {
          fill: var(--color-primary, blue);
        }
      `}
      </style>
      <div className="page">
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
    </>
  );
}

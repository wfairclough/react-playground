import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { toSeconds } from '~/utils/ms';
import { ApiClient } from '~/api';

export async function loader({ params }: LoaderArgs) {
  const { companyId } = params;
  const doc = await ApiClient.getCompany(companyId!, { projection: { name: 1, logo: 1, address: 1, settings: 1 } });
  if (!doc) {
    throw new Response('Company not found', { status: 404 });
  }
  const { settings, ...company } = doc;
  const workflowTypes = settings?.workflows as {
    key: string;
    name: string;
  }[];
  return json(
    {
      company,
      workflowTypes: workflowTypes?.map(({ key, name }) => ({ key: key.split(':')[1], name })),
    },
    {
      headers: {
        'Cache-Control': `max-age=${toSeconds({ hours: 1 })}}`,
      },
    },
  );
}

export default function CompanyPage() {
  const { workflowTypes, company } = useLoaderData<typeof loader>();
  return (
    <section className="grid-100-header-content">
      <header>
        <h1>{company.name}</h1>
        <h3>Workflow Types</h3>
      </header>
      <div>
        <ul>
          {workflowTypes?.map(({ key, name }, index) => (
            <li key={key}>
              <Link to={key}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

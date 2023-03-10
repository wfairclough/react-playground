import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { toSeconds } from '~/utils/ms';

export async function loader({ params }: LoaderArgs) {
  const { companyId } = params;
  const apiKey = process.env.API_KEY!;
  const query = {
    collection: 'companies',
    database: 'suitespot',
    dataSource: 'SuiteSpotProduction',
    filter: {
      _id: { $oid: companyId },
      // name: 'Demonstration Corp.',
    },
    projection: {
      _id: 1,
      name: 1,
      settings: 1,
    },
  };
  const companyResp = await fetch(
    'https://us-east-1.aws.data.mongodb-api.com/app/data-mbbnv/endpoint/data/v1/action/findOne',
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': apiKey,
      }),
      body: JSON.stringify(query),
    },
  );
  const { document } = await companyResp.json();
  if (!document) {
    throw new Response('Company not found', { status: 404 });
  }
  const { settings, ...company } = document;
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
      <p>
        <ul>
          {workflowTypes?.map(({ key, name }, index) => (
            <li key={key}>
              <Link to={key}>{name}</Link>
            </li>
          ))}
        </ul>
      </p>
    </section>
  );
}

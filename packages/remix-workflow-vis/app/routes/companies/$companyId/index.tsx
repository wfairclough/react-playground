import { type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ApiClient } from '~/api';

export async function loader({ params }: LoaderArgs) {
  const { companyId } = params;
  if (!companyId) {
    throw new Response('Company not found', { status: 404 });
  }
  const company = await ApiClient.getCompany(companyId, { projection: { name: 1, logo: 1, address: 1 } });
  if (!company) {
    throw new Response('Company not found', { status: 404 });
  }
  return { company };
}

export default function CompanyPage() {
  const { company } = useLoaderData<typeof loader>();

  return (
    <section className="grid-100-header-content">
      <h1>
        <img src={company.logo} alt={`Logo for ${company.name}`}></img>
        {company.name}
      </h1>
      <p>
        <ul>
          <li>
            <Link to="overview-pdf">Overview PDF</Link>
          </li>
          <li>
            <Link to="workflow-types">Workflow Types</Link>
          </li>
        </ul>
      </p>
    </section>
  );
}

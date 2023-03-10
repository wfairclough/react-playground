import { json, type LoaderArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { WorkflowCanvas } from '~/components/workflow-canvas/workflow-canvas';
import { toSeconds } from '~/utils/ms';
import { ApiClient } from '~/api';
import { toPng } from 'html-to-image';

import reactflowStyles from 'reactflow/dist/style.css';
import SVGDownloadIcon from '../../../../components/icons/download';
import IconButton from '../../../../components/buttons/icon-button';
import React from 'react';

export async function loader({ params }: LoaderArgs) {
  const { companyId, workflowType } = params;
  const document = await ApiClient.getCompany(companyId!, { projection: { name: 1, settings: 1 } });
  if (!document) {
    throw new Response('Company not found', { status: 404 });
  }
  const { settings, ...company } = document;
  const workflows: any[] = settings?.workflows;
  const workflow = workflows?.find(({ key }) => key.split(':')[1] === workflowType);
  if (!workflow) {
    const fakeBase = 'http://FAKEBASE';
    const notFoundUrl = new URL(`/companies/${companyId}/workflow-types`, fakeBase);
    notFoundUrl.searchParams.set('error', `Workflow type '${workflowType}' not found`);
    console.log(`Redirecting to ${notFoundUrl.toString()} ...`);
    return redirect(notFoundUrl.toString().substring(fakeBase.length, notFoundUrl.toString().length));
  }
  const workflowConfig = settings?.[workflow.key];
  return json(
    {
      workflowConfig,
      workflows,
      company,
    },
    {
      headers: {
        'Cache-Control': `max-age=${toSeconds({ minutes: 1 })}}}`,
      },
    },
  );
}

export default function WorkflowTypePage() {
  const { company, workflowConfig } = useLoaderData<typeof loader>();
  const params = useParams();
  const downloadPng = React.useCallback(async () => {
    const canvas = document.getElementById('wf-canvas') as HTMLDivElement;
    const dataUrl = await toPng(canvas, {
      backgroundColor: 'white',
    });
    console.log('Downloading PNG...', { dataUrl });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `image.png`;
    link.click();
  }, []);
  return (
    <section className="grid-100-header-content">
      <header style={{ padding: '0 1rem 1rem 1rem' }}>
        <h1>
          {company.name} <i style={{ color: 'cornflowerblue' }}>{params.workflowType}</i>
        </h1>
        <Link to={`/companies/${company._id}/workflow-types`}>{'< Workflow Types'}</Link>
        <IconButton icon={<SVGDownloadIcon />} onClick={downloadPng} />
      </header>
      <WorkflowCanvas id="wf-canvas" workflowConfig={workflowConfig} />
    </section>
  );
}

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: reactflowStyles,
    },
  ];
}

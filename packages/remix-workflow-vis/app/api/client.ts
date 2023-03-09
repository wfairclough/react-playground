const BASE_DATA_API_URL = `https://us-east-1.aws.data.mongodb-api.com/app/data-mbbnv/endpoint/data/v1`;

const API_KEY =
  process.env.API_KEY ??
  (() => {
    throw new Error('MUST PROVIDE API_KEY');
  })();

const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': API_KEY,
};

export async function loader({ params }: LoaderArgs) {
  const { companyId, workflowType } = params;
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
  console.log(`Fetching company ${companyId} ...`);
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
  const { settings, ...company } = document;
  const workflows: any[] = settings?.workflows;
  const workflow = workflows?.find(({ key }) => key === workflowType);
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

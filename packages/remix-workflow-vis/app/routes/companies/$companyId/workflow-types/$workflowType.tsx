import { Link, useLoaderData, useParams } from "@remix-run/react";
import { WorkflowCanvas } from "~/components/workflow-canvas";

import reactflowStyles from "reactflow/dist/style.css";
import { type CSSProperties } from "react";
import { json, type LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {
  const { companyId, workflowType } = params;
  const apiKey = process.env.API_KEY!;
  const query = {
    collection: "companies",
    database: "suitespot",
    dataSource: "SuiteSpotProduction",
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
  // fetchCompanies
  const companyResp = await fetch(
    "https://us-east-1.aws.data.mongodb-api.com/app/data-mbbnv/endpoint/data/v1/action/findOne",
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": apiKey,
      }),
      body: JSON.stringify(query),
    }
  );
  const { document } = await companyResp.json();
  const { settings, ...company } = document;
  const workflows = settings?.workflows;
  const workflow = workflows?.find(({ key }) => key === workflowType);
  const workflowConfig = settings?.[workflow.key];
  return json({ workflowConfig, workflows, company });
}

export default function WorkflowTypePage() {
  const { company, workflowConfig } = useLoaderData<typeof loader>();
  const params = useParams();
  const gridCss: CSSProperties = {
    display: "grid",
    width: "100%",
    height: "100%",
  };
  const pageCss: CSSProperties = {
    display: "grid",
    gridTemplateRows: "auto 1fr",
  };
  return (
    <div style={{ ...pageCss }}>
      <header style={{ padding: "0 1rem 1rem 1rem" }}>
        <h1>
          {company.name}{" "}
          <i style={{ color: "cornflowerblue" }}>{params.workflowType}</i>
        </h1>
        <Link to={`/companies/${company._id}/workflow-types`}>
          {"< Workflow Types"}
        </Link>
      </header>
      <div style={{ ...gridCss }}>
        <WorkflowCanvas workflowConfig={workflowConfig} />
      </div>
    </div>
  );
}

export function links() {
  return [
    {
      rel: "stylesheet",
      href: reactflowStyles,
    },
  ];
}

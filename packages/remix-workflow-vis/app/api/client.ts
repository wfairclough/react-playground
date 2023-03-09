import { ApiError } from './errors/api-error';
import type { Company } from './model/company';

export async function getCompany(companyId: string): Promise<Company> {
  const query = {
    ...COMMON_QUERY_PARAMS,
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
  const response = await fetch(buildUrl('/action/findOne'), {
    method: 'POST',
    headers: new Headers({
      ...COMMON_HEADERS,
    }),
    body: JSON.stringify(query),
  });
  if (response.status >= 400) {
    const body = await response.text();
    throw new ApiError(`Failed to fetch company ${companyId}`, { cause: { response, body } });
  }
  const { document } = await response?.json();
  return document;
}

export interface ListParams {
  limit?: number;
  skip?: number;
  filter?: Record<string, any>;
  projection?: Record<string, 1 | 0>;
}

export interface GetCompaniesParams extends ListParams {
  sort?: 'name' | '-name' | '_id' | '-_id';
}

export async function getCompanies(params?: GetCompaniesParams): Promise<Company[]> {
  const query = {
    ...COMMON_QUERY_PARAMS,
    ...(params?.limit && { limit: Number(params.limit) }),
    ...(params?.skip && { skip: Number(params.skip) }),
    ...(params?.filter && { filter: params.filter }),
    ...(params?.sort && { sort: { [params.sort.replace('-', '')]: params.sort.startsWith('-') ? -1 : 1 } }),
    ...(params?.projection ? { projection: params.projection } : { projection: { _id: 1, name: 1, locale: 1 } }),
  };
  console.log(`Fetching companies ...`);
  const response = await fetch(buildUrl('/action/find'), {
    method: 'POST',
    headers: new Headers({
      ...COMMON_HEADERS,
    }),
    body: JSON.stringify(query),
  });
  if (response.status >= 400) {
    const body = await response.text();
    throw new ApiError(`Failed to fetch companies`, { cause: { response, body } });
  }
  // console.log({ body: await response.text() });
  const { documents } = await response?.json();
  return documents;
}

const BASE_DATA_API_URL = `https://us-east-1.aws.data.mongodb-api.com`;

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

const COMMON_QUERY_PARAMS = {
  collection: 'companies',
  database: 'suitespot',
  dataSource: 'SuiteSpotProduction',
};

interface BuildUrlOptions {
  searchParams?: Record<string, string | number | boolean>;
}

const buildUrl = (path: string, options?: BuildUrlOptions) => {
  const url = new URL(`/app/data-mbbnv/endpoint/data/v1${path}`, BASE_DATA_API_URL);
  Object.entries(options?.searchParams ?? {}).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
};

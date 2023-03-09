import { json, LoaderArgs } from '@remix-run/node';

export async function loader({}: LoaderArgs) {
  return json({});
}

export default function Index() {
  return (
    <div>
      <h1>Welcome to Companies</h1>
    </div>
  );
}

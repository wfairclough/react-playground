import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import globalStyles from '~/styles/global.css';
import resetStyles from '~/styles/reset.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Workflow Visualizer',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang="en" className="grid-100">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="grid-100">
        <div id="rootoutlet" className="grid">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// styles is now something like /build/global-AE33KB2.css

export function links() {
  return [
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: globalStyles },
  ];
}

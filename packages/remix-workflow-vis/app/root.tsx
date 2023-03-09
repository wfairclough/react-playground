import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Workflow Visualizer",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const gridCss = {
    display: "grid",
    width: "100%",
    height: "100%",
  };
  return (
    <html lang="en" style={{ ...gridCss }}>
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ ...gridCss, margin: 0 }}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

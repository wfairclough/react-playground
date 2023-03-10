import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <section className="grid-100-header-content">
      <h1>SuiteSpot Support Utils</h1>
      <p>
        <Link to="/companies">Companies</Link>
      </p>
    </section>
  );
}

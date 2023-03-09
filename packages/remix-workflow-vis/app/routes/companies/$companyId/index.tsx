import { useParams } from '@remix-run/react';

export default function CompanyPage() {
  const { companyId } = useParams();
  return (
    <div>
      <h1>Welcome to Company {companyId}</h1>
    </div>
  );
}

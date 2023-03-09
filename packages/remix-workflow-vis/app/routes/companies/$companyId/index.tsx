import { useParams } from "@remix-run/react";

export default function CompanyPage() {
  const { companyId } = useParams();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Company {companyId}</h1>
    </div>
  );
}

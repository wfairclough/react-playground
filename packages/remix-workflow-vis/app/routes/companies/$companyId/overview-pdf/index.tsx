import { Document, Page, PDFViewer, StyleSheet, View, Text, Image } from '@react-pdf/renderer';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { ApiClient } from '~/api';

export async function loader({ params }: LoaderArgs) {
  const { companyId } = params;
  if (!companyId) {
    throw new Response('Company not found', { status: 404 });
  }
  const company = await ApiClient.getCompany(companyId, { projection: { name: 1, logo: 1, address: 1 } });
  if (!company) {
    throw new Response('Company not found', { status: 404 });
  }
  return json({ company });
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  section2: {
    margin: 10,
    padding: 10,
  },
});

export default function CompanyPage() {
  const { company } = useLoaderData<typeof loader>();
  const { settings, ...comp } = company;
  return (
    <div style={{ gridTemplateRows: 'auto 1fr' }} className="grid-100">
      <header>
        <h1>Company {company.name}</h1>
      </header>
      <main className="grid-100">
        <Suspense fallback={<div>Loading...</div>}>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Document>
              <Page>
                <View style={styles.section}>
                  <Text>{company.name}</Text>
                  <Image src={company.logo} />
                </View>
                <View style={styles.section}>
                  <Text>{JSON.stringify(comp, null, 4)}</Text>
                </View>
                <View style={styles.section2}>
                  <Text>{company._id}</Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </Suspense>
      </main>
    </div>
  );
}

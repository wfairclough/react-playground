export type CompanySettings = any;

export interface Company {
  _id: string;
  name: string;
  locale?: string;
  settings: CompanySettings;
}

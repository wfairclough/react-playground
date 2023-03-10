export type CompanySettings = any;

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  locale?: string;
  address?: Address;
  featureFlags?: Record<string, boolean>;
  settings: CompanySettings;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  provinceCode: string;
  countryCode: string;
}

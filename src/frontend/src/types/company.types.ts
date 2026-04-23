export interface CreateCompanyRequest {
  name: string;
}

export interface CompanyResult {
  id: string;
  name: string;
  logoUrl?: string;
  domain?: string;
}

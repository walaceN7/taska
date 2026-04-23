import { api } from "@/lib/api";
import type {
  CompanyResult,
  CreateCompanyRequest,
} from "@/types/company.types";

const urlBase = "core/api/company";

export const companyService = {
  create: async (payload: CreateCompanyRequest): Promise<CompanyResult> => {
    const response = await api.post<CompanyResult>(urlBase, payload);
    return response.data;
  },
};

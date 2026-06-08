import { PaginationMeta } from "../shared/pagination";

export interface Brand {
  id: number;
  code: string;
  name_en?: string;
  name_ar?:string;
  ar_name?:string;
  en_name?:string;
  type: number;
  measurement: number;
  slug: string;
  name: string;
  top: boolean;
  status: number;
  logo: string;
}

export interface BrandsResponse {
  brands: Brand[];
  meta: PaginationMeta;
}
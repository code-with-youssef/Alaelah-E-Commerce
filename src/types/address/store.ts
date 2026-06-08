export interface StoreTranslation {
  id: number;
  store_id: number;
  local_id: number;
  name: string;
  lang: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  insert_flag: number;
  update_flag: number;
  delete_flag: number;
}

export interface Store {
  id: number;
  local_id: number;
  code: string;
  name: string;
  type: string;
  longitude: number;
  latitude: number;
  branch_id: number;
  set_default: number;
  status: number;
  created_at: string;
  updated_at: string;
  store_translations: StoreTranslation[];
}

export interface NearestStoreResponse {
  result: boolean;
  message: string;
  data: Store;
}
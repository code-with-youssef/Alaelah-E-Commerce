export interface UnitTranslation {
  id: number;
  unit_id: number;
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

export interface Unit {
  id: number;
  code: string;
  name: string;
  type: number;
  unit_translations: UnitTranslation[];
}




export interface CategoryLinks {
  products: string;
  sub_categories: string;
}

export interface Category {
  id: number;
  parent_id: number;
  level: number;
  code: string;
  slug: string;
  name: string;
  banner: string;
  icon: string;
  featured: number;
  top: number;
  status: number;
  number_of_children: number;
  number_of_products:number;
  links: CategoryLinks;
}

export interface CategoryTranslation {
  id: number;
  local_id: number;
  category_id: number;
  name: string;
  lang: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  insert_flag: number;
  update_flag: number;
  delete_flag: number;
}

export interface CategoryProduct {
  id: number;
  parent_id: number;
  code: string;
  name: string;
  category_translations: CategoryTranslation[];
}

// مثال على array من الكاتيجوريز
export type Categories = Category[];

export interface Banner {
  photo: string;
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  status: number;
}

export type BannerResponse = ApiResponse<Banner[]>;
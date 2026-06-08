export interface Slider {
  photo: string;
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  status: number;
}

export type SliderResponse = ApiResponse<Slider[]>;
export interface ImageCTGD {
  url: string;
  imageId: string;
}

export interface CategoryCTGD {
  _id: string;
  name: string;
}

export interface CTGD {
  _id: string;
  name: string;
  description: string;
  average_rating?: number;
  rating_count?: number;
  images?: ImageCTGD[];
  categoryctgd?:CategoryCTGD;
  isActive?: boolean;
  isMoi?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasMore: boolean;
}

export interface ApiResponse {
  products: CTGD[];
  total: number;
  page: number;
  pagination: Pagination;
}

export interface ApiParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryctgd?: string;
}

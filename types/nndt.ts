export interface ImageNNDT {
  url: string;
  imageId: string;
}

export interface CategoryNNDT {
  _id: string;
  name: string;
}

export interface NNDT {
  _id: string;
  name: string;
  description: string;
  average_rating?: number;
  rating_count?: number;
  images?: ImageNNDT[];
  categorynndt?:CategoryNNDT;
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
  products: NNDT[];
  total: number;
  page: number;
  pagination: Pagination;
}

export interface ApiParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categorynndt?: string;
}

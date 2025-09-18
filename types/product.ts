export interface Image {
  url: string;
  imageId: string;
}

export interface Product {
    _id: string;
    name: string;
    images: Image[];
    description?: string;
    category?: {
        _id: string;
        name: string;
    };
    average_rating?: number;
    rating_count?: number;
    isActive?: boolean;
    isMoi: boolean;
}

export interface Category {
    _id: string;
    name: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasMore: boolean;
}

export interface ApiResponse {
    products: Product[];
    total: number;
    page: number;
    pagination: Pagination;
}

export interface ApiParams {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
}
export interface BSCT {
  _id: string;
  title: string;
  summary: string;
  categoryBSCT?: {
    _id: string;
    name: string;
  };
  description?: string;
  images: string;
  isActive?: boolean;
  isMoi?: boolean;
  createdAt: string;
}

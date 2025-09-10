export interface ThuVien {
  _id: string;
  title: string;
  videoId : string;
  categoryThuVien?: {
    _id: string;
    name: string;
  };
  isActive?: boolean;
  isMoi?: boolean;
  createdAt: string;
}

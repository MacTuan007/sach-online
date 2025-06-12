export interface KhachHangWithUsername {
    username: string;
    password: string;
}

export interface KhachHang extends KhachHangWithUsername {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    address: string;
}

export interface KhachHangWithId extends KhachHang {
  id: string;
}
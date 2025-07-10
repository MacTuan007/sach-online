export interface Sach {
    id: string;
    chude: string;
    giatien: number;
    khuyenmai?: number; // Giảm giá, có thể không có
    image: string;
    noidung: string;
    nxb: string;
    soluong: number;
    tacgia: string;
    ten: string;
    ttnoidung: string;
    tonkho?: number; // Tồn kho thực tế, có thể không có trong giỏ hàng
}
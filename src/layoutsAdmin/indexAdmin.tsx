import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

type LichSuItem = {
    tenKhachHang: string;
    ngayGiaoDich: string;
    sachDaMua: { ten: string; soluong: number; giatien: number }[];
    tongTien: number;
};
export default function IndexAdmin() {
    const navigate = useNavigate();
    const admin = localStorage.getItem('admin');
    if (admin !== 'true') {
        navigate('/');
        return null; // Trả về null nếu không phải admin
    }

    const [data, setData] = useState<LichSuItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const snapshot = await get(ref(db));
            const dbData = snapshot.val();

            const khachHangMap: Record<string, string> = {};
            Object.entries(dbData.KhachHang || {}).forEach(([val]: any) => {
                const emailKey = val.email.replace(/[^a-zA-Z0-9]/g, "");
                khachHangMap[emailKey] = val.name;
            });

            const lichSu = dbData.LichSuGiaoDich || {};
            const sachData = dbData.Sach || {};

            const result: LichSuItem[] = [];

            Object.entries(lichSu).forEach(([userId, giaoDichList]: any) => {
                const tenKhachHang = khachHangMap[userId] || userId;

                Object.entries(giaoDichList).forEach(([timestamp, books]: any) => {
                    const ngayGiaoDich = new Date(Number(timestamp)).toLocaleDateString("vi-VN");

                    const sachDaMua = Object.entries(books).map(([maSach, soLuong]: any) => {
                        const sach = sachData[maSach];
                        return {
                            ten: sach?.ten || `Sách ${maSach}`,
                            soluong: soLuong,
                            giatien: sach?.giatien || 0,
                        };
                    });

                    const tongTien = sachDaMua.reduce((sum, s) => sum + s.soluong * s.giatien, 0);

                    result.push({ tenKhachHang, ngayGiaoDich, sachDaMua, tongTien });
                });
            });

            setData(result.reverse());
        };

        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="p-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">🧾 Lịch Sử Giao Dịch</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition duration-300"
                        >
                            <div className="mb-3">
                                <p className="text-gray-700 font-medium">
                                    👤 <span className="font-semibold">{item.tenKhachHang}</span>
                                </p>
                                <p className="text-sm text-gray-500">📅 {item.ngayGiaoDich}</p>
                            </div>

                            <div className="mb-3">
                                <p className="font-medium text-gray-700 mb-1">📚 Sách đã mua:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {item.sachDaMua.map((sach, idx) => (
                                        <li key={idx}>
                                            <span className="font-medium">{sach.ten}</span> – SL: {sach.soluong} ×{" "}
                                            {sach.giatien.toLocaleString()}₫
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="text-right font-semibold text-blue-600 mt-2">
                                💰 Tổng tiền: {item.tongTien.toLocaleString()}₫
                            </p>
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Không có dữ liệu giao dịch.</p>
                )}
            </div>
        </AdminLayout>
    );
}

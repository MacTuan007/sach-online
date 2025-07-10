import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

type LichSuItem = {
    tenKhachHang: string;
    ngayGiaoDich: string;
    timestamp: number; // 🛠️ Thêm dòng này
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
    const [filteredData, setFilteredData] = useState<LichSuItem[]>([]);
    const [limit, setLimit] = useState(6);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

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

                Object.entries(giaoDichList).forEach(([timestampStr, books]: any) => {
                    const timestamp = Number(timestampStr);
                    const date = new Date(timestamp);
                    const ngayGiaoDich = date.toLocaleDateString("vi-VN");

                    const sachDaMua = Object.entries(books).map(([maSach, soLuong]: any) => {
                        const sach = sachData[maSach];
                        return {
                            ten: sach?.ten || `Sách ${maSach}`,
                            soluong: soLuong,
                            giatien: sach?.giatien || 0,
                        };
                    });

                    const tongTien = sachDaMua.reduce((sum, s) => sum + s.soluong * s.giatien, 0);

                    result.push({ tenKhachHang, ngayGiaoDich, timestamp, sachDaMua, tongTien });
                });
            });

            const sorted = result.sort((a, b) => b.timestamp - a.timestamp);
            setData(sorted);
            setFilteredData(sorted); // default
        };

        fetchData();
    }, []);

    // Lọc dữ liệu khi chọn tháng/năm
    useEffect(() => {
        let newData = [...data];

        if (selectedMonth) {
            newData = newData.filter((item) => {
                const date = new Date(item.timestamp);
                return date.getMonth() + 1 === parseInt(selectedMonth);
            });
        }

        if (selectedYear) {
            newData = newData.filter((item) => {
                const date = new Date(item.timestamp);
                return date.getFullYear() === parseInt(selectedYear);
            });
        }

        setFilteredData(newData);
        setLimit(6); // reset limit khi lọc mới
    }, [selectedMonth, selectedYear, data]);

    const handleXemThem = () => {
        setLimit((prev) => prev + 6);
    };

    const giaoDichHienThi = filteredData.slice(0, limit);

    return (
        <AdminLayout>
            <div className="p-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">🧾 Lịch Sử Giao Dịch</h2>

                {/* Bộ lọc tháng/năm */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">-- Chọn tháng --</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">-- Chọn năm --</option>
                        {[2023, 2024, 2025].map((year) => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Giao dịch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {giaoDichHienThi.map((item, index) => (
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

                {/* Nút xem thêm */}
                {limit < filteredData.length && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleXemThem}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}

                {/* Không có dữ liệu */}
                {filteredData.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Không có dữ liệu giao dịch.</p>
                )}
            </div>
        </AdminLayout>
    );
}

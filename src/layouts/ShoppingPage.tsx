import { get, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import type { Sach } from "../interfaces/Sach";
import Header from "../partials/Header";

export default function ShoppingPage() {
    const navigate = useNavigate();
    const [sachList, setSachList] = useState<Sach[]>([]);
    const emailKey = localStorage.getItem('emailKey');
    useEffect(() => {

        if (!emailKey) {
            navigate('/DangNhap');
            return;
        }
        const cartRef = ref(db, `GioHang/${emailKey}`);
        get(cartRef).then(async (snapshot) => {
            const gioHangData = snapshot.val();
            if (!gioHangData) {
                setSachList([]);
                return;
            }

            const ids = Object.keys(gioHangData);
            const sachPromises = ids.map(async (id) => {
                const sachSnap = await get(ref(db, `Sach/${id}`));
                const sach = sachSnap.val();
                if (sach) {
                    return {
                        id,
                        ...sach,
                        soluong: gioHangData[id]
                    } as Sach;
                }
                return null;
            });

            const sachList = (await Promise.all(sachPromises)).filter(Boolean) as Sach[];
            setSachList(sachList.map(s => ({
                ...s,
                tonkho: s.soluong, // giữ lại tồn kho thực tế
                soluong: gioHangData[s.id] // số lượng trong giỏ hàng
            })));
        });
    }, [emailKey]);

    const handleQuantityChange = async (id: string, delta: number) => {
        setSachList((prev) =>
            prev.map((sach) => {
                if (sach.id === id) {
                    const newVal = sach.soluong + delta;
                    if (newVal < 1) return { ...sach, soluong: 1 };
                    if (sach.tonkho !== undefined && newVal > sach.tonkho) {
                        alert(`Sách "${sach.ten}" chỉ còn ${sach.tonkho} quyển trong kho.`);
                        return sach;
                    }
                    return { ...sach, soluong: newVal };
                }
                return sach;
            })
        );

        try {
            const sach = sachList.find((s) => s.id === id);
            if (!sach) return;

            const newVal = sach.soluong + delta;
            await update(ref(db, `GioHang/${emailKey}`), { [id]: newVal });
        } catch (error) {
            console.error("🔥 Không thể cập nhật giỏ hàng:", error);
        }
    };


    const handleRemove = (id: string) => {
        remove(ref(db, `GioHang/${emailKey}/${id}`));
        setSachList((prev) => prev.filter((s) => s.id !== id));
    };

    const handleConfirm = async () => {
        for (const item of sachList) {
            if (item.tonkho !== undefined && item.soluong > item.tonkho) {
                alert(`Sách "${item.ten}" chỉ còn ${item.tonkho} quyển. Vui lòng giảm số lượng.`);
                return;
            }
        }

        const totalAmount = sachList.reduce((total, item) => total + item.giatien * item.soluong, 0);
        try {
            const response = await fetch('https://sach-online.onrender.com/create_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    sachList,
                }),
            });

            const data = await response.json();

            if (data.paymentUrl) {
                console.log("👉 Redirecting to:", data.paymentUrl)
                window.location.href = data.paymentUrl;
            } else {
                alert('Tạo thanh toán thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi tạo thanh toán:', error);
            alert('Có lỗi xảy ra khi thanh toán');
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h3 className="text-center mb-3">🛒 Giỏ hàng</h3>

                {sachList.length === 0 ? (
                    <div className="alert alert-info text-center">Giỏ hàng trống</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle text-nowrap">
                                <thead className="table-light text-center">
                                    <tr>
                                        <th>Tên sách</th>
                                        <th className="d-none d-md-table-cell">Hình ảnh</th>
                                        <th>Số lượng</th>
                                        <th>Giá tiền</th>
                                        <th>Giá khuyến mãi</th>
                                        <th>Thành tiền</th>
                                        <th className="d-none d-md-table-cell">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sachList.map((sach) => (
                                        <tr key={sach.id}>
                                            <td>{sach.ten}</td>
                                            <td className="text-center d-none d-md-table-cell">
                                                <Link to={`/sanpham/${sach.id}`}>
                                                    <img
                                                        src={sach.image}
                                                        alt={sach.ten}
                                                        style={{ width: "80px", height: "auto", objectFit: "cover" }}
                                                    />
                                                </Link>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(sach.id, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span>{sach.soluong}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(sach.id, 1)}
                                                        disabled={sach.tonkho !== undefined && sach.soluong >= sach.tonkho}
                                                    >
                                                        +
                                                    </button>

                                                </div>
                                            </td>
                                            <td className="text-end">{sach.giatien.toLocaleString()} ₫</td>
                                            <td className="text-end">
                                                {sach.khuyenmai
                                                    ? <span className="text-danger fw-bold">{sach.khuyenmai.toLocaleString()} ₫</span>
                                                    : <span className="text-muted">—</span>}
                                            </td>
                                            <td className="text-end">
                                                {((sach.khuyenmai ?? sach.giatien) * sach.soluong).toLocaleString()} ₫
                                            </td>
                                            <td className="text-center d-none d-md-table-cell">
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemove(sach.id)}
                                                >
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td colSpan={3} className="text-end fw-bold">Tổng cộng:</td>
                                        <td className="text-end fw-bold" colSpan={2}>
                                            {sachList.reduce((total, item) => {
                                                const price = item.khuyenmai ?? item.giatien;
                                                return total + price * item.soluong;
                                            }, 0).toLocaleString()} ₫
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-end mt-3">
                            <button className="btn btn-success px-4" onClick={handleConfirm}>
                                Xác nhận thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};


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
                    const tonkho = sach.soluong;
                    let slTrongGio = gioHangData[id];

                    // Nếu số lượng trong giỏ lớn hơn tồn kho thì cập nhật lại Firebase và gán về tồn kho
                    if (slTrongGio > tonkho) {
                        slTrongGio = tonkho;
                        await update(ref(db, `GioHang/${emailKey}`), {
                            [id]: tonkho,
                        });
                    }

                    return {
                        id,
                        ...sach,
                        tonkho,            // lưu tồn kho thật
                        soluong: slTrongGio // số lượng hợp lệ
                    } as Sach;
                }
                return null;
            });

            const sachList = (await Promise.all(sachPromises)).filter(Boolean) as Sach[];
            setSachList(sachList);
        });
    }, [emailKey]);


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
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    style={{ width: "80px" }}
                                                    value={sach.soluong}
                                                    min={1}
                                                    max={sach.tonkho}
                                                    onChange={(e) => {
                                                        const newVal = parseInt(e.target.value);
                                                        if (isNaN(newVal)) return;

                                                        if (newVal < 1) {
                                                            alert("Số lượng tối thiểu là 1.");
                                                            return;
                                                        }
                                                        if (sach.tonkho !== undefined && newVal > sach.tonkho) {
                                                            alert(`Sách "${sach.ten}" chỉ còn ${sach.tonkho} quyển trong kho.`);
                                                            return;
                                                        }

                                                        // Cập nhật giỏ hàng
                                                        const newSachList = sachList.map((s) =>
                                                            s.id === sach.id ? { ...s, soluong: newVal } : s
                                                        );
                                                        setSachList(newSachList);

                                                        update(ref(db, `GioHang/${emailKey}`), {
                                                            [sach.id]: newVal,
                                                        }).catch((error) => {
                                                            console.error("🔥 Không thể cập nhật giỏ hàng:", error);
                                                        });
                                                    }}
                                                />
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


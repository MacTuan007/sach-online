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
            setSachList(sachList);
        });
    }, [emailKey]);

    const handleQuantityChange = (id: string, delta: number) => {
        setSachList((prev) =>
            prev.map((sach) =>
                sach.id === id
                    ? { ...sach, soluong: Math.max(1, sach.soluong + delta) }
                    : sach
            )
        );
        const itemRef = ref(db, `GioHang/${emailKey}/${id}`);
        get(itemRef).then((snap) => {
            const old = snap.val();
            const newVal = Math.max(1, old + delta);
            update(ref(db, `GioHang/${emailKey}`), { [id]: newVal });
        });
    };
    const handleRemove = (id: string) => {
        remove(ref(db, `GioHang/${emailKey}/${id}`));
        setSachList((prev) => prev.filter((s) => s.id !== id));
    };

    // const handleConfirm = async () => {
    //     const email = localStorage.getItem('email');
    //     try {
    //         const response = await fetch('https://sach-online.onrender.com/api/send-email', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 email,
    //                 order: sachList.map(item => ({
    //                     ten: item.ten,
    //                     soluong: item.soluong,
    //                     giatien: item.giatien,
    //                     thanhtien: item.soluong * item.giatien
    //                 })),
    //             }),
    //         });

    //         const data = await response.json();
    //         alert(data.message);
    //         const today = Date.now().toString();
    //         const updates: Record<string, number> = {};
    //         sachList.forEach(item => {
    //             updates[`LichSuGiaoDich/${emailKey}/${today}/${item.id}`] = item.soluong;
    //         });
    //         await update(ref(db), updates);
    //         await remove(ref(db, `GioHang/${emailKey}`));
    //         navgate('/');
    //     } catch (error) {
    //         console.error('Lỗi gửi email:', error);
    //         alert('Không gửi được email');
    //     }
    // };
    const handleConfirm = async () => {
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
                window.location.href =data.paymentUrl;
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
                <h3 className="text-center mb-3">Giỏ hàng</h3>

                {sachList.length === 0 ? (
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Tên sách</th>
                                <th className="text-center">Hình ảnh</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-end">Giá tiền</th>
                                <th className="text-end">Thành tiền</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                ) : (
                    <>
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Tên sách</th>
                                    <th className="text-center">Hình ảnh</th>
                                    <th className="text-center">Số lượng</th>
                                    <th className="text-end">Giá tiền</th>
                                    <th className="text-end">Thành tiền</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sachList.map((sach) => (
                                    <tr key={sach.id}>
                                        <td>{sach.ten}</td>
                                        <th className="text-center"><Link to={`/sanpham/${sach.id}`}><img src={sach.image}></img></Link></th>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-secondary me-1"
                                                onClick={() => handleQuantityChange(sach.id, -1)}
                                            >
                                                -
                                            </button>
                                            {sach.soluong}
                                            <button
                                                className="btn btn-sm btn-secondary ms-1"
                                                onClick={() => handleQuantityChange(sach.id, 1)}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="text-end">{sach.giatien.toLocaleString()} ₫</td>
                                        <td className="text-end">{(sach.giatien * sach.soluong).toLocaleString()} ₫</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemove(sach.id)}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* Hàng tổng cộng */}
                                <tr>
                                    <td colSpan={3} className="text-end fw-bold">Tổng cộng:</td>
                                    <td className="text-end fw-bold">
                                        {sachList.reduce((total, item) => total + item.giatien * item.soluong, 0).toLocaleString()} ₫
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-end">
                            <button className="btn btn-success" onClick={handleConfirm}>
                                Xác nhận
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};


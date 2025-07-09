import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Sach } from "../interfaces/Sach";
import { get, ref, remove, update } from "firebase/database";
import { db } from "../firebase";

export default function ResultPage() {
    const navigate = useNavigate();
    const [sachList, setSachList] = useState<Sach[]>([]);
    const emailKey = localStorage.getItem('emailKey');
    const sendEmail = async () => {
        const email = localStorage.getItem('email');
        try {
            const response = await fetch('https://sach-online.onrender.com/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    order: sachList.map(item => ({
                        ten: item.ten,
                        soluong: item.soluong,
                        giatien: item.giatien,
                        thanhtien: item.soluong * item.giatien
                    })),
                }),
            });

            const data = await response.json();
            alert(data.message);
            const today = Date.now().toString();
            const updates: Record<string, number> = {};
            sachList.forEach(item => {
                updates[`LichSuGiaoDich/${emailKey}/${today}/${item.id}`] = item.soluong;
            });
            await update(ref(db), updates);
            await remove(ref(db, `GioHang/${emailKey}`));
            navigate('/');
        } catch (error) {
            console.error('Lỗi gửi email:', error);
            alert('Không gửi được email');
        }
    };
    useEffect(() => {
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
    }, [sachList, emailKey]);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("vnp_ResponseCode");

        if (status === "00") {
            sendEmail();
        } else {
            alert("Thanh toán thất bại");
            navigate("/");
        }
    }, [navigate]);

    return <p>Đang xử lý...</p>;
}
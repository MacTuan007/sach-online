import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { KhachHangWithUsername } from "../interfaces/KhachHang";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "../firebase";
import bcrypt from "bcryptjs";

export default function DangNhap() {

    const navigate = useNavigate();
    const [khachhang, setkhachhang] = useState<KhachHangWithUsername>({
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setkhachhang({ ...khachhang, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Kiểm tra rỗng
        for (const key in khachhang) {
            if ((khachhang as any)[key].trim() === '') {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }
        }

        const q = query(ref(db, 'KhachHang'), orderByChild('username'), equalTo(khachhang.username));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const KhachHang = Object.values(data)[0] as any;
            const isMatch = await bcrypt.compare(khachhang.password, KhachHang.password);
            if (isMatch) {
                alert("Đăng nhập thành công!");
                navigate('/');
            } else {
                alert("Mật khẩu không đúng!");
            }
        }
        else {
            alert("Tên đăng nhập không tồn tại!");
        }

    }

    return (
        <>
            <div className="container">
                <h2>ĐĂNG KÝ THÀNH VIÊN</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input type="text" className="form-control" id="username" value={khachhang.username} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input type="password" className="form-control" id="password" value={khachhang.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Đăng Nhập</button>
                </form>
            </div>
        </>
    );
}
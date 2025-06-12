import type { KhachHang } from "../interfaces/KhachHang";
import React, { useState } from 'react';
import { ref, push, orderByChild, equalTo, query, get } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from "bcryptjs";


export default function DangKy() {
    const navigate = useNavigate();
    const [khachhang, setkhachhang] = useState<KhachHang>({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        birthday: '',
        address: '',
    });

    const [password2, setPassword2] = useState<string>('');

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

        if (khachhang.password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (khachhang.password !== password2) {
            alert('Mật khẩu nhập lại không khớp!');
            return;
        }

        if (khachhang.phone.length < 10 || khachhang.phone.length > 11) {
            alert('Số điện thoại phải có 10 hoặc 11 chữ số!');
            return;
        }

        const checkUsernameExists = async (username: string): Promise<boolean> => {
            const q = query(ref(db, 'KhachHang'), orderByChild('username'), equalTo(username));
            const snapshot = await get(q);
            return snapshot.exists();
        };

        const exists = await checkUsernameExists(khachhang.username);
        if (exists) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(khachhang.password, salt);
        khachhang.password = hashedPassword;

        try {
            const KhachHangRef = ref(db, `KhachHang`);
            await push(KhachHangRef, {
                ...khachhang,
            });
            alert('Đăng ký thành công!');
            handleReset();
            navigate("/DangNhap");
        } catch (err) {
            alert('Đăng ký thất bại!');
            console.error(err);
        }
    };

    const handleReset = () => {
        setkhachhang({
            name: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            birthday: '',
            address: '',
        });
        setPassword2('');
    };


    return (
        <>
            <div className="container">
                <h2>ĐĂNG KÝ THÀNH VIÊN</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Họ và tên</label>
                        <input type="text" className="form-control" id="name" value={khachhang.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input type="text" className="form-control" id="username" value={khachhang.username} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input type="password" className="form-control" id="password" value={khachhang.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password2" className="form-label">Nhập lại Mật khẩu</label>
                        <input type="password" className="form-control" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="Email" className="form-control" id="email" value={khachhang.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Điện thoại</label>
                        <input type="phone" className="form-control" id="phone" value={khachhang.phone} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="birthday" className="form-label">Ngày sinh</label>
                        <input type="date" className="form-control" id="birthday" value={khachhang.birthday} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                        <input type="text" className="form-control" id="address" value={khachhang.address} onChange={handleChange} />
                    </div>
                    <ul className="list-group flex-row d-flex gap-2">
                        <button type="submit" className="btn btn-primary">Đăng ký</button>
                        <button type="button" className="btn btn-primary" onClick={handleReset}>Xoá thông tin</button>
                    </ul>
                </form>
            </div>
        </>
    );
}
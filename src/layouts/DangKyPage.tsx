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
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setkhachhang({ ...khachhang, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        for (const key in khachhang) {
            if ((khachhang as any)[key].trim() === '') {
                setError("Vui lòng điền đầy đủ thông tin!");
                return;
            }
        }
        if (khachhang.username.length < 6) {
            setError('Tài khoản phải có ít nhất 6 ký tự!');
            return;
        }
        if (khachhang.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (khachhang.password !== password2) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        if (khachhang.phone.length < 10 || khachhang.phone.length > 11) {
            setError('Số điện thoại phải có 10 hoặc 11 chữ số!');
            return;
        }

        const checkUsernameExists = async (username: string): Promise<boolean> => {
            const q = query(ref(db, 'KhachHang'), orderByChild('username'), equalTo(username));
            const snapshot = await get(q);
            return snapshot.exists();
        };

        const exists = await checkUsernameExists(khachhang.username);
        if (exists) {
            setError("Tên đăng nhập đã tồn tại!");
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(khachhang.password, salt);
        khachhang.password = hashedPassword;

        try {
            await push(ref(db, `KhachHang`), khachhang);
            alert('Đăng ký thành công!');
            handleReset();
            navigate("/DangNhap");
        } catch (err) {
            setError("Đăng ký thất bại! Vui lòng thử lại.");
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
        setError('');
    };

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-center mb-4">Đăng ký thành viên</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {[
                            { id: "name", label: "Họ và tên", type: "text", icon: "bi-person" },
                            { id: "username", label: "Tên đăng nhập", type: "text", icon: "bi-person-badge" },
                            { id: "email", label: "Email", type: "email", icon: "bi-envelope" },
                            { id: "phone", label: "Điện thoại", type: "tel", icon: "bi-telephone" },
                            { id: "birthday", label: "Ngày sinh", type: "date", icon: "bi-calendar" },
                            { id: "address", label: "Địa chỉ", type: "text", icon: "bi-geo-alt" }
                        ].map(({ id, label, type, icon }) => (
                            <div className="mb-3" key={id}>
                                <label htmlFor={id} className="form-label">{label}</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className={`bi ${icon}`}></i></span>
                                    <input
                                        type={type}
                                        id={id}
                                        className="form-control"
                                        value={(khachhang as any)[id]}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-control"
                                    value={khachhang.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div className="mb-4">
                            <label htmlFor="password2" className="form-label">Nhập lại mật khẩu</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    id="password2"
                                    className="form-control"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${showPassword2 ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">Đăng ký</button>
                            <button type="button" className="btn btn-secondary" onClick={handleReset}>Xoá thông tin</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

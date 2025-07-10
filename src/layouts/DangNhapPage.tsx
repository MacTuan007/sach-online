import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { KhachHangWithUsername } from "../interfaces/KhachHang";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "../firebase";
import bcrypt from "bcryptjs";
import Header from "../partials/Header";

export default function DangNhap() {
    const navigate = useNavigate();
    const [khachhang, setkhachhang] = useState<KhachHangWithUsername>({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        const a = query(ref(db, 'Admin'), orderByChild('username'), equalTo(khachhang.username));
        const adminSnapshot = await get(a);
        if (adminSnapshot.exists()) {
            const adminData = adminSnapshot.val();
            const Admin = Object.values(adminData)[0] as any;
            const isMatch = await bcrypt.compare(khachhang.password, Admin.password);
            if (isMatch) {
                localStorage.setItem('admin', 'true');
                navigate('/Admin');
                return;
            }
            else {
                setError("Tài khoản hoặc mật khẩu không đúng!");
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
                const emailKey = KhachHang.email.replace(/[^a-zA-Z0-9]/g, '');
                localStorage.setItem('email', KhachHang.email);
                localStorage.setItem('emailKey', emailKey);
                navigate('/');
            } else {
                setError("Mật khẩu không đúng!");
            }
        } else {
            setError("Tên đăng nhập không tồn tại!");
        }
    };


    return (
        <>
            <Header />
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="row w-100 justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                        <div className="bg-white p-4 shadow rounded">
                            <h2 className="text-center mb-4">Đăng nhập</h2>

                            {error && (
                                <div className="alert alert-danger py-2" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-person-fill"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={khachhang.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            placeholder="Nhập tên đăng nhập"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-lock-fill"></i>
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            value={khachhang.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            placeholder="Nhập mật khẩu"
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
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Đăng Nhập</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

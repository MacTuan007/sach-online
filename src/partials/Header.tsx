import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
export default function Header() {
    const [cartItemCount, setCartItemCount] = useState(0);
    const [email, setEmail] = useState<string | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        const storedEmail = localStorage.getItem('email')
        setEmail(storedEmail)
        const emailKey = localStorage.getItem('emailKey');
        if (emailKey) {
            const cartRef = ref(db, `GioHang/${emailKey}`);
            onValue(cartRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const count = Object.keys(data).length;
                    setCartItemCount(count);
                } else {
                    setCartItemCount(0);
                }
            });
        }
    }, [])
    const handleLogout = () => {
        localStorage.removeItem('email')
        setEmail(null)
        localStorage.removeItem('emailKey')
        navigate('/')
    }
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand">Nhà Sách</Link>

                        {/* ICON GIỎ HÀNG LUÔN HIỂN THỊ */}
                        {email && (
                            <Link to="/Shopping" className="me-2 position-relative d-sm-none">
                                <img src='/images/shopping.png' alt='Giỏ hàng' style={{ width: '30px', height: '30px' }} />
                                {cartItemCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Nút toggle menu trên mobile */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* NAVBAR CHÍNH */}
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">Giới thiệu</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">Liên hệ</Link>
                                </li>
                            </ul>

                            {/* PHẦN PHẢI - LOGIN / LOGOUT */}
                            <ul className="navbar-nav ms-auto">
                                {email ? (
                                    <>
                                        {/* Giỏ hàng cho desktop */}
                                        <li className="nav-item d-none d-sm-block">
                                            <Link to="/Shopping" className="nav-link position-relative">
                                                <img src='/images/shopping.png' alt='Giỏ hàng' style={{ width: '30px', height: '30px' }} />
                                                {cartItemCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <span className="nav-link">Xin chào: {email}</span>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-link nav-link" onClick={handleLogout}>
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link to="/DangKy" className="nav-link">Đăng ký</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/DangNhap" className="nav-link">Đăng Nhập</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

        </>
    );
}
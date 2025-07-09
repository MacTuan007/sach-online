import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';

export default function Header() {
    const [cartItemCount, setCartItemCount] = useState(0);
    const [email, setEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    // Lấy email từ localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        setEmail(storedEmail || null);
    }, []);

    // Theo dõi giỏ hàng nếu đã đăng nhập
    useEffect(() => {
        const emailKey = localStorage.getItem('emailKey');
        if (!emailKey) return;

        const cartRef = ref(db, `GioHang/${emailKey}`);
        const unsubscribe = onValue(cartRef, (snapshot) => {
            const data = snapshot.val();
            setCartItemCount(data ? Object.keys(data).length : 0);
        });

        return () => unsubscribe();
    }, [email]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('emailKey');
        setEmail(null);
        navigate('/');
    };

    const renderCartIcon = () => (
        <div className="position-relative">
            <img
                src="/images/shopping.png"
                alt="Giỏ hàng"
                style={{ width: '30px', height: '30px' }}
            />
            {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                </span>
            )}
        </div>
    );

    const getShortEmail = (email: string) => email.split('@')[0];

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom shadow-sm mb-3">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand fw-bold">📚 Nhà Sách</Link>

                    {/* Giỏ hàng - MOBILE */}
                    {email && (
                        <Link to="/Shopping" className="me-2 d-sm-none">
                            {renderCartIcon()}
                        </Link>
                    )}

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

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="#" className="nav-link">Giới thiệu</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link">Liên hệ</Link>
                            </li>
                        </ul>

                        {/* PHẢI: Login / Logout */}
                        <ul className="navbar-nav ms-auto align-items-center">
                            {email ? (
                                <>
                                    {/* Giỏ hàng - DESKTOP */}
                                    <li className="nav-item d-none d-sm-block">
                                        <Link to="/Shopping" className="nav-link">
                                            {renderCartIcon()}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <span className="nav-link">
                                            👋 Xin chào, <strong>{getShortEmail(email)}</strong>
                                        </span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleLogout}>
                                            🚪 Đăng xuất
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/DangKy" className="nav-link">📝 Đăng ký</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/DangNhap" className="nav-link">🔐 Đăng nhập</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

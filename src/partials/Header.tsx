import { Link } from 'react-router-dom';
export default function Header() {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-dark" >Home</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-dark" href="#">Giới thiệu</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-dark" href="#">Liên hệ </a>
                                </li>
                                <li className="nav-item">
                                    <Link to="/DangKy" className="nav-link text-dark" >Đăng ký</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/DangNhap" className="nav-link text-dark" >Đăng Nhập</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
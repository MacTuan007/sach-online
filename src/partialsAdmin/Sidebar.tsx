import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('emailKey');
        localStorage.removeItem('admin');
        navigate('/');
    };
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-primary" style={{ width: "250px", minHeight: "100vh", background: "#f8f9fa" }}>
            <h5 className="text-white">Quản trị</h5>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/Admin" className="nav-link text-white">
                        Admin
                    </Link>
                </li>
                <li>
                    <Link to="/Admin/ChuDe" className="nav-link text-white">
                        Chủ đề
                    </Link>
                </li>
                <li>
                    <Link to="/Admin/NXB" className="nav-link text-white">
                        Nhà xuất bản
                    </Link>
                </li>
                <li>
                    <Link to="/Admin/Sach" className="nav-link text-white">
                        Sách
                    </Link>
                </li>
                <li className="nav-item">
                    <button className="btn btn-link nav-link text-white" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </li>
            </ul>
        </div>
    );
}

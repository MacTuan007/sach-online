import { Link } from "react-router-dom";

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
                                    <Link to="/Admin" className="nav-link text-dark" >Admin</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Admin/ChuDe" className="nav-link text-dark" >Chủ đề</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Admin/NXB" className="nav-link text-dark" >Nhà xuất bản</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Admin/Sach" className="nav-link text-dark" >Sách</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto">
                                
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}
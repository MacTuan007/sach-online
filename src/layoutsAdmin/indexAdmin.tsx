import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function IndexAdmin() {
    const navigate = useNavigate();
    const admin = localStorage.getItem('admin');
    if (admin !== 'true') {
        navigate('/');
        return null; // Trả về null nếu không phải admin
    }

    return (
        <AdminLayout>
            <div className="flex-grow-1 p-3" style={{ marginLeft: "250px" }}>
                {/* Nội dung chính của admin ở đây */}
                <h1>Trang quản trị</h1>
            </div>
        </AdminLayout>
    );
}

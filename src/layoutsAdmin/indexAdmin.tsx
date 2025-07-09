import AdminLayout from "./AdminLayout";

export default function IndexAdmin() {
    return (
        <AdminLayout>
            <div className="flex-grow-1 p-3" style={{ marginLeft: "250px" }}>
                {/* Nội dung chính của admin ở đây */}
                <h1>Trang quản trị</h1>
            </div>
        </AdminLayout>
    );
}

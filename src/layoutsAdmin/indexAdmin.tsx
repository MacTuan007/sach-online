import Sidebar from "../partialsAdmin/Sidebar";

export default function IndexAdmin() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3" style={{ marginLeft: "250px" }}>
                {/* Nội dung chính của admin ở đây */}
                <h1>Trang quản trị</h1>
            </div>
        </div>
    );
}

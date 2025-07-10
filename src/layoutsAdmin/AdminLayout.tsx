import Sidebar from "../partialsAdmin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar chiếm cố định chiều rộng, full height */}
            <div style={{ width: "220px", background: "#f8f9fa" }}>
                <Sidebar />
            </div>

            {/* Nội dung chính có scroll riêng */}
            <div
                className="flex-grow-1 px-4 pt-3"
                style={{ overflowY: "auto" }}
            >
                {children}
            </div>
        </div>
    );
}

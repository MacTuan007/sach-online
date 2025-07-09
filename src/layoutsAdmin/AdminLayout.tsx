import Sidebar from "../partialsAdmin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar có độ rộng cố định */}
            <div style={{ width: "220px", marginRight: "20px" }} className="bg-light">
                <Sidebar />
            </div>

            {/* Nội dung chính, không bị margin thừa */}
            <div className="flex-grow-1 px-4 pt-3">
                {children}
            </div>
        </div>
    );
}

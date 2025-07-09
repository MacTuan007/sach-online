import Sidebar from "../partialsAdmin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3" style={{ marginLeft: "250px" }}>
                {children}
            </div>
        </div>
    );
}

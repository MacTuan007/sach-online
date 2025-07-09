import { useEffect, useState } from "react";
import type { Chude } from "../interfaces/ChuDe";
import { db } from "../firebase";
import {
    equalTo,
    get,
    orderByChild,
    push,
    query,
    ref,
    remove,
    update
} from "firebase/database";
import Header from "../partialsAdmin/Sidebar";
import EditItemModal from "../modals/EditItem";
import AddItemModal from "../modals/AddItem";

export default function QuanLyChuDe() {
    const [chudeList, setChudeList] = useState<Chude[]>([]);
    const [selectedChude, setSelectedChude] = useState<Chude | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchChuDeList = async () => {
        setLoading(true);
        try {
            const snapshot = await get(ref(db, "ChuDe"));
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...(value as Omit<Chude, "id">),
                }));
                setChudeList(list);
            } else {
                setChudeList([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải chủ đề:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChuDeList();
    }, []);

    const handleEdit = (chude: Chude) => {
        setSelectedChude(chude);
        setShowModal(true);
    };

    const handleSave = async (updatedChude: Chude) => {
        try {
            await update(ref(db, `ChuDe/${updatedChude.id}`), {
                ten: updatedChude.ten,
                tenlink: updatedChude.tenlink,
            });
            alert("Cập nhật thành công!");
            fetchChuDeList();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại.");
        }
    };

    const handleAdd = async (newChude: Omit<Chude, "id">) => {
        try {
            await push(ref(db, "ChuDe"), newChude);
            alert("Thêm mới thành công!");
            fetchChuDeList();
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            alert("Thêm thất bại.");
        }
    };

    const handleDelete = async (id: string, chudeTenLink: string) => {
        const confirmed = window.confirm("Bạn có chắc muốn xoá chủ đề này?");
        if (!confirmed) return;

        try {
            const sachQuery = query(ref(db, "Sach"), orderByChild("chude"), equalTo(chudeTenLink));
            const snapshot = await get(sachQuery);
            if (snapshot.exists()) {
                alert("Không thể xoá: Còn sách thuộc chủ đề này.");
                return;
            }

            await remove(ref(db, `ChuDe/${id}`));
            alert("Đã xoá thành công!");
            fetchChuDeList();
        } catch (error) {
            console.error("Lỗi khi xoá:", error);
            alert("Xoá thất bại.");
        }
    };

    return (
        <>
            <Header />
            <h2 className="text-center mt-3">Quản lý chủ đề</h2>
            <div className="d-flex justify-content-end mb-3 me-3">
                <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                    Thêm chủ đề
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th className="text-center">Tên chủ đề</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chudeList.length > 0 ? (
                            chudeList.map((chude) => (
                                <tr key={chude.id}>
                                    <td>{chude.ten}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(chude)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(chude.id, chude.tenlink)}
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center">
                                    Không có chủ đề nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <AddItemModal<Chude>
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAdd}
                fields={["ten", "tenlink"]}
                title="Thêm chủ đề mới"
            />

            <EditItemModal<Chude>
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                item={selectedChude!}
                excludeFields={["id"]}
                title="Chỉnh sửa chủ đề"
            />
        </>
    );
}

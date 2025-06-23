import { useEffect, useState } from "react";
import type { Chude } from "../interfaces/ChuDe";
import { db } from "../firebase";
import { equalTo, get, onValue, orderByChild, push, query, ref, remove, update } from "firebase/database";
import Header from "../partialsAdmin/Header";
import EditItemModal from "../modals/EditItem";
import AddItemModal from "../modals/AddItem";

export default function QuanLyChuDe() {
    const [chudeList, setChudeList] = useState<Chude[]>([]);
    const [selectedChude, setSelectedChude] = useState<Chude | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);


    const fetchChuDeList = async () => {
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
    };

    const handleEdit = (chude: Chude) => {
        setSelectedChude(chude);
        setShowModal(true);
    };

    useEffect(() => {
        fetchChuDeList();
    }, []);

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

    const handleDelete = async (id: string, chude: string) => {
        const sachQuery = query(ref(db, 'Sach'), orderByChild('chude'), equalTo(chude));
        onValue(sachQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                alert("Còn sách thuộc chủ đề này!!!");
                return;
            } else {
                remove(ref(db, `ChuDe/${id}`));
                alert("Đã xoá thành công");
            }
        });
    }
    return (
        <>
            <Header />
            <h2 className="text-center mt-3">Quản lý chủ đề</h2>
            <div className="d-flex justify-content-end mb-3 me-3">
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >
                    Thêm chủ đề
                </button>
            </div>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th className="text-center">Tên chủ đề</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {chudeList.map((chude) => (
                        <tr key={chude.id}>
                            <td>{chude.ten}</td>
                            <td className="text-center">
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-secondary me-1"
                                        onClick={() => handleEdit(chude)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary ms-1"
                                        onClick={() => handleDelete(chude.id, chude.tenlink)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
    )
}
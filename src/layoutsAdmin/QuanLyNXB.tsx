import { useEffect, useState } from "react";
import { db } from "../firebase";
import { equalTo, get, onValue, orderByChild, push, query, ref, remove, update } from "firebase/database";
import Header from "../partialsAdmin/Header";
import EditItemModal from "../modals/EditItem";
import AddItemModal from "../modals/AddItem";
import type { NXB } from "../interfaces/NXB";

export default function QuanLyNXB() {
    const [NXBList, setNXBList] = useState<NXB[]>([]);
    const [selectedNXB, setSelectedNXB] = useState<NXB | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);


    const fetchNXBList = async () => {
        const snapshot = await get(ref(db, "NXB"));
        const data = snapshot.val();
        if (data) {
            const list = Object.entries(data).map(([id, value]) => ({
                id,
                ...(value as Omit<NXB, "id">),
            }));
            setNXBList(list);
        } else {
            setNXBList([]);
        }
    };

    const handleEdit = (NXB: NXB) => {
        setSelectedNXB(NXB);
        setShowModal(true);
    };

    useEffect(() => {
        fetchNXBList();
    }, []);

    const handleSave = async (updatedNXB: NXB) => {
        try {
            await update(ref(db, `NXB/${updatedNXB.id}`), {
                ten: updatedNXB.ten,
                tenlink: updatedNXB.tenlink,
            });
            alert("Cập nhật thành công!");
            fetchNXBList();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại.");
        }
    };
    const handleAdd = async (newNXB: Omit<NXB, "id">) => {
        try {
            await push(ref(db, "NXB"), newNXB);
            alert("Thêm mới thành công!");
            fetchNXBList();
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            alert("Thêm thất bại.");
        }
    };

    const handleDelete = async (id: string, NXB: string) => {
        const sachQuery = query(ref(db, 'Sach'), orderByChild('nxb'), equalTo(NXB));
        onValue(sachQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                alert("Còn sách thuộc nhà xuất bản này!!!");
                return;
            } else {
                remove(ref(db, `NXB/${id}`));
                alert("Đã xoá thành công");
            }
        });
    }
    return (
        <>
            <Header />
            <h2 className="text-center mt-3">Quản lý nhà xuất bản</h2>
            <div className="d-flex justify-content-end mb-3 me-3">
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >
                    Thêm nhà xuất bản mới
                </button>
            </div>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th className="text-center">Tên nhà xuất bản</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {NXBList.map((NXB) => (
                        <tr key={NXB.id}>
                            <td>{NXB.ten}</td>
                            <td className="text-center">
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-secondary me-1"
                                        onClick={() => handleEdit(NXB)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary ms-1"
                                        onClick={() => handleDelete(NXB.id, NXB.tenlink)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddItemModal<NXB>
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAdd}
                fields={["ten", "tenlink"]}
                title="Thêm chủ nhà xuất bản mới"
            />

            <EditItemModal<NXB>
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                item={selectedNXB!}
                excludeFields={["id"]}
                title="Chỉnh sửa nhà xuất bản đề"
            />
        </>
    )
}
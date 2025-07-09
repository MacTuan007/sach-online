import { useEffect, useState } from "react";
import { db } from "../firebase";
import { get, push, ref, remove, set } from "firebase/database";
import AddSachModal from "../modals/AddSach";
import EditSachModal from "../modals/EditSach";
import type { Sach } from "../interfaces/Sach";

export default function QuanLySach() {
  const [sachList, setSachList] = useState<Sach[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editSach, setEditSach] = useState<Sach | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchSachList = async () => {
    const snapshot = await get(ref(db, "Sach"));
    const data = snapshot.val();
    if (data) {
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...(value as Omit<Sach, "id">),
      }));
      setSachList(list);
    } else {
      setSachList([]);
    }
  };

  useEffect(() => {
    fetchSachList();
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://sach-online.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.imageUrl || null;
  };

  const handleAdd = async (sach: Omit<Sach, "id">, imageFile: File | null) => {
    if (!imageFile) return alert("Vui lòng chọn ảnh!");
    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) return alert("Lỗi upload ảnh!");
    await push(ref(db, "Sach"), { ...sach, image: imageUrl });
    fetchSachList();
  };

  const handleEdit = async (sach: Sach, imageFile: File | null) => {
    let imageUrl = sach.image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }
    await set(ref(db, `Sach/${sach.id}`), { ...sach, image: imageUrl });
    fetchSachList();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    await remove(ref(db, `Sach/${id}`));
    fetchSachList();
  };

  // === PHÂN TRANG ===
  const totalPages = Math.ceil(sachList.length / itemsPerPage);
  const paginatedData = sachList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Quản lý sách</h3>
      <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>+ Thêm sách</button>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Tên</th>
            <th>Tác giả</th>
            <th>Giá</th>
            <th>Ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((s) => (
            <tr key={s.id}>
              <td>{s.ten}</td>
              <td>{s.tacgia}</td>
              <td>{s.giatien.toLocaleString()} ₫</td>
              <td><img src={s.image} alt={s.ten} width={80} /></td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => setEditSach(s)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thanh phân trang */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(currentPage - 1)}>Trước</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => changePage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(currentPage + 1)}>Tiếp</button>
            </li>
          </ul>
        </nav>
      )}

      <AddSachModal show={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
      {editSach && (
        <EditSachModal
          show={!!editSach}
          onClose={() => setEditSach(null)}
          onSave={handleEdit}
          sach={editSach}
        />
      )}
    </div>
  );
}

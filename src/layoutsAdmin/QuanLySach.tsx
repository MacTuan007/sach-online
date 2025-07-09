import { useEffect, useState } from "react";
import { db } from "../firebase";
import { get, push, ref, remove, set } from "firebase/database";
import SachModal from "../modals/Sachmodal";
import type { Sach } from "../interfaces/Sach";

export default function QuanLySach() {
  const [sachList, setSachList] = useState<Sach[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editSach, setEditSach] = useState<Sach | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchSachList();
  }, []);

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

  const handleAdd = async (sach: Sach | Omit<Sach, "id">, imageFile: File | null): Promise<void> => {
    if (!imageFile) return alert("Vui lòng chọn ảnh!");
    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) return alert("Lỗi upload ảnh!");
    const newRef = await push(ref(db, "Sach"), { ...sach, image: imageUrl });
    const id = newRef.key!;
    setSachList(prev => [...prev, { ...(sach as Omit<Sach, "id">), image: imageUrl, id }]);
  };

  const handleEdit = async (sach: Sach | Omit<Sach, "id">, imageFile: File | null): Promise<void> => {
    if (!("id" in sach)) return;
    let imageUrl = sach.image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }
    await set(ref(db, `Sach/${sach.id}`), { ...sach, image: imageUrl });
    setSachList(prev => prev.map(item => item.id === sach.id ? { ...(sach as Sach), image: imageUrl } : item));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    await remove(ref(db, `Sach/${id}`));
    setSachList(prev => prev.filter(s => s.id !== id));
  };

  const totalPages = Math.ceil(sachList.length / itemsPerPage);
  const paginatedData = sachList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const emptySach: Omit<Sach, "id"> = {
    ten: "",
    tacgia: "",
    giatien: 0,
    image: "",
    nxb: "",
    chude: "",
    soluong: 1,
    noidung: "",
    ttnoidung: ""
  };

  const renderPagination = () => (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => changePage(currentPage - 1)}>
            Trước
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li
            key={i + 1}
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => changePage(i + 1)}>
              {i + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => changePage(currentPage + 1)}>
            Tiếp
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Quản lý sách</h3>
      <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>
        + Thêm sách
      </button>

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
              <td>
                <img src={s.image} alt={s.ten} width={80} />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => setEditSach(s)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(s.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && renderPagination()}

      <SachModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
      />

      <SachModal
        show={editSach !== null}
        onClose={() => setEditSach(null)}
        onSave={handleEdit}
        initSach={editSach || emptySach}
        isEdit
      />
    </div>
  );
}

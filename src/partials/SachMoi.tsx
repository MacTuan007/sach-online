import { get, onValue, query, ref, set, update } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import type { Sach } from "../interfaces/Sach";
import { Link } from "react-router-dom";

export default function SachMoi() {
  const [sachList, setSachList] = useState<Sach[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const sachQuery = query(ref(db, "Sach"));
    const unsubscribe = onValue(sachQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Sach[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Sach, "id">),
        }));
        setSachList(list.reverse()); // ưu tiên sách mới nhất
      } else {
        setSachList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async (idSach: string) => {
    const email = localStorage.getItem("emailKey");
    if (!email) {
      alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const gioHangRef = ref(db, `GioHang/${email}/${idSach}`);
      const snapshot = await get(gioHangRef);

      if (snapshot.exists()) {
        const soLuongHienTai = snapshot.val();
        await update(ref(db, `GioHang/${email}`), {
          [idSach]: soLuongHienTai + 1,
        });
      } else {
        await set(gioHangRef, 1);
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const totalPages = Math.ceil(sachList.length / itemsPerPage);
  const currentSachList = sachList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <h2 className="text-center mb-4">📚 Sách mới</h2>
      <div className="row">
        {currentSachList.length > 0 ? (
          currentSachList.map((sach) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={sach.id}>
              <div className="card h-100 shadow-sm">
                <Link to={`/sanpham/${sach.id}`}>
                  <img
                    src={sach.image}
                    className="card-img-top img-fluid"
                    alt={sach.ten}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{sach.ten}</h5>
                  <p className="card-text text-truncate">{sach.ttnoidung}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleAddToCart(sach.id)}
                  >
                    🛒 Thêm sản phẩm
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h5 className="text-center">Không có sách nào.</h5>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Trước
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

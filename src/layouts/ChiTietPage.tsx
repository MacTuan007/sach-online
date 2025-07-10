import { Link, useParams } from "react-router-dom";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { useEffect, useState } from "react";
import { equalTo, get, onValue, orderByChild, query, ref, set, update } from "firebase/database";
import { db } from "../firebase";
import type { Sach } from "../interfaces/Sach";

export default function ChiTietPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Sach | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Sach[]>([]);
  const [chuDeMap, setChuDeMap] = useState<Record<string, string>>({});
  const [nxbMap, setNxbMap] = useState<Record<string, string>>({});

  // Lấy chi tiết sách theo id
  useEffect(() => {
    if (!id) return;
    const productRef = ref(db, `Sach/${id}`);
    get(productRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProduct({ id, ...data });
      }
    });
  }, [id]);

  // Lấy danh sách sách cùng tác giả
  useEffect(() => {
    if (!product?.tacgia) return;

    const sachQuery = query(ref(db, `Sach`), orderByChild("tacgia"), equalTo(product.tacgia));
    const unsubscribe = onValue(sachQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Sach[] = Object.entries(data)
          .map(([id, value]) => ({ id, ...(value as Omit<Sach, "id">) }))
          .filter((s) => s.id !== product.id); // Bỏ sách hiện tại
        setRelatedBooks(list);
      } else {
        setRelatedBooks([]);
      }
    });

    return () => unsubscribe();
  }, [product]);

  useEffect(() => {
    // Lấy danh sách chủ đề
    get(ref(db, "ChuDe")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map: Record<string, string> = {};
        Object.values(data).forEach((item: any) => {
          map[item.tenlink] = item.ten;
        });
        setChuDeMap(map);
      }
    });

    // Lấy danh sách nhà xuất bản
    get(ref(db, "NXB")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map: Record<string, string> = {};
        Object.values(data).forEach((item: any) => {
          map[item.tenlink] = item.ten;
        });
        setNxbMap(map);
      }
    });
  }, []);


  const handleAddToCart = (idSach: string) => {
    const email = localStorage.getItem("emailKey");
    if (!email) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    const gioHangRef = ref(db, `GioHang/${email}/${idSach}`);
    get(gioHangRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const soLuongHienTai = snapshot.val();
          update(ref(db, `GioHang/${email}`), {
            [idSach]: soLuongHienTai + 1,
          });
        } else {
          set(gioHangRef, 1);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
      });
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        {product ? (
          <>
            <div className="row g-4">
              <div className="col-md-5 text-center">
                <img
                  src={product.image || "/images/no-image.png"}
                  alt={product.ten}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
              <div className="col-md-7">
                <h2 className="fw-bold mb-3">{product.ten}</h2>
                <ul className="list-unstyled">
                  <li><strong>Tác giả:</strong> {product.tacgia}</li>
                  <li><strong>Nhà xuất bản:</strong> {nxbMap[product.nxb] || product.nxb}</li>
                  <li><strong>Chủ đề:</strong> {chuDeMap[product.chude] || product.chude}</li>
                  <li>
                    <strong>Giá:</strong>{" "}
                    {product.khuyenmai && product.khuyenmai > 0 && product.khuyenmai < product.giatien! ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          {product.giatien?.toLocaleString()} VND
                        </span>
                        <span className="text-danger fw-bold">
                          {product.khuyenmai.toLocaleString()} VND
                        </span>
                      </>
                    ) : (
                      <>{product.giatien?.toLocaleString() || 0} VND</>
                    )}
                  </li>

                  <li><strong>Số lượng còn:</strong> {product.soluong}</li>
                </ul>
                <button
                  className="btn btn-primary mt-3 w-100 w-md-auto"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-3">Nội dung chi tiết</h4>
              <div className="border p-3 rounded bg-light" style={{ whiteSpace: "pre-line" }}>
                {product.noidung}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-3">Sách cùng tác giả</h4>
              <div className="row">
                {relatedBooks.length > 0 ? (
                  relatedBooks.map((sach) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={sach.id}>
                      <Link to={`/sanpham/${sach.id}`}>
                        <div className="card h-100 shadow-sm">
                          <img src={sach.image} className="card-img-top img-fluid" alt={sach.ten} />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{sach.ten}</h5>
                            <p className="card-text text-truncate">{sach.ttnoidung}</p>
                            {sach.khuyenmai && sach.khuyenmai > 0 && sach.khuyenmai < sach.giatien! ? (
                              <p className="text-danger mb-1">
                                <span className="text-muted text-decoration-line-through me-2">
                                  {sach.giatien?.toLocaleString()} VND
                                </span>
                                {sach.khuyenmai.toLocaleString()} VND
                              </p>
                            ) : (
                              <p className="mb-1">{sach.giatien?.toLocaleString()} VND</p>
                            )}
                            <button className="btn btn-primary mt-auto" onClick={() => handleAddToCart(sach.id)}>Thêm sản phẩm</button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>Không có sách nào.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Đang tải sản phẩm...</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

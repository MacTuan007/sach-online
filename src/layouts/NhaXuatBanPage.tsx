import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, onValue, get, update, set } from 'firebase/database';
import { db } from '../firebase';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import ChuDePartial from '../partials/ChuDePartial';
import NhaXuatBanPartial from '../partials/NhaXuatBanPartial';
import Footer from '../partials/Footer';
import type { Sach } from '../interfaces/Sach';

export default function NhaXuatBanPage() {
  const { NXB: nxbParam } = useParams();
  const [sachList, setSachList] = useState<Sach[]>([]);
  const [tenNXB, setTenNXB] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSachList = sachList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sachList.length / itemsPerPage);

  // Lấy danh sách sách theo nhà xuất bản
  useEffect(() => {
    let sachRef;
    if (!nxbParam) {
      sachRef = ref(db, "Sach");
    } else {
      sachRef = query(ref(db, "Sach"), orderByChild("nxb"), equalTo(nxbParam));
    }

    const unsubscribe = onValue(sachRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as Sach[];
        setSachList(list);
      } else {
        setSachList([]);
      }
    });

    return () => unsubscribe();
  }, [nxbParam]);

  // Lấy tên nhà xuất bản từ đường dẫn (nếu có)
  useEffect(() => {
    if (!nxbParam) return;

    const nxbRef = ref(db, "NXB");
    const nxbQuery = query(nxbRef, orderByChild("tenlink"), equalTo(nxbParam));

    const unsubscribe = onValue(nxbQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const values = Object.values(data) as { ten: string }[];
        if (values.length > 0) {
          setTenNXB(values[0].ten);
        }
      }
    });

    return () => unsubscribe();
  }, [nxbParam]);

  const handleAddToCart = (idSach: string) => {
    const email = localStorage.getItem('emailKey');
    if (!email) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    const gioHangRef = ref(db, `GioHang/${email}/${idSach}`);
    get(gioHangRef).then((snapshot) => {
      if (snapshot.exists()) {
        const soLuongHienTai = snapshot.val();
        update(ref(db, `GioHang/${email}`), {
          [idSach]: soLuongHienTai + 1
        });
      } else {
        set(gioHangRef, 1);
      }
    }).catch((error) => {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    });
  };

  return (
    <>
      <Header />
      <Banner />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ChuDePartial />
            <br />
            <NhaXuatBanPartial />
          </div>
          <div className="col-9">
            <h2 className="text-center">
              {nxbParam ? `Sách theo nhà xuất bản: ${tenNXB}` : 'Tất cả sách'}
            </h2>
            <div className="row">
              {currentSachList.length > 0 ? (
                <>
                  {currentSachList.map((sach, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
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
                  ))}
                  {totalPages > 1 && (
                    <nav className="mt-4 w-100">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Trước</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Sau</button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              ) : (
                <h4 className="text-center">Không có sách nào.</h4>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
      <br />
    </>
  );
}

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

export default function ChuDePage() {
  const { chude } = useParams();
  const [sachList, setSachList] = useState<Sach[]>([]);
  const [tenChude, setTenChude] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSachList = sachList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sachList.length / itemsPerPage);

  // Lấy danh sách sách theo chủ đề
  useEffect(() => {
    let sachQuery;
    if (!chude) {
      sachQuery = ref(db, 'Sach');
    } else {
      sachQuery = query(ref(db, 'Sach'), orderByChild('chude'), equalTo(chude));
    }

    const unsubscribe = onValue(sachQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Sach[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Sach, 'id'>),
        }));
        setSachList(list);
      } else {
        setSachList([]);
      }
    });

    return () => unsubscribe();
  }, [chude]);

  // Lấy tên chủ đề từ đường link
  useEffect(() => {
    if (!chude) return;

    const chudeRef = query(ref(db, 'ChuDe'), orderByChild('tenlink'), equalTo(chude));

    const unsubscribe = onValue(chudeRef, (snapshot) => {
      const chudeData = snapshot.val();
      if (chudeData) {
        const chudeList = Object.values(chudeData) as { ten: string }[];
        if (chudeList.length > 0) {
          setTenChude(chudeList[0].ten);
        }
      }
    });

    return () => unsubscribe();
  }, [chude]);

  const handleAddToCart = (idSach: string) => {
    const email = localStorage.getItem('emailKey');
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
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
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
              {chude ? `Sách theo chủ đề: ${tenChude}` : 'Tất cả sách'}
            </h2>
            <div className="row">
              {currentSachList.length > 0 ? (
                <>
                  {currentSachList.map((sach, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                      <div className="card h-100 shadow-sm">
                        <Link to={`/sanpham/${sach.id}`}>
                          <img src={sach.image} className="card-img-top img-fluid" alt={sach.ten} />
                        </Link>
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{sach.ten}</h5>
                          <p className="card-text text-truncate">{sach.ttnoidung}</p>
                          <button
                            className="btn btn-primary mt-auto"
                            onClick={() => handleAddToCart(sach.id)}
                          >
                            Thêm sản phẩm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <nav className="mt-4 w-100">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                          Sau
                        </button>
                      </li>
                    </ul>
                  </nav>
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

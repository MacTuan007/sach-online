import { get, limitToFirst, onValue, query, ref, set, update } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import type { Sach } from "../interfaces/Sach";

export default function SachMoi() {
  const [sachList, setSachList] = useState<Sach[]>([]);
  useEffect(() => {
    const sachQuery = query(ref(db, 'Sach'), limitToFirst(12));
    const unsubscribe = onValue(sachQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Sach[] = Object.entries(data).map(([id, value]) => ({
          id, ...(value as Omit<Sach, "id">)
        }));
        setSachList(list);
      } else {
        setSachList([]);
      }
    });
    return () => unsubscribe();
  }, []);

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
      <div className="col-9">
        <h2 className="text-center">Sách mới</h2>
        <div className="row text-center">
          {sachList.length > 0 ? (
            sachList.map((sach, index) => (
              <div className="col-sm-6 col-md-4 col-lg-4 mb-4" key={index}>
                <div className="thumbnail h-100">
                  <img src={sach.image} className="img-fluid img-rounded imgbook" alt={sach.ten} />
                  <div className="caption mt-2">
                    <h5>{sach.ten}</h5>
                    <p>{sach.ttnoidung}</p>
                    <button className="btn btn-primary" onClick={() => handleAddToCart(sach.id)}>Thêm sản phẩm</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sách nào.</p>
          )}
        </div>
      </div>
    </>
  )
}


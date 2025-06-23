import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
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
  const [tenchude, settenchude] = useState<String>();
  if (!chude) {
    useEffect(() => {
      const sachRef = ref(db, `Sach`);
      const unsubscribe = onValue(sachRef, (snapshot) => {
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
    }, [chude]);
  }
  else {
    useEffect(() => {
      if (!chude) return;

      const sachQuery = query(ref(db, 'Sach'), orderByChild('chude'), equalTo(chude));

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
    }, [chude]);
  }
  useEffect(() => {
    if (chude) {
      const chudeRef = ref(db, `ChuDe`);
      const chudeQuery = query(chudeRef, orderByChild('tenlink'), equalTo(chude || ''));
      const unsubscribe = onValue(chudeQuery, (snapshot) => {
        const chudeData = snapshot.val();
        if (chudeData) {
          const chudeList = Object.values(chudeData) as { ten: string }[];
          if (chudeList.length > 0) {
            settenchude(chudeList[0].ten);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [tenchude]);



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
            <h2 className="text-center">Sách theo chủ đề: {tenchude}</h2>
            <div className="row text-center">
              {sachList.length > 0 ? (
                sachList.map((sach, index) => (
                  <div className="col-sm-6 col-md-4 col-lg-4 mb-4" key={index}>
                    <div className="thumbnail h-100">
                      <Link to={`/sanpham/${sach.id}`}>
                        <img src={sach.image} className="card-img-top img-fluid " alt={sach.ten} />
                      </Link>
                      <div className="caption mt-2">
                        <h5>{sach.ten}</h5>
                        <p>{sach.ttnoidung}</p>
                        <button className="btn btn-primary">Thêm sản phẩm</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có sách nào trong chủ đề này.</p>
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
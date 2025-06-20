import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../firebase';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import ChuDePartial from '../partials/ChuDePartial';
import NhaXuatBanPartial from '../partials/NhaXuatBanPartial';
import Footer from '../partials/Footer';
import type { Sach } from '../interfaces/Sach';

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function ChuDePage() {
  const chude = useQuery().get('chude') || '';
  const [sachList, setSachList] = useState<Sach[]>([]);
  if (!chude) {
    useEffect(() => {
      const sachRef = ref(db, `Sach`);
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
    }, [chude]);
  }
  else {
    useEffect(() => {
      if (!chude) return;

      const sachQuery = query(ref(db, 'Sach'), orderByChild('chude'), equalTo(chude));

      const unsubscribe = onValue(sachQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data) as Sach[];
          setSachList(list);
        } else {
          setSachList([]);
        }
      });

      return () => unsubscribe();
    }, [chude]);
  }



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
            <h2 className="text-center">Sách theo chủ đề: {chude}</h2>
            <div className="row text-center">
              {sachList.length > 0 ? (
                sachList.map((sach, index) => (
                  <div className="col-sm-6 col-md-4 col-lg-4 mb-4" key={index}>
                    <div className="thumbnail h-100">
                      <img src={sach.image} className="img-fluid img-rounded imgbook" alt={sach.ten} />
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
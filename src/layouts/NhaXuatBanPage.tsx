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

export default function NhaXuatBanPage() {
  const NXB  = useQuery().get('NXB') || '';
  const [NXBList, setNXBList] = useState<Sach[]>([]);
  if (!NXB) {
    useEffect(() => {
      const NXBRef = ref(db, `Sach`);
      const unsubscribe = onValue(NXBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data) as Sach[];
          setNXBList(list);
        } else {
          setNXBList([]);
        }
      });

      return () => unsubscribe();
    }, [NXB]);
  }
  else {
    useEffect(() => {
      if (!NXB) return;

      const sachQuery = query(ref(db, 'Sach'), orderByChild('nxb'), equalTo(NXB));

      const unsubscribe = onValue(sachQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data) as Sach[];
          setNXBList(list);
        } else {
          setNXBList([]);
        }
      });

      return () => unsubscribe(); 
    }, [NXB]);
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
            <h2 className="text-center">Sách theo nhà xuất bản: {NXB}</h2>
            <div className="row text-center">
              {NXBList.length > 0 ? (
                <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
                  {NXBList.map((sach, index) => (
                    <div className="thumbnail" key={index}>
                      <img src={sach.image} className="img-responsive img-rounded imgbook" alt={sach.ten} />
                      <div className="caption">
                        <h3 >{sach.ten}</h3>
                        <p className="">{sach.ttnoidung}</p>
                        <button className="btn btn-primary">Thêm sản phẩm</button>
                      </div>
                    </div>
                  ))}
                </div>
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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../firebase';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import ChuDePartial from '../partials/ChuDePartial';
import NhaXuatBanPartial from '../partials/NhaXuatBanPartial';
import Footer from '../partials/Footer';
import type { Sach } from '../interfaces/Sach';



export default function ChuDePage() {
  const { chude } = useParams(); // lấy 'luat' từ URL
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

      return () => unsubscribe(); // cleanup listener khi component unmount
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
                <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
                  {sachList.map((sach, index) => (
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
import { onValue, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import type { NXB } from "../interfaces/NXB";

export default function NhaXuatBanPartial() {
  const [NXBList, setNXBList] = useState<NXB[]>([]);

  useEffect(() => {
    const nxbQuery = query(ref(db, "NXB"));
    const unsubscribe = onValue(nxbQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: NXB[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<NXB, "id">),
        }));
        setNXBList(list);
      } else {
        setNXBList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ul className="list-group" id="NhaXuatBanPartial">
      <li className="list-group-item active text-center fw-bold">
        🏢 SÁCH THEO NHÀ XUẤT BẢN
      </li>
      {NXBList.map((nxb) => (
        <li className="list-group-item" key={nxb.id}>
          <Link className="text-decoration-none" to={`/NXB/${nxb.tenlink}`}>
            {nxb.ten}
          </Link>
        </li>
      ))}
    </ul>
  );
}

import { onValue, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import type { Chude } from "../interfaces/ChuDe";

export default function ChuDePartial() {
  const [chudeList, setChudeList] = useState<Chude[]>([]);

  useEffect(() => {
    const chudeQuery = query(ref(db, "ChuDe"));
    const unsubscribe = onValue(chudeQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Chude[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Chude, "id">),
        }));
        setChudeList(list);
      } else {
        setChudeList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ul className="list-group" id="ChuDePartial">
      <li className="list-group-item active text-center fw-bold">
        📘 SÁCH THEO CHỦ ĐỀ
      </li>
      {chudeList.map((chude) => (
        <li className="list-group-item" key={chude.id}>
          <Link className="text-decoration-none" to={`/chude/${chude.tenlink}`}>
            {chude.ten}
          </Link>
        </li>
      ))}
    </ul>
  );
}

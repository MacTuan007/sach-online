import { onValue, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import type { Chude } from "../interfaces/ChuDe";

export default function ChuDePartial() {
    const [chudeList, setchudeList] = useState<Chude[]>([]);
    useEffect(() => {
        const sachQuery = query(ref(db, 'ChuDe'));
        const unsubscribe = onValue(sachQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Chude[] = Object.entries(data).map(([id, value]) => ({
                    id, ...(value as Omit<Chude, "id">)
                }));
                setchudeList(list);
            } else {
                setchudeList([]);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            <ul id="ChuDePartial" className="list-group">
                <li className="list-group-item active" style={{ fontWeight: "bold", textAlign: "center" }}>SÁCH THEO CHỦ ĐỀ</li>
                {chudeList.map((chude, index) => (
                    <li className="list-group-item" key={index}>
                        <Link className="text-decoration-none"
                            to={`/chude/${chude.tenlink}`}>{chude.ten}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
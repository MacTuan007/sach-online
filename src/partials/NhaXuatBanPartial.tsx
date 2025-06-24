import { Link } from "react-router-dom";
import type { NXB } from "../interfaces/NXB";
import { useEffect, useState } from "react";
import { onValue, query, ref } from "firebase/database";
import { db } from "../firebase";

export default function NhaXuatBanPartial() {

    const [NXBList, setNXBList] = useState<NXB[]>([]);
    useEffect(() => {
        const sachQuery = query(ref(db, 'NXB'));
        const unsubscribe = onValue(sachQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: NXB[] = Object.entries(data).map(([id, value]) => ({
                    id, ...(value as Omit<NXB, "id">)
                }));
                setNXBList(list);
            } else {
                setNXBList([]);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            <ul id="NhaXuatBanPartial" className="list-group">
                <ul id="ChuDePartial" className="list-group">
                    <li className="list-group-item active" style={{ fontWeight: "bold", textAlign: "center" }}>SÁCH THEO NHÀ XUẤT BẢN</li>
                    {NXBList.map((chude, index) => (
                        <li className="list-group-item" key={index}>
                            <Link className="text-decoration-none"
                                to={`/NXB/${chude.tenlink}`}>{chude.ten}</Link>
                        </li>
                    ))}
                </ul>
            </ul>
        </>
    );
}
// import { useEffect, useState } from "react";
// import Header from "../partialsAdmin/Header";
// import type { Sach } from "../interfaces/Sach";
// import { onValue, query, ref } from "firebase/database";
// import { db } from "../firebase";

// export default function QuanLySach() {
//     const [sachList, setSachList] = useState<Sach[]>([]);
//     const [selectedSach, setSelectedSach] = useState<Sach | null>(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     useEffect(() => {
//         const sachQuery = query(ref(db, 'Sach'));
//         const unsubscribe = onValue(sachQuery, (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//                 const list: Sach[] = Object.entries(data).map(([id, value]) => ({
//                     id, ...(value as Omit<Sach, "id">)
//                 }));
//                 setSachList(list);
//             } else {
//                 setSachList([]);
//             }
//         });
//         return () => unsubscribe();
//     }, []);
//     const handleAdd = async (newSach: Omit<Sach, "id">) => {
        
//     };

//     const handleEdit = (sach: Sach) => {
        
//     };

//     const handleDelete = async (id: string) => {
        
//     }



//     return (
//         <>
//             <Header />
//             <h2 className="text-center mt-3">Quản lý Sách</h2>
//             <div className="d-flex justify-content-end mb-3 me-3">
//                 <button
//                     className="btn btn-success"
//                     onClick={() => {
//                         setShowAddModal(true);
//                     }}
//                 >
//                     Thêm Sách mới
//                 </button>
//             </div>
//             <table className="table table-bordered">
//                 <thead className="table-light">
//                     <tr>
//                         <th>Tên sách</th>
//                         <th className="text-center">Hình ảnh</th>
//                         <th className="text-center">Tóm tắt nội dung</th>
//                         <th className="text-end">Số lượng</th>
//                         <th className="text-end">Giá tiền</th>
//                         <th className="text-center">Thao tác</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {sachList.map((sach) => (
//                         <tr key={sach.id}>
//                             <td>{sach.ten}</td>
//                             <th className="text-center"><img src={sach.image}></img></th>
//                             <th className="text-center">{sach.ttnoidung}</th>
//                             <th className="text-center">{sach.soluong}</th>
//                             <th className="text-center">{sach.giatien}</th>
//                             <td className="text-center">
//                                 <td className="text-center">
//                                     <button
//                                         className="btn btn-sm btn-secondary me-1"
//                                         onClick={() => handleEdit(sach)}
//                                     >
//                                         Sửa
//                                     </button>
//                                     <button
//                                         className="btn btn-sm btn-secondary ms-1"
//                                         onClick={() => handleDelete(sach.id)}
//                                     >
//                                         Xoá
//                                     </button>
//                                 </td>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </>);
// }
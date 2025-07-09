import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase";
import { get, ref } from "firebase/database";
import type { Sach } from "../interfaces/Sach";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (sach: Sach, image: File | null) => void;
  sach: Sach;
}

export default function EditSachModal({ show, onClose, onSave, sach: initSach }: Props) {
  const [sach, setSach] = useState<Sach>(initSach);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [chuDes, setChuDes] = useState<{ ten: string, tenlink: string }[]>([]);
  const [nxbs, setNxbs] = useState<{ ten: string, tenlink: string }[]>([]);

  useEffect(() => {
    if (show) {
      setSach(initSach);
      fetchOptions();
    }
  }, [show, initSach]);

  const fetchOptions = async () => {
    const chudeSnap = await get(ref(db, "ChuDe"));
    const nxbSnap = await get(ref(db, "NhaXuatBan"));
    if (chudeSnap.exists()) setChuDes(Object.values(chudeSnap.val()) as any[]);
    if (nxbSnap.exists()) setNxbs(Object.values(nxbSnap.val()) as any[]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSach(prev => ({ ...prev, [name]: name === "giatien" || name === "soluong" ? Number(value) : value }));
  };

  const handleSubmit = () => {
    if (!sach.ten || !sach.nxb || !sach.chude) return alert("Thiếu thông tin!");
    onSave(sach, imageFile);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton><Modal.Title>Sửa sách</Modal.Title></Modal.Header>
      <Modal.Body>
        <input name="ten" value={sach.ten} className="form-control mb-2" onChange={handleChange} />
        <input name="tacgia" value={sach.tacgia} className="form-control mb-2" onChange={handleChange} />
        <input name="giatien" type="number" value={sach.giatien} className="form-control mb-2" onChange={handleChange} />
        <input name="soluong" type="number" value={sach.soluong} className="form-control mb-2" onChange={handleChange} />
        <select name="nxb" value={sach.nxb} className="form-control mb-2" onChange={handleChange}>
          <option value="">-- Chọn NXB --</option>
          {nxbs.map((n, i) => <option key={i} value={n.tenlink}>{n.ten}</option>)}
        </select>
        <select name="chude" value={sach.chude} className="form-control mb-2" onChange={handleChange}>
          <option value="">-- Chọn Chủ đề --</option>
          {chuDes.map((c, i) => <option key={i} value={c.tenlink}>{c.ten}</option>)}
        </select>
        <textarea name="ttnoidung" value={sach.ttnoidung} className="form-control mb-2" onChange={handleChange} />
        <textarea name="noidung" value={sach.noidung} className="form-control mb-2" onChange={handleChange} />
        <input type="file" className="form-control mb-2" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
        <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
      </Modal.Footer>
    </Modal>
  );
}

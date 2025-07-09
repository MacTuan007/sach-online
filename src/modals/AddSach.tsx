import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { db } from "../firebase";
import { get, ref } from "firebase/database";
import type { Sach } from "../interfaces/Sach";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (sach: Omit<Sach, "id">, image: File | null) => void;
}

export default function AddSachModal({ show, onClose, onSave }: Props) {
  const [sach, setSach] = useState<Omit<Sach, "id">>({
    ten: "", tacgia: "", giatien: 0, image: "", nxb: "", chude: "",
    soluong: 1, noidung: "", ttnoidung: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [chuDes, setChuDes] = useState<{ ten: string, tenlink: string }[]>([]);
  const [nxbs, setNxbs] = useState<{ ten: string, tenlink: string }[]>([]);

  const fetchOptions = async () => {
    const chudeSnap = await get(ref(db, "ChuDe"));
    const nxbSnap = await get(ref(db, "NhaXuatBan"));
    if (chudeSnap.exists()) {
      const data = Object.values(chudeSnap.val()) as any[];
      setChuDes(data);
    }
    if (nxbSnap.exists()) {
      const data = Object.values(nxbSnap.val()) as any[];
      setNxbs(data);
    }
  };

  useEffect(() => {
    if (show) fetchOptions();
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSach(prev => ({ ...prev, [name]: name === "giatien" || name === "soluong" ? Number(value) : value }));
  };

  const handleSubmit = () => {
    if (!sach.ten || !sach.chude || !sach.nxb) return alert("Điền đầy đủ thông tin!");
    onSave(sach, imageFile);
    onClose();
    setSach({ ten: "", tacgia: "", giatien: 0, image: "", nxb: "", chude: "", soluong: 1, noidung: "", ttnoidung: "" });
    setImageFile(null);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm sách</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input name="ten" placeholder="Tên" className="form-control mb-2" onChange={handleChange} />
        <input name="tacgia" placeholder="Tác giả" className="form-control mb-2" onChange={handleChange} />
        <input name="giatien" type="number" placeholder="Giá" className="form-control mb-2" onChange={handleChange} />
        <input name="soluong" type="number" placeholder="Số lượng" className="form-control mb-2" onChange={handleChange} />
        <select name="nxb" className="form-control mb-2" onChange={handleChange}>
          <option value="">-- Chọn NXB --</option>
          {nxbs.map((n, i) => <option key={i} value={n.tenlink}>{n.ten}</option>)}
        </select>
        <select name="chude" className="form-control mb-2" onChange={handleChange}>
          <option value="">-- Chọn Chủ đề --</option>
          {chuDes.map((c, i) => <option key={i} value={c.tenlink}>{c.ten}</option>)}
        </select>
        <textarea name="ttnoidung" placeholder="Tóm tắt nội dung" className="form-control mb-2" onChange={handleChange} />
        <textarea name="noidung" placeholder="Nội dung chi tiết" className="form-control mb-2" onChange={handleChange} />
        <input type="file" className="form-control mb-2" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
        <Button variant="success" onClick={handleSubmit}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}

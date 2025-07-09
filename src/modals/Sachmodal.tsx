import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Sach } from "../interfaces/Sach";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (sach: Omit<Sach, "id"> | Sach, image: File | null) => void;
  initSach?: Sach | Omit<Sach, "id">;
  isEdit?: boolean;
};

export default function SachModal({ show, onClose, onSave, initSach, isEdit }: Props) {
  const [sach, setSach] = useState<Omit<Sach, "id">>({
    ten: "",
    tacgia: "",
    giatien: 0,
    image: "",
    nxb: "",
    chude: "",
    soluong: 1,
    noidung: "",
    ttnoidung: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initSach) {
      const { id, ...rest } = initSach as Sach;
      setSach(rest);
    }
  }, [initSach]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSach(prev => ({
      ...prev,
      [name]: name === "giatien" || name === "soluong" ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = () => {
    if (!sach.ten || !sach.tacgia || !sach.giatien || !sach.nxb || !sach.chude) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const result = isEdit && initSach ? { ...sach, id: (initSach as Sach).id } : sach;
    onSave(result, imageFile);
    onClose();
    setImageFile(null);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Sửa sách" : "Thêm sách"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Tên sách</Form.Label>
            <Form.Control name="ten" value={sach.ten} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tác giả</Form.Label>
            <Form.Control name="tacgia" value={sach.tacgia} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Giá tiền</Form.Label>
            <Form.Control type="number" name="giatien" value={sach.giatien} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Nhà xuất bản</Form.Label>
            <Form.Control name="nxb" value={sach.nxb} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Chủ đề</Form.Label>
            <Form.Control name="chude" value={sach.chude} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control type="number" name="soluong" value={sach.soluong} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Thông tin nội dung</Form.Label>
            <Form.Control name="ttnoidung" value={sach.ttnoidung} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="noidung"
              value={sach.noidung}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Ảnh {isEdit && "(bỏ qua nếu không thay đổi)"}</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEdit ? "Lưu thay đổi" : "Thêm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

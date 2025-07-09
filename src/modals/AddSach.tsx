import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Sach } from "../interfaces/Sach";

type AddSachModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (sach: Omit<Sach, "id">, imageFile: File | null) => void;
};

export default function AddSachModal({ show, onClose, onSave }: AddSachModalProps) {
  const [formData, setFormData] = useState<Omit<Sach, "id">>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "giatien" || name === "soluong" ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleSubmit = () => {
    onSave(formData, imageFile);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm sách</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control name="ten" placeholder="Tên sách" className="mb-2" onChange={handleChange} />
          <Form.Control name="tacgia" placeholder="Tác giả" className="mb-2" onChange={handleChange} />
          <Form.Control type="number" name="giatien" placeholder="Giá tiền" className="mb-2" onChange={handleChange} />
          <Form.Control type="number" name="soluong" placeholder="Số lượng" className="mb-2" onChange={handleChange} />
          <Form.Control name="nxb" placeholder="NXB" className="mb-2" onChange={handleChange} />
          <Form.Control name="chude" placeholder="Chủ đề" className="mb-2" onChange={handleChange} />
          <Form.Control as="textarea" name="ttnoidung" placeholder="Tóm tắt nội dung" className="mb-2" onChange={handleChange} />
          <Form.Control as="textarea" name="noidung" placeholder="Nội dung chi tiết" className="mb-2" onChange={handleChange} />
          <Form.Control type="file" className="mb-2" onChange={handleImageChange} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button variant="success" onClick={handleSubmit}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}

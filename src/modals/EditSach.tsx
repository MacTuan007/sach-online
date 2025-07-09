import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Sach } from "../interfaces/Sach";

type EditSachModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (sach: Sach, imageFile: File | null) => void;
  sach: Sach;
};

export default function EditSachModal({ show, onClose, onSave, sach }: EditSachModalProps) {
  const [formData, setFormData] = useState<Omit<Sach, "id">>({ ...sach });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData({ ...sach });
  }, [sach]);

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
    onSave({ ...formData, id: sach.id }, imageFile);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa sách</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control name="ten" value={formData.ten} className="mb-2" onChange={handleChange} />
          <Form.Control name="tacgia" value={formData.tacgia} className="mb-2" onChange={handleChange} />
          <Form.Control type="number" name="giatien" value={formData.giatien} className="mb-2" onChange={handleChange} />
          <Form.Control type="number" name="soluong" value={formData.soluong} className="mb-2" onChange={handleChange} />
          <Form.Control name="nxb" value={formData.nxb} className="mb-2" onChange={handleChange} />
          <Form.Control name="chude" value={formData.chude} className="mb-2" onChange={handleChange} />
          <Form.Control as="textarea" name="ttnoidung" value={formData.ttnoidung} className="mb-2" onChange={handleChange} />
          <Form.Control as="textarea" name="noidung" value={formData.noidung} className="mb-2" onChange={handleChange} />
          <Form.Control type="file" className="mb-2" onChange={handleImageChange} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  );
}

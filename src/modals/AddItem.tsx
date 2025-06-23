import { useState } from "react";

type AddItemModalProps<T> = {
    show: boolean;
    onClose: () => void;
    onSave: (newItem: T) => void;
    fields: (keyof T)[];
    title?: string;
};

export default function AddItemModal<T extends Record<string, any>>({
    show,
    onClose,
    onSave,
    fields,
    title = "Thêm mới"
}: AddItemModalProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>({});

    const handleChange = (key: keyof T, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        onSave(formData as T);
        const clearedData = Object.fromEntries(fields.map((field) => [field, ""])) as Partial<T>;
        setFormData(clearedData);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {fields.map((field) => (
                            <div className="mb-3" key={field as string}>
                                <label className="form-label">{String(field)}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData[field] || ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={handleSave}>Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

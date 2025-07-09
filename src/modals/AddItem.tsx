import { useState } from "react";

type AddItemModalProps<T> = {
    show: boolean;
    onClose: () => void;
    onSave: (newItem: T) => void;
    fields: (keyof T)[];
    title?: string;
};

// Hàm format nhãn từ tên biến
function formatLabel(label: string | number | symbol): string {
    return String(label)
        .replace(/([a-z])([A-Z])/g, "$1 $2")  // camelCase -> camel Case
        .replace(/_/g, " ")                  // snake_case -> snake case
        .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize
}

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
                            <div className="mb-3" key={String(field)}>
                                <label className="form-label">{formatLabel(field)}</label>
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

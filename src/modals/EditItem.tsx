import { useEffect, useState } from "react";

type EditItemModalProps<T> = {
    show: boolean;
    onClose: () => void;
    onSave: (updatedItem: T) => void;
    item: T;
    excludeFields?: (keyof T)[];
    title?: string;
};

export default function EditItemModal<T extends Record<string, any>>({
    show,
    onClose,
    onSave,
    item,
    excludeFields = ["id" as keyof T],
    title = "Chỉnh sửa",
}: EditItemModalProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>({});

    useEffect(() => {
        if (item) {
            const filtered = Object.fromEntries(
                Object.entries(item).filter(([key]) => !excludeFields.includes(key as keyof T))
            );
            setFormData(filtered as Partial<T>);
        }
    }, [item, excludeFields]);

    const handleChange = (key: keyof T, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = () => {
        const updatedItem = { ...item, ...formData } as T;
        onSave(updatedItem);
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
                        {Object.entries(formData).map(([key, value], index) => (
                            <div className="mb-3" key={key}>
                                <label className="form-label">{formatLabel(key)}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={value as string}
                                    autoFocus={index === 0}
                                    onChange={(e) => handleChange(key as keyof T, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatLabel(label: string): string {
    return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

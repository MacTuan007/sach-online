import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResultPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("vnp_ResponseCode");

        if (status === "00") {
            navigate("/success");
        } else {
            navigate("/fail");
        }
    }, [navigate]);

    return <p>Đang xử lý...</p>;
}
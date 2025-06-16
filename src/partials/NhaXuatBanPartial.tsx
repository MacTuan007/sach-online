import { Link } from "react-router-dom";

export default function NhaXuatBanPartial() {
    return (
        <>
            <ul id="NhaXuatBanPartial" className="list-group">
                <li className="list-group-item active" style={{fontWeight:"bold", textAlign:"center"}}>SÁCH THEO NHÀ XUẤT BẢN</li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Nhà xuất bản Trẻ")}`}>Nhà xuất bản Trẻ</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("NXB Thống kê")}`}>NXB Thống kê</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Kim Đồng")}`}>Kim Đồng</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Đại học quốc gia")}`}>Đại học quốc gia</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Văn hoá nghệ thuật")}`}>Văn hoá nghệ thuật</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Văn hoá")}`}>Văn hoá</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Lao động - Xã hội")}`}>Lao động - Xã hội</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/NXB?NXB=${encodeURIComponent("Khoa Học & Kỹ Thuật")}`}>Khoa Học & Kỹ Thuật</Link></li>
            </ul>
        </>
    );
}
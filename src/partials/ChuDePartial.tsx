import { Link } from "react-router-dom";

export default function ChuDePartial() {
    return (
        <>
            <ul id="ChuDePartial" className="list-group">
                <li className="list-group-item active" style={{fontWeight:"bold", textAlign:"center"}}>SÁCH THEO CHỦ ĐỀ</li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Ngoại Ngữ")}`}>Ngoại Ngữ</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Công nghệ thông tin")}`}>Công nghệ thông tin</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Luật")}`}>Luật</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Văn học")}`}>Văn học</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Khoa học kỹ thuật")}`}>Khoa học kỹ thuật</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Nông nghiệp")}`}>Nông nghiệp</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Lịch sử, địa lý")}`}>Lịch sử, địa lý</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Kinh Tế")}`}>Kinh Tế</Link></li>
                <li className="list-group-item"><Link className="text-decoration-none"
                 to= {`/chude?chude=${encodeURIComponent("Nghệ thuật sống")}`}>Nghệ thuật sống</Link></li>
            </ul>
        </>
    );
}
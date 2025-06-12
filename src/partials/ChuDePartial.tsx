export default function ChuDePartial() {
    return (
        <>
            <ul id="ChuDePartial" className="list-group">
                <li className="list-group-item active" style={{fontWeight:"bold", textAlign:"center"}}>SÁCH THEO CHỦ ĐỀ</li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/Ngoai-ngu">Ngoại Ngữ</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/CNTT">Công nghệ thông tin</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="`/chude?chude=${encodeURIComponent`">Luật</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/Van-hoc">Văn học</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/KHKT">Khoa học kỹ thuật</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/Nong-nghiep">Nông nghiệp</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/LS-DL">Lịch sử, địa lý</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/Kinh-te">Kinh Tế</a></li>
                <li className="list-group-item"><a className="text-decoration-none"
                 href="/chude/NTS">Nghệ thuật sống</a></li>
            </ul>
        </>
    );
}
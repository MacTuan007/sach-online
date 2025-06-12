export default function NhaXuatBanPartial() {
    return (
        <>
            <ul id="ChuDePartial" className="list-group">
                <li className="list-group-item active" style={{fontWeight:"bold", textAlign:"center"}}>SÁCH THEO NHÀ XUẤT BẢN</li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/NXB-tre">Nhà xuất bản Trẻ</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/NXB-Thong-ke">NXB Thống kê</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/Kim-dong">Kim Đồng</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/DHQG">Đại học quốc gia</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/VHNT">Văn hoá nghệ thuật</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/Van-hoa">Văn hoá</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/LD-XH">Lao động - Xã hội</a></li>
                <li className="list-group-item"><a className="text-decoration-none" href="/NXB/KH-KT">Khoa Học & Kỹ Thuật</a></li>
            </ul>
        </>
    );
}
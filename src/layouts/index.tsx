import Header from "../partials/Header";
import Banner from "../partials/Banner";
import Footer from "../partials/Footer";
import ChuDePartial from "../partials/ChuDePartial";
import NhaXuatBanPartial from "../partials/NhaXuatBanPartial";
import SachMoi from "../partials/SachMoi";

export default function Index() {
    return (
        <>
            <Header />
            <Banner />
            <br />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <ChuDePartial />
                        <br />
                        <NhaXuatBanPartial />
                    </div>
                    <div className="col-9">
                        <SachMoi />
                    </div>
                </div>
            </div>
            <br />
            <Footer />
            
        </>
    );
}
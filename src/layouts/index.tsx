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
            <div className="container my-4">
                <div className="row">
                    <aside className="col-12 col-md-3 mb-4">
                        <ChuDePartial />
                        <NhaXuatBanPartial />
                    </aside>
                    <main className="col-12 col-md-9">
                        <SachMoi />
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}
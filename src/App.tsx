import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts/index';
import ChuDePage from './layouts/ChuDePage';
import DangKy from './layouts/DangKyPage.tsx';
import DangNhap from './layouts/DangNhapPage.tsx';
import NhaXuatBanPage from './layouts/NhaXuatBanPage.tsx';
import ShoppingPage from './layouts/ShoppingPage.tsx';
import IndexAdmin from './layoutsAdmin/indexAdmin.tsx';
import QuanLyChuDe from './layoutsAdmin/QuanLyChuDe.tsx';
import ChiTietPage from './layouts/ChiTietPage.tsx';
import QuanLyNXB from './layoutsAdmin/QuanLyNXB.tsx';
// import QuanLySach from './layoutsAdmin/QuanLySach.tsx';
import MerchantSite from './layouts/MerchantSite.tsx';
import ResultPage from './layouts/ResultPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chude/:chude" element={<ChuDePage />} />
        <Route path="/NXB/:NXB" element={<NhaXuatBanPage />} />
        <Route path='/DangKy' element={<DangKy />} />
        <Route path='/DangNhap' element={<DangNhap />} />
        <Route path='/sanpham/:id' element={<ChiTietPage />} />
        <Route path='/Shopping' element={<ShoppingPage />} />
        <Route path='/Merchant' element={<MerchantSite />} />
        <Route path='/Admin' element={<IndexAdmin />} />
        <Route path='/Admin/Chude' element={<QuanLyChuDe />} />
        <Route path='/Admin/NXB' element={<QuanLyNXB />} />
        {/* <Route path='/Admin/Sach' element={<QuanLySach />} /> */}
        <Route path="/payment-result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
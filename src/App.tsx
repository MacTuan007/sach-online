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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chude/:chude" element={<ChuDePage />} />
        <Route path="/NXB" element={<NhaXuatBanPage />} />
        <Route path='/DangKy' element={<DangKy/>} />
        <Route path='/DangNhap' element={<DangNhap/>} />
        <Route path='/sanpham/:id' element={<ChiTietPage/>} />
        <Route path='/Shopping' element={<ShoppingPage/>} />
        <Route path='/Admin' element={<IndexAdmin/>} />
        <Route path='/Admin/Chude' element={<QuanLyChuDe/>} />
      </Routes>
    </BrowserRouter>
  );
}
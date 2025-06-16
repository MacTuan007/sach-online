import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts/index';
import ChuDePage from './layouts/ChuDePage';
import DangKy from './layouts/DangKyPage.tsx';
import DangNhap from './layouts/DangNhapPage.tsx';
import NhaXuatBanPage from './layouts/NhaXuatBanPage.tsx';
import ShoppingPage from './layouts/ShoppingPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chude" element={<ChuDePage />} />
        <Route path="/NXB" element={<NhaXuatBanPage />} />
        <Route path='/DangKy' element={<DangKy/>} />
        <Route path='/DangNhap' element={<DangNhap/>} />
        <Route path='/Shopping' element={<ShoppingPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
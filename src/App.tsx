import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './layouts/index';
import ChuDePage from './layouts/ChuDePage';
import DangKy from './layouts/DangKyPage.tsx';
import DangNhap from './layouts/DangNhapPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chude/:chude" element={<ChuDePage />} />
        <Route path='/DangKy' element={<DangKy/>} />
        <Route path='/DangNhap' element={<DangNhap/>} />
      </Routes>
    </BrowserRouter>
  );
}
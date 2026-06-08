/**
 * App.jsx
 * จุดเริ่มต้นหลักของเว็บไซต์สโมสรนักศึกษาคณะสาธารณะสุขฯ มรย.
 * จัดการเรื่องเส้นทาง (Routing), เลย์เอาต์ส่วนกลาง (Navbar/Footer) และพฤติกรรมการเลื่อนหน้าจอ
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/* ─── นำเข้าคอมโพเนนต์ส่วนกลาง ─── */
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickServices from './components/QuickServices';
import CustomLoader from './components/Loader';

/* ─── นำเข้าหน้าหลักต่างๆ ─── */
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import MemberDetail from './pages/MemberDetail';
import Departments from './pages/Departments';
import DeptDetail from './pages/DeptDetail';
import Contact from './pages/Contact';
import Map from './pages/Map';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Admin from './pages/Admin';

/**
 * ScrollToTop Component
 * ช่วยให้หน้าจอเลื่อนกลับไปด้านบนสุดทุกครั้งที่มีการเปลี่ยนหน้า
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000); // 3 วินาที รอแอนิเมชันให้แสดงนานขึ้น
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <CustomLoader fullScreen={true} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />

      {/* ─── ส่วนเนื้อหาหลักของเว็บไซต์ ─── */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<MemberDetail />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:id" element={<DeptDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<Map />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </main>

      {/* ─── ฟุตเตอร์ส่วนท้ายของเว็บไซต์ ─── */}
      <Footer />

      {/* ─── ปุ่มบริการด่วน (Quick Services) ─── */}
      <QuickServices />
    </div>
  );
}

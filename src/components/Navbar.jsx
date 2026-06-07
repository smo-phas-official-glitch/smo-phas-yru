import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import './Navbar.css';

const navItems = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'เกี่ยวกับสโม', path: '/about' },
  { name: 'ชุดบริหาร', path: '/team' },
  { name: 'ฝ่ายงาน', path: '/departments' },
  { name: 'แผนผังมรย', path: '/map' },
  { name: 'ติดต่อ', path: '/contact' },
];


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const bgRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    // Find active item and animate the background bubble
    const activeIndex = navItems.findIndex(item =>
      (item.path === '/' && location.pathname === '/') ||
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
    if (activeIndex !== -1 && itemsRef.current[activeIndex] && bgRef.current) {
      const activeItem = itemsRef.current[activeIndex];
      const { offsetLeft, offsetWidth } = activeItem;

      gsap.to(bgRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.5,
        ease: "power3.out"
      });
    }
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-[100] transition-all duration-500 pointer-events-none px-4">
        <div className="pill-nav-wrapper pointer-events-auto flex justify-center">
          <div className="pill-nav-container w-[95%] md:w-fit md:max-w-[95vw] justify-between md:justify-center">
            {/* Standard Branding */}
            <Link to="/" className="branding-section shrink-0 group hover:scale-105 transition-transform flex items-center gap-3">
              <div className="branding-logo shrink-0 flex items-center justify-center">
                <img
                  src="/images/logo/sclogo.png"
                  alt="Logo"
                  className="h-10 md:h-12 w-auto drop-shadow-sm"
                />
              </div>
              <div className="branding-text shrink-0 flex flex-col justify-center overflow-hidden">
                <span className="branding-name font-black text-xs sm:text-sm truncate w-full max-w-[180px] sm:max-w-none">สโมสรนักศึกษาคณะสาธารณสุขศาสตร์และสหเวชศาสตร์</span>
                <span className="branding-sub text-[10px] sm:text-xs text-slate-500 truncate w-full max-w-[180px] sm:max-w-none">มหาวิทยาลัยราชภัฏยะลา</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 border-l border-slate-100 ml-4 pl-4 relative overflow-x-auto no-scrollbar">
              <div ref={bgRef} className="pill-active-bg" />
              {navItems.map((item, index) => {
                const isActive = (item.path === '/' && location.pathname === '/') ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    ref={(el) => itemsRef.current[index] = el}
                    className={`pill-link relative z-10 transition-colors duration-300 ${isActive ? 'active text-white font-black' : 'text-slate-500 hover:text-yru-pink'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Burger button */}
            <div className="md:hidden flex items-center ml-auto">
              <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-slate-50 text-slate-800 hover:text-yru-pink transition-colors rounded-full border border-slate-100"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Drawer for Mobile/Tablet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="mobile-drawer-overlay shadow-2xl"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer-content"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src="/images/logo/sclogo.png" alt="Logo" className="h-10 w-auto drop-shadow-sm" />
                  <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">YRU COUNCIL</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={28} className="text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = (item.path === '/' && location.pathname === '/') ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-5 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-between group ${isActive
                        ? 'bg-yru-pink text-white shadow-lg shadow-yru-pink/20 translate-x-2'
                        : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                        }`}
                    >
                      {item.name}
                      <ArrowRight size={18} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-5 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">มหาวิทยาลัยราชภัฏยะลา</p>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase">
                    Yala Rajabhat University Student Council
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

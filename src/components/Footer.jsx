import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function Footer() {
  const navigate = useNavigate();
  // Hidden admin access: triple-click on copyright text
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);
  const handleCopyrightClick = () => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      navigate('/admin');
      return;
    }
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 600);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6 col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 flex items-center justify-center">
                <img
                  src="/images/logo/sclogo.png"
                  alt="Logo"
                  className="h-10 md:h-12 w-auto drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white uppercase tracking-tight">Student Council</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Yala Rajabhat University</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 font-medium">
              องค์กรหลักเพื่อพิทักษ์สิทธิและดูแลผลประโยชน์ของนักศึกษา มหาวิทยาลัยราชภัฏยะลา สู่การพัฒนาตามระบอบประชาธิปไตย
            </p>
            <div className="flex space-x-4">
              {[
                {
                  Icon: Facebook,
                  url: "https://www.facebook.com/profile.php?id=61586876716834",
                  bgClass: "bg-[#1877F2] text-white hover:bg-blue-600"
                },
                {
                  Icon: Instagram,
                  url: "https://www.instagram.com/smo_phas_yru_official?",
                  bgClass: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90"
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 shadow-md ${item.bgClass}`}
                >
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em] opacity-50">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'เกี่ยวกับสโม', path: '/about' },
                { name: 'ชุดบริหาร', path: '/team' },
                { name: 'ฝ่ายงาน', path: '/departments' },
                { name: 'แผนผังมรย', path: '/map' }
              ].map((item) => (

                <li key={item.path}>
                  <Link to={item.path} className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <span className="w-0 group-hover:w-4 h-0.5 bg-yru-pink mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em] opacity-50">Resources</h3>
            <ul className="space-y-4">
              {[
                { name: 'แจ้งเรื่องร้องทุกข์', path: '/contact' },
                { name: 'จองห้องประชุม (ออนไลน์)', url: 'https://yrucouncilroombooking.vercel.app/' },
                { name: 'สมัครอนุกรรมการ', url: 'https://docs.google.com/forms/d/e/1FAIpQLSd7x85NPLRd7uNtip3hGrQl8G4zhFdtRUybGbExXunEmlxDKw/viewform' }
              ].map((item, i) => (
                <li key={i}>
                  {item.path ? (
                    <Link to={item.path} className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                      <span className="w-0 group-hover:w-4 h-0.5 bg-yru-pink mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group">
                      <span className="w-0 group-hover:w-4 h-0.5 bg-yru-pink mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group"><span className="w-0 group-hover:w-4 h-0.5 bg-yru-pink mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>ดาวน์โหลดเอกสาร</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em] opacity-50">Contact Us</h3>
            <div className="space-y-6 text-sm">
              {[
                { icon: MapPin, text: 'ตึกคณะสาธารณสุขศาสตร์และสหเวชศาสตร์ อาคารจามจุรี ชั้น 1 มหาวิทยาลัยราชภัฏยะลา' },
                { icon: Phone, text: '073-299-699' },
                { icon: Mail, text: 'smo-phas-official@yru.ac.th' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-yru-pink" />
                  </div>
                  <span className="leading-relaxed font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-700" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Designed &amp; Developed by</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-700" />
          </div>

          <div className="flex flex-col items-center gap-1 group cursor-default">
            <div className="flex items-center gap-2">
              <p
                onClick={handleCopyrightClick}
                className="text-sm font-black tracking-wide cursor-default select-none"
                style={{
                  background: 'linear-gradient(90deg, #ffffff 0%, #f8c8da 50%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >นาย มะอานูวา ดามูซอ</p>
            </div>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase text-center">
              สาขา วิทยาการคอมพิวเตอร์และเทคโนโลยีดิจิทัล &nbsp;·&nbsp; คณะวิทยาศาสตร์และเทคโนโลยีการเกษตร
            </p>
            <p className="text-[9px] text-slate-700 font-bold tracking-[0.2em] uppercase">
              Yala Rajabhat University
            </p>
          </div>

          {/* Bottom legal bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-slate-600 text-[9px] font-black uppercase tracking-widest pt-6 border-t border-slate-800/50 gap-3">
            {/* Triple-click this text to open Admin Panel */}
            <p className="cursor-default select-none">
              © {new Date().getFullYear()} SMO PHAS YRU. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

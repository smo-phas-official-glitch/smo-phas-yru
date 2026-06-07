import DeptCard from '../components/DeptCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Users2, AlertCircle, X, ExternalLink } from 'lucide-react';
import CustomLoader from '../components/Loader';
import { useState, useEffect } from 'react';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

export default function Departments() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=public&table=ฝ่ายงาน`);
        const json = await res.json();
        if (json.success) {
          setDepartments(json.data || []);
        }
      } catch (e) {
        console.error('Error fetching departments', e);
      } finally {
        setLoading(false);
      }
    };
    if (GAS_URL) fetchDepartments();
    else setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><CustomLoader fullScreen={false} /></div>;
  }

  return (
    <div className="pt-0 pb-24 min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/50">
            {/* Premium Hero Header - Blueprint Style */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white mb-20">
        <div className="absolute inset-0 z-0">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.05]" 
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-yru-pink/10 -skew-x-12 translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 border border-white/20 mb-10"
              >
                <Users2 size={18} className="text-yru-pink" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Departments & Functions</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
              >
                กรรมาธิการ<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">
                  ๑๐ ฝ่ายงาน
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg text-slate-400 font-bold leading-relaxed text-base"
              >
                " ขับเคลื่อนงานด้วยความเป็นมืออาชีพ แบ่งปันภาระหน้าที่ 
                เพื่อสร้างสรรค์กิจกรรมที่มีคุณค่าให้แก่นักศึกษา มรย. ทุกคน "
              </motion.p>
            </motion.div>

            {/* Visual Decoration to balance the side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="hidden lg:flex justify-end select-none pointer-events-none"
            >
              <Users2 size={400} strokeWidth={0.5} className="text-white" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-20 mb-32">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
            >
              <DeptCard dept={dept} />
            </motion.div>
          ))}
        </div>

        {/* CTA Banner - Redesigned to be Sharp and Bold */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 bg-slate-900 text-white rounded-none shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <div className="text-[10vw] font-black italic">JOIN US</div>
          </div>

          <div className="max-w-xl text-center md:text-left relative z-10">
            <div className="w-16 h-1 bg-yru-pink mb-8" />
            <h2 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight">
              ร่วมเป็นส่วนหนึ่ง <br />
              ขับเคลื่อนสภาฯ ไปด้วยกัน
            </h2>
            <p className="text-slate-400 font-bold italic text-lg max-w-lg leading-relaxed">
              เรากำลังมองหาอาสาสมัครที่มีใจรักในกิจกรรม และความสามารถที่หลากหลายเพื่อมาร่วมงานกับฝ่ายต่างๆ
              มาร่วมสร้างความทรงจำที่ดีไปด้วยกันที่นี่
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <button 
              onClick={() => setShowFormModal(true)}
              className="px-14 py-6 bg-yru-pink text-white font-black rounded-none hover:bg-white hover:text-yru-pink transition-all shadow-[0_20px_50px_rgba(255,46,121,0.3)] whitespace-nowrap text-lg uppercase tracking-widest active:scale-95"
            >
              สมัครเป็นอาสาสมัคร
            </button>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Open for All Faculties</p>
          </div>
        </motion.div>
      </div>

      {/* ─── MODAL แจ้งเตือนการเข้าสู่ระบบ (LOGIN ALERT MODAL) ─── */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg overflow-hidden shadow-2xl border-t-8 border-yru-pink"
            >
              <div className="p-8 md:p-12">
                <button 
                  onClick={() => setShowFormModal(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-yru-pink/10 flex items-center justify-center text-yru-pink">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase italic">
                      ยืนยันตัวตนก่อน<br/>
                      <span className="text-yru-pink">เข้าถึงแบบฟอร์ม</span>
                    </h3>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <p className="text-slate-600 font-bold leading-relaxed">
                    เนื่องจากระบบรับสมัครจำกัดสิทธิ์เฉพาะนักศึกษามหาวิทยาลัยราชภัฏยะลาเท่านั้น โปรดตรวจสอบการเข้าสู่ระบบดังนี้:
                  </p>
                  
                  <div className="bg-slate-50 p-6 border-l-4 border-slate-200 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                      <p className="text-sm font-bold text-slate-700">ตรวจสอบว่าบราวเซอร์ของท่านได้ลงชื่อเข้าใช้ด้วย <span className="text-yru-pink">Gmail มหาวิทยาลัย (@yru.ac.th)</span></p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                      <p className="text-sm font-bold text-slate-700">หากใช้บัญชีส่วนตัวท่านจะไม่สามารถเข้าถึงหน้าแบบฟอร์มได้</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd7x85NPLRd7uNtip3hGrQl8G4zhFdtRUybGbExXunEmlxDKw/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowFormModal(false)}
                    className="flex-1 bg-yru-pink text-white text-center py-4 font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors flex items-center justify-center gap-3"
                  >
                    เข้าสู่หน้าแบบฟอร์ม
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={() => setShowFormModal(false)}
                    className="flex-1 bg-slate-100 text-slate-500 py-4 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>

              {/* Decorative background text */}
              <div className="absolute -bottom-4 -right-4 text-[4rem] font-black text-slate-50 select-none pointer-events-none uppercase italic">
                YRU
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomLoader from './Loader';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

export default function CandidateSection() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=public&table=ชุดบริหาร`);
        const json = await res.json();
        if (json.success && json.data) {
          // แสดงสมาชิกทุกคนที่มีอยู่ในชีตชุดบริหาร
          setCandidates(json.data);
        }
      } catch (e) {
        console.error('Error fetching candidates', e);
      } finally {
        setLoading(false);
      }
    };
    if (GAS_URL) fetchCandidates();
    else setLoading(false);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % candidates.length);
  const prev = () => setIndex((prev) => (prev - 1 + candidates.length) % candidates.length);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (candidates.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % candidates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [candidates.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[100vh] min-h-[850px] overflow-hidden bg-white flex items-center justify-center">
        <CustomLoader fullScreen={true} />
      </section>
    );
  }

  if (candidates.length === 0) {
    return (
      <section className="relative w-full h-[100vh] min-h-[850px] overflow-hidden bg-yru-pink flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-4xl md:text-6xl font-black drop-shadow-xl mb-4">ไม่มีข้อมูล</h2>
          <p className="text-xl md:text-2xl font-bold opacity-80">กรุณาเพิ่มข้อมูลใน Google Sheets</p>
        </div>
      </section>
    );
  }

  // Determine which candidates are in which "layer/position" based on current index
  const centerItem = candidates[index];
  const leftItem = candidates[(index - 1 + candidates.length) % candidates.length];
  const rightItem = candidates[(index + 1) % candidates.length];

  return (
    <section className="relative w-full h-[100vh] min-h-[850px] overflow-hidden bg-yru-pink flex items-end justify-center pt-20">

      {/* Background Large Text */}
      <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center select-none pointer-events-none z-0">
        <h2 className="text-[20vw] font-black text-white/5 uppercase leading-none text-center">
          SMO PHAS
        </h2>
        <h3 className="text-[12vw] font-black text-white/[0.02] uppercase leading-none mt-[-4vw]">
          SMO PHAS
        </h3>
      </div>

      <div className="container mx-auto h-full flex flex-col items-center justify-end relative z-10 px-4 overflow-hidden">

        {/* Top Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 text-center w-full z-0 pointer-events-none"
        >
          <p className="text-white text-sm md:text-xl font-black uppercase tracking-[0.5em] mb-2 opacity-80">คณะกรรมการบริหารชุดทำงาน</p>
          <h1 className="text-white/10 text-5xl md:text-8xl font-black drop-shadow-xl">สโมสรนักศึกษาคณะสาธารณสุขศาสตร์และสหเวชศาสตร์</h1>
        </motion.div>

        {/* The Dynamic Trio Slider Layout */}
        <div className="relative w-full max-w-7xl h-[85%] flex items-end justify-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={index} // Re-animate entire trio on index change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full h-full flex items-end justify-center"
            >
              {/* Left Candidate (Background) */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.6, x: -110, scale: 1.1, y: 40 }}
                className="absolute left-1/2 -translate-x-full h-[90%] w-[50%] z-10 hidden md:block pointer-events-none"
              >
                <img
                  src={leftItem.image}
                  alt={leftItem.name}
                  className="h-full w-full object-contain filter grayscale brightness-75 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                />
              </motion.div>

              {/* Right Candidate (Background) */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 0.6, x: 110, scale: 1.1, y: 40 }}
                className="absolute right-1/2 translate-x-full h-[90%] w-[50%] z-10 hidden md:block pointer-events-none"
              >
                <img
                  src={rightItem.image}
                  alt={rightItem.name}
                  className="h-full w-full object-contain filter grayscale brightness-75 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-x-[-1]"
                />
              </motion.div>

              {/* Center Candidate (Foreground) */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0, scale: 1.3 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
                className="relative z-20 h-full w-full max-w-lg flex flex-col items-center"
              >
                <div className="relative h-full w-full flex flex-col items-center group">
                  <img
                    src={centerItem.image}
                    alt={centerItem.name}
                    className="h-[105%] w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.5)] scale-110"
                  />

                  {/* Name and Action for the Center Candidate */}
                  <div className="absolute bottom-[20%] w-[120%] text-center space-y-4 px-4 pointer-events-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-white text-xl md:text-3xl font-black mb-2 drop-shadow-xl opacity-90">{centerItem.title}</p>
                      <h2 className="text-4xl md:text-7xl text-white font-black drop-shadow-2xl mb-8 leading-tight">
                        {centerItem.name}
                      </h2>
                      <Link
                        to={`/team/${centerItem.id}`}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-yru-pink rounded-none hover:bg-black hover:text-white transition-all font-black uppercase text-sm shadow-2xl"
                      >
                        ทำความรู้จักเพิ่มเติม <ExternalLink size={20} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Real Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between z-50 px-4 md:px-12 pointer-events-none">
          <button
            onClick={prev}
            className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-white/50 hover:text-white hover:scale-110 transition-all pointer-events-auto active:scale-95"
          >
            <ChevronLeft size={80} strokeWidth={1} />
          </button>
          <button
            onClick={next}
            className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-white/50 hover:text-white hover:scale-110 transition-all pointer-events-auto active:scale-95"
          >
            <ChevronRight size={80} strokeWidth={1} />
          </button>
        </div>

      </div>

      {/* Hero Fade at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

    </section>
  );
}

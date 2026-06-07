import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, UserPlus, ChevronUp, X, LayoutGrid } from 'lucide-react';

const services = [
  {
    name: 'จองห้องประชุม',
    icon: Calendar,
    url: '',
    color: 'bg-blue-500',
    external: true
  },
  {
    name: 'สมัครอนุกรรมการ',
    icon: UserPlus,
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSf4PugLSle5aMYwZihV5cxP7HPsbXwGpkx1iZhdOWr4RNYIXQ/viewform',
    color: 'bg-yru-pink',
    external: true
  },
];

export default function QuickServices() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-2 mb-2">
            {services.map((service, index) => (
              <motion.a
                key={service.name}
                href={service.url}
                target={service.external ? "_blank" : undefined}
                rel={service.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                className="flex items-center gap-0 group"
                onClick={() => !service.external && setIsOpen(false)}
              >
                <div className={`${service.color} w-14 h-14 border-2 border-slate-900 flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer`}>
                  <service.icon size={20} />
                </div>
                <span className="bg-slate-900 text-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border-l border-white/10">
                  {service.name}
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`min-w-[64px] h-16 border-2 border-slate-900 flex items-center justify-center transition-all duration-300 relative overflow-hidden group shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${isOpen ? 'bg-slate-900 text-white' : 'bg-white text-yru-pink hover:bg-slate-50'
          } ${isScrolling && !isOpen ? 'px-5 gap-2' : 'px-0'}`}
      >
        <div className="absolute inset-0 bg-yru-pink/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} className="shrink-0" /> : (
          <>
            <LayoutGrid size={28} className="shrink-0" />
            <AnimatePresence>
              {isScrolling && !isOpen && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="font-black text-sm tracking-widest whitespace-nowrap overflow-hidden"
                >
                  เมนู
                </motion.span>
              )}
            </AnimatePresence>
          </>
        )}
      </button>
    </div>
  );
}

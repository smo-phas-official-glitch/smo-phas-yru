import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Megaphone, Package, MapPin, Search, 
  Heart, Cpu, Users, Star, Gift, ChevronRight 
} from 'lucide-react';

const iconMap = {
  1: ShieldAlert,  // พิทักษ์สิทธิ
  2: Megaphone,    // สื่อ
  3: Package,      // พัสดุ
  4: MapPin,       // อาคารสถานที่
  5: Search,       // ตรวจสอบ
  6: Heart,        // บำเพ็ญประโยชน์
  7: Cpu,          // เทคโนโลยี
  8: Users,        // ประสานงาน
  9: Star,         // กิจกรรม
  10: Gift         // สวัสดิการ
};

export default function DeptCard({ dept }) {
  const Icon = iconMap[dept.id] || ShieldAlert;

  return (
    <Link to={`/departments/${dept.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -12 }}
        className="bg-white p-0 rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col h-full group transition-all duration-500 overflow-hidden cursor-pointer"
      >
        {/* Aesthetic Top Section */}
        <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
          {/* Background Image (ถ้ามี) */}
          {dept.bgImage && (
            <>
               <div 
                 className="absolute inset-0 bg-cover bg-center transition-transform duration-700 pointer-events-none group-hover:scale-105"
                 style={{ backgroundImage: `url(${dept.bgImage})` }}
               />
               <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors duration-700 pointer-events-none" />
            </>
          )}
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-yru-pink)_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>
          
          {/* Large Decorative Icon (เฉพาะถ้าไม่มี BG Image) */}
          {!dept.bgImage && (
            <div className="absolute -right-6 -bottom-6 opacity-5 text-white group-hover:scale-125 transition-transform duration-1000">
                <Icon size={180} />
            </div>
          )}

          <motion.div 
              whileHover={{ rotate: 15 }}
              className="relative z-10 w-20 h-20 bg-white shadow-2xl rounded-none flex items-center justify-center text-slate-900 group-hover:bg-yru-pink group-hover:text-white transition-all duration-500"
          >
              <Icon size={40} className="group-hover:scale-110 transition-transform" />
          </motion.div>
        </div>

        <div className="p-12 flex flex-col flex-1 relative">
          {/* Department Number */}
          <div className="absolute top-0 left-12 -translate-y-1/2 flex items-center">
              <div className="bg-slate-900 text-white px-6 py-2 font-black italic text-xs tracking-[0.3em] uppercase shadow-2xl">
                  SEC - 0{dept.id}
              </div>
              <div className="w-8 h-[2px] bg-yru-pink" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 mb-8 italic leading-[1.2] group-hover:text-yru-pink transition-colors tracking-tight">
              {dept.name}
          </h3>
          
          <div className="space-y-8 mb-10 flex-1">
              <div className="relative pl-6 border-l-2 border-slate-200 group-hover:border-yru-pink transition-colors py-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Head of Commission</span>
                  <p className="font-black text-slate-800 text-xl tracking-tight">{dept.chair}</p>
              </div>
              
              <p className="text-slate-500 font-bold text-base leading-relaxed italic opacity-80">
                  "{dept.description}"
              </p>
          </div>

          <div className="pt-8 border-t border-slate-100 mt-auto flex items-center justify-between group/link">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-slate-900 transition-colors">
                  Explore Office
              </span>
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover/link:bg-slate-900 group-hover/link:border-slate-900 transition-all">
                  <ChevronRight size={20} className="text-slate-400 group-hover/link:text-white group-hover/link:translate-x-1 transition-all" />
              </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

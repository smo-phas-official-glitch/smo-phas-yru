import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Megaphone, Package, MapPin, Search, 
  Heart, Cpu, Users, Star, Gift, ArrowLeft, Target, 
  CheckCircle2, Users2, Info, Loader 
} from 'lucide-react';
import { useState, useEffect } from 'react';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

const iconMap = {
  1: ShieldAlert,
  2: Megaphone,
  3: Package,
  4: MapPin,
  5: Search,
  6: Heart,
  7: Cpu,
  8: Users,
  9: Star,
  10: Gift
};

export default function DeptDetail() {
  const { id } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛡️ ป้องกัน URL parameter ที่ไม่ใช่ตัวเลข
  const numericId = /^\d+$/.test(id) ? parseInt(id, 10) : id;

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=public&table=ฝ่ายงาน`);
        const json = await res.json();
        if (json.success && json.data) {
          const found = json.data.find(d => String(d.id) === String(numericId));
          // Parse string arrays to actual arrays safely
          if (found) {
            if (found.duties) {
               try { found.duties = typeof found.duties === 'string' && found.duties.startsWith('[') ? JSON.parse(found.duties) : found.duties.split('\n'); } 
               catch (e) { found.duties = [found.duties]; }
            } else { found.duties = []; }

            if (found.members) {
               if (typeof found.members === 'string') {
                 if (found.members.startsWith('[')) {
                   try { found.members = JSON.parse(found.members); } catch (e) { found.members = []; }
                 } else {
                   found.members = found.members.split('\n').filter(Boolean).map(line => {
                     const parts = line.split(':');
                     if (parts.length >= 2) return { role: parts[0].trim(), name: parts.slice(1).join(':').trim() };
                     return { role: 'สมาชิก', name: line.trim() };
                   });
                 }
               } else if (!Array.isArray(found.members)) {
                 found.members = [];
               }
            } else { found.members = []; }
          }
          setDept(found || null);
        }
      } catch (e) {
        console.error('Error fetching department', e);
      } finally {
        setLoading(false);
      }
    };
    if (GAS_URL) fetchDept();
    else setLoading(false);
  }, [numericId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-yru-pink" size={48} /></div>;
  }

  if (!dept) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">ไม่พบข้อมูลฝ่าย</h2>
        <p className="text-slate-500 font-bold mb-8">ฝ่ายที่คุณค้นหาไม่มีอยู่ในระบบ</p>
        <Link to="/departments" className="inline-flex items-center gap-2 text-yru-pink hover:underline font-black uppercase tracking-widest text-sm">
          <ArrowLeft size={16} /> กลับไปยังหน้าฝ่ายต่างๆ
        </Link>
      </div>
    );
  }

  const Icon = iconMap[dept.id] || ShieldAlert;


  return (
    <div className="pt-32 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/departments" className="inline-flex items-center gap-2 text-slate-400 hover:text-yru-pink font-black uppercase tracking-widest text-xs mb-12 group transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Departments
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-slate-900 text-white px-6 py-2 font-black text-xs tracking-[0.3em] uppercase">
                SECTION - 0{dept.id}
              </div>
              <div className="w-12 h-[2px] bg-yru-pink" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {dept.name}
            </h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed border-l-4 border-yru-pink pl-8 mb-10">
              "{dept.description}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
             <div className="absolute inset-0 bg-yru-pink translate-x-6 translate-y-6 z-0"></div>
             <div className="relative z-10 h-[450px] overflow-hidden border border-slate-200 shadow-2xl">
                <img 
                  src={dept.bgImage} 
                  alt={dept.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-slate-900/20" />
                <div className="absolute bottom-0 left-0 p-10 bg-white/90 backdrop-blur-md border-t border-r border-slate-200">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center">
                            <Icon size={32} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Head Official</span>
                            <p className="text-xl font-black text-slate-900">{dept.chair}</p>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Vision & Strategy */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white p-12 border border-slate-100 shadow-2xl relative overflow-hidden group"
           >
              <Target className="absolute -top-6 -right-6 text-slate-50 w-32 h-32 group-hover:text-yru-pink/5 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-1 bg-slate-900 mb-8" />
                <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900"><Info size={16} /></span>
                  วิสัยทัศน์ฝ่าย
                </h3>
                <p className="text-slate-600 font-bold text-lg leading-relaxed">
                  {dept.vision}
                </p>
              </div>
           </motion.div>

           {/* Core Duties */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="lg:col-span-2 bg-slate-900 p-12 text-white shadow-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                  <CheckCircle2 size={150} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-1 bg-yru-pink mb-8" />
                <h3 className="text-2xl font-black mb-10 uppercase tracking-tight flex items-center gap-4">
                  หน้าที่และความรับผิดชอบ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {dept.duties.map((duty, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border border-yru-pink flex items-center justify-center group-hover:bg-yru-pink transition-colors">
                        <div className="w-1.5 h-1.5 bg-yru-pink group-hover:bg-white rounded-full" />
                      </div>
                      <p className="text-slate-400 font-medium group-hover:text-white transition-colors leading-relaxed">
                        {duty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
           </motion.div>

           {/* Team Structure */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-3 bg-white p-12 border border-slate-100 shadow-2xl"
           >
              <div className="w-12 h-1 bg-slate-900 mb-8" />
              <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight flex items-center gap-4">
                บุคลากรประจำฝ่าย
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {dept.members.map((member, i) => (
                   <div key={i} className="bg-slate-50 p-8 border-l-4 border-yru-pink hover:bg-slate-100 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-slate-400 group-hover:text-yru-pink transition-colors">
                        <Users2 size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                        {member.role}
                      </span>
                      <p className="text-lg font-black text-slate-900 tracking-tight">
                        {member.name}
                      </p>
                   </div>
                 ))}

              </div>
           </motion.div>

        </div>
      </div>
    </div>
  );
}

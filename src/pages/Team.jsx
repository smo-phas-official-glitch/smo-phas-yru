/**
 * Team.jsx
 * หน้าทำเนียบชุดบริหาร (Team Page)
 * แสดงข้อมูลประธานสภา, รองประธาน, คณะกรรมการบริหาร และสมาชิกสภาทั้งหมด
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MemberCard from '../components/MemberCard';
import { Shield, Users2, Star, Zap } from 'lucide-react';
import CustomLoader from '../components/Loader';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

export default function Team() {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=public&table=ชุดบริหาร`);
        const json = await res.json();
        if (json.success) {
          setTeamData(json.data || []);
        }
      } catch (e) {
        console.error('Error fetching team data', e);
      } finally {
        setLoading(false);
      }
    };
    if (GAS_URL) fetchTeam();
    else setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><CustomLoader fullScreen={false} /></div>;
  }

  // Fallback structure if data is empty or format doesn't match perfectly
  const executives = teamData.filter(m => m.type === 'executive' || !m.type).slice(0, 10);
  const members = teamData.filter(m => m.type === 'member');

  // จัดกลุ่มสมาชิกตามตำแหน่ง
  const president = executives[0] || null;
  const vicePresidents = executives.slice(1, 3);
  const otherExecutives = executives.slice(3);

  return (
    <div className="pt-0 pb-48 min-h-screen font-kanit bg-gradient-to-br from-pink-100/50 via-white to-slate-200/40 bg-fixed">
            
      {/* ─── ส่วนหัว (HERO SECTION): สไตล์พิมพ์เขียว (Blueprint Style) ─── */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          {/* ลายตารางกริด (Grid Pattern) พื้นหลัง */}
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
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 border border-white/20 mb-10 shadow-xl"
              >
                <Shield size={18} className="text-yru-pink" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Team</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
              >
                โครงสร้าง<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">
                  ชุดบริหาร
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg text-slate-400 font-bold leading-relaxed text-base italic"
              >
                " มุ่งมั่น รับใช้ โปร่งใส พัฒนา "
              </motion.p>
            </motion.div>

            {/* กราฟิกประดับฝั่งขวา */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-100px] relative z-20">
        
        {/* ─── ชั้นที่ 1: ประธาน (President) ─── */}
        <section className="mb-40">
            <div className="flex flex-col items-center mb-16">
                <div className="bg-slate-900 border-l-8 border-yru-pink px-8 py-4 shadow-2xl skew-x-[-12deg] mb-12">
                    <h2 className="text-2xl font-black text-white skew-x-[12deg] uppercase flex items-center gap-4">
                        <Star className="text-yru-pink fill-yru-pink" size={24} />
                        ประธานสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์
                    </h2>
                </div>

                {/* เลย์เอาต์ 3 คอลัมน์: สถิติ (ซ้าย) | บัตรสมาชิก (กลาง) | ข้อมูลเพิ่มเติม (ขวา) */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_420px_1fr] gap-8 items-center">

                    {/* ฝั่งซ้าย — สถิติตัวเลขตกแต่ง */}
                    <div className="hidden lg:flex flex-col items-end gap-6 pr-4">
                        {[
                          { num: '10', label: 'ฝ่ายงาน', sub: 'Departments' },
                          { num: executives.length + members.length, label: 'สมาชิกสภา', sub: 'Council Members' },
                          { num: '2569', label: 'ปีการศึกษา', sub: 'Academic Year' },
                        ].map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.15 }}
                            className="text-right border-r-4 border-yru-pink pr-6 group"
                          >
                            <p className="text-4xl font-black text-slate-900 leading-none group-hover:text-yru-pink transition-colors">{s.num}</p>
                            <p className="text-sm font-black text-slate-700 mt-1">{s.label}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.sub}</p>
                          </motion.div>
                        ))}
                        <div className="w-full h-px bg-gradient-to-l from-slate-200 to-transparent mt-4" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-right">YRU Student Council 2026</p>
                    </div>

                    {/* ตรงกลาง — บัตรแสดงข้อมูลประธาน */}
                    <div className="w-full transform hover:scale-[1.02] transition-transform duration-500">
                        {president ? <MemberCard member={president} /> : <div className="text-center p-8 bg-slate-100 rounded-xl">ไม่มีข้อมูล</div>}
                    </div>

                    {/* ฝั่งขวา — วิสัยทัศน์และข้อมูลหน่วยงาน */}
                    <div className="hidden lg:flex flex-col items-start gap-6 pl-4">
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="border-l-4 border-slate-200 pl-6"
                        >
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">วิสัยทัศน์</p>
                          <p className="text-lg font-black text-slate-700 leading-relaxed">
                            "มุ่งมั่น รับใช้<br/>โปร่งใส พัฒนา"
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 }}
                          className="bg-slate-900 p-6 w-full"
                        >
                          <p className="text-[9px] font-black text-yru-pink uppercase tracking-[0.3em] mb-2">Organization</p>
                          <p className="text-sm font-black text-white leading-relaxed">สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">มหาวิทยาลัยราชภัฏยะลา</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-col gap-2 w-full"
                        >
                          {['ตรวจสอบการทำงาน', 'รับฟังความคิดเห็น', 'พัฒนาคุณภาพชีวิต'].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                              <div className="w-1.5 h-1.5 bg-yru-pink rounded-full flex-shrink-0" />
                              <p className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{t}</p>
                            </div>
                          ))}
                        </motion.div>
                        <div className="w-full h-px bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>

                </div>
            </div>
        </section>

        {/* เส้นแบ่งเลเยอร์ */}
        <div className="relative h-24 flex justify-center mb-24">
            <div className="w-1 h-full bg-gradient-to-b from-slate-200 to-transparent" />
            <div className="absolute bottom-0 w-3 h-3 bg-yru-pink rotate-45" />
        </div>

        {/* ─── ชั้นที่ 2: รองประธาน (Vice Presidents) ─── */}
        <section className="mb-40">
            <div className="flex flex-col items-center mb-20 text-center">
                <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Executive Leadership</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">รองประธานสภา</h2>
                <div className="h-2 w-20 bg-slate-900 mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
                {vicePresidents.map((vp) => (
                    <MemberCard key={vp.id} member={vp} />
                ))}
            </div>
        </section>

        {/* ─── ชั้นที่ 3: คณะกรรมการบริหาร (Other Executives) ─── */}
        <section className="mb-48">
            <div className="flex items-center gap-8 mb-24">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="text-center">
                    <span className="text-[10px] font-black text-yru-pink uppercase tracking-[0.4em] mb-3 block">Foundational Team</span>
                    <h2 className="text-5xl font-black text-slate-800 uppercase tracking-tighter">คณะกรรมการบริหาร</h2>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="flex flex-wrap justify-center gap-12">
                {otherExecutives.map((exec) => (
                    <div key={exec.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)]">
                        <MemberCard member={exec} />
                    </div>
                ))}
            </div>
        </section>

        {/* ─── ส่วนของสมาชิกสภาทั้งหมด (General Council Members) ─── */}
        <section className="pt-32 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Zap className="text-yru-pink fill-yru-pink" size={20} />
                 <span className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">The General Assembly</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
                สมาชิกสภา<br/>
                <span className="text-slate-300 font-medium">{members.length} ท่าน</span>
              </h2>
            </div>
            <div className="bg-slate-50 p-6 border-2 border-slate-100 font-bold text-slate-500 max-w-xs text-right">
                " พลังของคนรุ่นใหม่ ร่วมแรงร่วมใจเพื่อความเปลี่ยนแปลงที่ดีขึ้น "
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {members.map((member) => (
                <div key={member.id} className="w-full sm:w-[calc(50%-1.25rem)] md:w-[calc(33.333%-1.666rem)] lg:w-[calc(25%-1.875rem)]">
                    <MemberCard member={member} />
                </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

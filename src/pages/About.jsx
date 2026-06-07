/**
 * About.jsx
 * หน้าเกี่ยวกับเรา (About Us)
 * แสดงประวัติ วิสัยทัศน์ โครงสร้าง และข้อมูลธรรมนูญนักศึกษา
 */

import { motion } from 'framer-motion';
import { Gavel, Target, BookOpen, Flag, Users, Shield, ArrowRight, Activity, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-0 pb-32 min-h-screen bg-gradient-to-br from-pink-100/50 via-white to-slate-200/40 bg-fixed">
            
      {/* ─── ส่วนหัว (HERO SECTION) ─── */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white mb-20">
            <div className="absolute inset-0 z-0">
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
                            <Gavel size={18} className="text-yru-pink" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establishment & Vision</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
                        >
                            เกี่ยวกับ<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">สโมสรนักศึกษาคณะสาธารณสุขและสหเวชศาสตร์</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-lg text-slate-400 font-bold leading-relaxed text-base"
                        >
                            " ศูนย์กลางในการพัฒนาศักยภาพ พิทักษ์สิทธิ และดูแลผลประโยชน์ของนักศึกษา 
                            เพื่อสร้างสรรค์สังคมแห่งการเรียนรู้ที่เท่าเทียมและยั่งยืน "
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="hidden lg:flex justify-end select-none pointer-events-none"
                    >
                        <Shield size={400} strokeWidth={0.5} className="text-white" />
                    </motion.div>
                </div>
            </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* ─── ประวัติความเป็นมา & วิสัยทัศน์ ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-14 shadow-xl border-t-4 border-slate-900 relative"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center">
              <BookOpen className="text-slate-300" size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">ประวัติความเป็นมา</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              สโมสรนักศึกษาคณะสาธารณสุขและสหเวชศาสตร์ มหาวิทยาลัยราชภัฏยะลา ก่อตั้งขึ้นเพื่อเป็นตัวแทนของนักศึกษาในการดำเนินกิจกรรมต่างๆ 
              ตลอดจนเป็นกระบอกเสียงในการพิทักษ์สิทธิและสวัสดิการของนักศึกษาในคณะฯ
            </p>
            <p className="text-slate-600 font-medium leading-relaxed">
              เรามุ่งมั่นที่จะพัฒนาศักยภาพของนักศึกษา ทั้งในด้านวิชาการ วิชาชีพ และทักษะการใช้ชีวิตในสังคม 
              เพื่อผลิตบัณฑิตที่มีคุณภาพและพร้อมรับใช้ชุมชนท้องถิ่น
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 p-10 md:p-14 shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Globe size={250} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <Flag className="text-yru-pink w-8 h-8" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">วิสัยทัศน์ (Vision)</h2>
              </div>
              <p className="text-xl font-bold text-yru-pink leading-relaxed mb-8 italic">
                "เป็นองค์กรนักศึกษาชั้นนำที่เข้มแข็ง เป็นกระบอกเสียงพิทักษ์สิทธิ และมุ่งสร้างสรรค์กิจกรรมเพื่อพัฒนาสุขภาวะของสังคม"
              </p>
              
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">พันธกิจหลัก (Mission)</h3>
                {[
                  { icon: Target, text: 'จัดกิจกรรมที่ส่งเสริมทักษะทางวิชาการและวิชาชีพ' },
                  { icon: Shield, text: 'เป็นกระบอกเสียงและรักษาสิทธิประโยชน์ให้นักศึกษา' },
                  { icon: Heart, text: 'สร้างความสามัคคีและเครือข่ายระหว่างรุ่นพี่-รุ่นน้อง' },
                  { icon: Activity, text: 'เป้าหมาย: สร้างสรรค์สังคมแห่งการเรียนรู้ ส่งต่อโอกาส พัฒนาศักยภาพในทุกก้าวของนักศึกษา' }
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
                      <m.icon size={16} className="text-white" />
                    </div>
                    <p className="font-medium text-slate-300">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── โครงสร้างการบริหารงาน ─── */}
        <section className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8 text-center"
          >
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">โครงสร้างการบริหารงาน</h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                สโมสรนักศึกษาบริหารงานโดยคณะกรรมการที่ได้รับการเลือกตั้ง 
                แบ่งการทำงานออกเป็นฝ่ายต่างๆ เพื่อให้ครอบคลุมทุกความต้องการของนักศึกษา
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              <Link to="/team" className="bg-slate-900 text-white p-10 group hover:bg-yru-pink transition-colors relative overflow-hidden">
                <Users className="w-10 h-10 mb-6 text-yru-pink group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-black uppercase mb-2">ชุดบริหาร</h3>
                <p className="text-sm text-slate-400 group-hover:text-white/80 font-bold uppercase tracking-widest">Executive Team</p>
                <ArrowRight className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all" />
              </Link>
              
              <Link to="/departments" className="bg-white border-2 border-slate-100 p-10 group hover:border-yru-pink transition-colors relative overflow-hidden shadow-sm hover:shadow-xl">
                <Activity className="w-10 h-10 mb-6 text-slate-400 group-hover:text-yru-pink transition-colors" />
                <h3 className="text-2xl font-black uppercase mb-2 text-slate-900">ฝ่ายงาน</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Departments</p>
                <ArrowRight className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all text-yru-pink" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ─── หลักการดำเนินงาน ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 md:p-14 border-t-8 border-slate-900 shadow-xl text-center"
        >
          <h3 className="text-3xl font-black text-slate-900 mb-10 italic tracking-tight uppercase">
              หลักการดำเนินงาน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'พิทักษ์สิทธิ', desc: 'คุ้มครองสิทธิพื้นฐานนักศึกษา' },
              { label: 'โปร่งใส', desc: 'ตรวจสอบได้ทุกขั้นตอน' },
              { label: 'มีส่วนร่วม', desc: 'ฟังเสียงนักศึกษาทุกคน' },
              { label: 'ก้าวหน้า', desc: 'พัฒนาทักษะและความคิด' },
            ].map((box, i) => (
              <div key={i} className="bg-slate-50 p-8 border-b-4 border-slate-200 hover:border-yru-pink hover:bg-slate-100 transition-colors duration-300 group">
                <p className="font-black text-slate-900 mb-2 italic text-2xl group-hover:text-yru-pink transition-colors">{box.label}</p>
                <p className="text-sm text-slate-500 font-bold group-hover:text-slate-700 transition-colors">{box.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

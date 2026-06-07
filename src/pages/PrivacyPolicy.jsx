/**
 * PrivacyPolicy.jsx
 * หน้านโยบายความเป็นส่วนตัว (Privacy Policy)
 */

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Bell, Mail } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: 'ข้อมูลที่เราเก็บรวบรวม',
    items: [
      {
        subtitle: 'ข้อมูลที่ท่านให้โดยตรง',
        text: 'เมื่อท่านติดต่อหรือกรอกแบบฟอร์มบนเว็บไซต์ เราอาจเก็บข้อมูล เช่น ชื่อ-นามสกุล รหัสนักศึกษา อีเมล หมายเลขโทรศัพท์ และรายละเอียดที่ท่านระบุในคำร้องหรือข้อความ',
      },
      {
        subtitle: 'ข้อมูลการใช้งานเว็บไซต์',
        text: 'ระบบอาจบันทึกข้อมูลทางเทคนิคโดยอัตโนมัติ เช่น ที่อยู่ IP, ประเภทเบราว์เซอร์, หน้าที่เข้าชม และระยะเวลาการใช้งาน เพื่อวิเคราะห์และพัฒนาบริการให้ดียิ่งขึ้น',
      },
    ],
  },
  {
    icon: Database,
    title: 'วัตถุประสงค์การใช้ข้อมูล',
    items: [
      {
        subtitle: 'การให้บริการและการดำเนินงาน',
        text: 'เราใช้ข้อมูลของท่านเพื่อติดต่อกลับ รับเรื่องร้องทุกข์ ดำเนินการตามคำร้อง ประสานงานระหว่างนักศึกษากับมหาวิทยาลัย และเพื่อการสมัครเข้าร่วมกิจกรรมต่าง ๆ ของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์',
      },
      {
        subtitle: 'การปรับปรุงและพัฒนาบริการ',
        text: 'ข้อมูลสถิติการใช้งานจะถูกนำไปวิเคราะห์ในภาพรวม (ไม่ระบุตัวตน) เพื่อปรับปรุงเว็บไซต์และบริการให้ตอบสนองความต้องการของนักศึกษาได้มีประสิทธิภาพมากขึ้น',
      },
    ],
  },
  {
    icon: Lock,
    title: 'การเก็บรักษาและความปลอดภัย',
    items: [
      {
        subtitle: 'มาตรการรักษาความปลอดภัย',
        text: 'เราดำเนินการป้องกันข้อมูลส่วนบุคคลของท่านด้วยมาตรการที่เหมาะสม ทั้งทางเทคนิคและการบริหารจัดการ เพื่อป้องกันการเข้าถึง การเปิดเผย หรือการแก้ไขข้อมูลโดยไม่ได้รับอนุญาต',
      },
      {
        subtitle: 'ระยะเวลาการเก็บข้อมูล',
        text: 'ข้อมูลของท่านจะถูกเก็บรักษาตลอดระยะเวลาที่จำเป็นต่อการให้บริการ หรือตามที่กฎหมายกำหนด โดยเมื่อหมดความจำเป็นแล้วจะทำการลบหรือทำให้ไม่สามารถระบุตัวตนได้',
      },
    ],
  },
  {
    icon: Bell,
    title: 'การเปิดเผยข้อมูลต่อบุคคลที่สาม',
    items: [
      {
        subtitle: 'หลักการไม่เปิดเผย',
        text: 'สโมสรนักศึกษาคณะสาธารณะสุขฯ มรย. จะไม่ขาย ให้เช่า หรือเปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลภายนอกเพื่อวัตถุประสงค์ทางการค้าโดยเด็ดขาด',
      },
      {
        subtitle: 'ข้อยกเว้น',
        text: 'เราอาจเปิดเผยข้อมูลแก่หน่วยงานภายในมหาวิทยาลัยที่เกี่ยวข้อง (เช่น กองพัฒนานักศึกษา) เมื่อจำเป็นต่อการดำเนินการตามคำร้อง หรือในกรณีที่กฎหมายกำหนด',
      },
    ],
  },
  {
    icon: Shield,
    title: 'สิทธิของเจ้าของข้อมูล',
    items: [
      {
        subtitle: 'สิทธิตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
        text: 'ท่านมีสิทธิ์เข้าถึง แก้ไข ลบ หรือโอนย้ายข้อมูลส่วนบุคคลของท่าน รวมถึงสิทธิ์คัดค้านหรือระงับการประมวลผลข้อมูล โดยสามารถติดต่อเราได้ผ่านช่องทางที่ระบุด้านล่าง',
      },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="pt-0 pb-32 min-h-screen bg-gradient-to-br from-pink-100/50 via-white to-slate-200/40 bg-fixed">
      
      {/* ─── Hero ─── */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white mb-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-yru-pink/10 -skew-x-12 translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 border border-white/20 mb-10"
              >
                <Shield size={18} className="text-yru-pink" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Privacy Policy</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
              >
                นโยบาย<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">
                  ความเป็นส่วนตัว
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg text-slate-400 font-bold leading-relaxed text-base"
              >
                " ความโปร่งใสในการจัดการข้อมูลส่วนบุคคล คือหัวใจของความไว้วางใจระหว่างสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์และนักศึกษาทุกคน "
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

      {/* ─── Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 text-white p-10 md:p-14 rounded-none shadow-2xl relative overflow-hidden mb-12 group"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-yru-pink)_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-yru-pink" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="bg-yru-pink p-5 rounded-none shadow-[0_10px_30px_rgba(255,46,121,0.4)] shrink-0">
              <Shield size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yru-pink mb-2">อัปเดตล่าสุด : มิถุนายน 2568</p>
              <p className="text-slate-300 text-lg leading-relaxed font-bold max-w-4xl">
                สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ มหาวิทยาลัยราชภัฏยะลา ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่านเป็นอย่างยิ่ง
                นโยบายฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลของท่านเมื่อท่านใช้งานเว็บไซต์
                และบริการต่าง ๆ ของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-slate-100 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yru-pink" />
              <div className="absolute top-2 right-2 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <section.icon size={100} />
              </div>

              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="bg-slate-900 p-4 rounded-none shadow-xl transform group-hover:-rotate-6 transition-transform duration-500">
                  <section.icon size={28} className="text-yru-pink" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="text-yru-pink mr-2">{String(idx + 1).padStart(2, '0')}.</span>
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6 relative z-10">
                {section.items.map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 border border-slate-100 hover:border-yru-pink hover:bg-white hover:shadow-lg transition-all duration-300 border-l-4 border-l-yru-pink">
                    <p className="font-black text-slate-800 mb-2 text-sm">{item.subtitle}</p>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-none shadow-xl border-l-8 border-yru-pink flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group"
        >
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
            <Mail size={200} />
          </div>
          <div className="bg-slate-50 p-6 rounded-none shadow-inner shrink-0">
            <Mail size={48} className="text-yru-pink" strokeWidth={2} />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight uppercase">ติดต่อเรา</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-bold max-w-3xl mb-4">
              หากท่านมีข้อสงสัยหรือต้องการใช้สิทธิ์ตามนโยบายนี้ สามารถติดต่อสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ได้ที่:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-black">
              <a href="mailto:studentcouncil@yru.ac.th" className="inline-flex items-center gap-2 px-6 py-3 bg-yru-pink text-white hover:bg-slate-900 transition-all duration-300 shadow-[0_10px_30px_rgba(255,46,121,0.2)] uppercase tracking-widest">
                <Mail size={16} />
                studentcouncil@yru.ac.th
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

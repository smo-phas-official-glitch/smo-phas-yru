/**
 * TermsOfService.jsx
 * หน้าข้อกำหนดการใช้งาน (Terms of Service)
 */

import { motion } from 'framer-motion';
import { FileText, Users, AlertTriangle, Scale, Globe, CheckCircle, Mail } from 'lucide-react';

const sections = [
  {
    icon: CheckCircle,
    title: 'การยอมรับข้อกำหนด',
    items: [
      {
        subtitle: 'ข้อตกลงการใช้งาน',
        text: 'การเข้าถึงหรือใช้งานเว็บไซต์ของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ มหาวิทยาลัยราชภัฏยะลา ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อกำหนดและเงื่อนไขการใช้งานฉบับนี้ทุกประการ หากท่านไม่ยอมรับ กรุณาหยุดใช้งานเว็บไซต์นี้',
      },
      {
        subtitle: 'การปรับปรุงข้อกำหนด',
        text: 'สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ขอสงวนสิทธิ์ในการปรับปรุงข้อกำหนดเหล่านี้ได้ทุกเวลาโดยไม่ต้องแจ้งล่วงหน้า การใช้งานต่อเนื่องภายหลังการปรับปรุงถือว่าท่านยอมรับข้อกำหนดที่เปลี่ยนแปลงแล้ว',
      },
    ],
  },
  {
    icon: Globe,
    title: 'วัตถุประสงค์ของเว็บไซต์',
    items: [
      {
        subtitle: 'ขอบเขตการให้บริการ',
        text: 'เว็บไซต์นี้จัดทำขึ้นเพื่อเผยแพร่ข้อมูลข่าวสาร กิจกรรม และบริการต่าง ๆ ของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ มหาวิทยาลัยราชภัฏยะลา รวมถึงเป็นช่องทางการติดต่อสื่อสารระหว่างนักศึกษาและสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์',
      },
      {
        subtitle: 'ผู้ใช้งานที่ได้รับอนุญาต',
        text: 'บริการนี้เปิดให้บุคคลทั่วไป นักศึกษา คณาจารย์ และบุคลากรของมหาวิทยาลัยราชภัฏยะลา รวมถึงผู้ที่มีความสนใจในกิจกรรมและภารกิจของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์',
      },
    ],
  },
  {
    icon: Users,
    title: 'พฤติกรรมที่ยอมรับได้ของผู้ใช้',
    items: [
      {
        subtitle: 'สิ่งที่ท่านสามารถทำได้',
        text: 'ท่านสามารถเข้าชมเว็บไซต์ ดาวน์โหลดข้อมูลสาธารณะ ติดต่อสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ผ่านแบบฟอร์ม กรอกคำร้องและแจ้งเรื่องร้องทุกข์อย่างสุจริต และแชร์ลิงก์เนื้อหาสาธารณะของเว็บไซต์',
      },
      {
        subtitle: 'สิ่งที่ท่านต้องไม่กระทำ',
        text: 'ท่านต้องไม่ใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมาย ไม่เผยแพร่ข้อมูลเท็จหรือหมิ่นประมาท ไม่พยายามเจาะระบบหรือขัดขวางการทำงานของเว็บไซต์ และไม่ละเมิดสิทธิ์ของบุคคลอื่น',
      },
    ],
  },
  {
    icon: FileText,
    title: 'ทรัพย์สินทางปัญญา',
    items: [
      {
        subtitle: 'ลิขสิทธิ์และสิทธิ์ในเนื้อหา',
        text: 'เนื้อหาทั้งหมดบนเว็บไซต์นี้ ไม่ว่าจะเป็นข้อความ รูปภาพ โลโก้ กราฟิก หรือสื่ออื่น ๆ เป็นทรัพย์สินของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ มหาวิทยาลัยราชภัฏยะลา และได้รับการคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา',
      },
      {
        subtitle: 'การใช้เนื้อหา',
        text: 'ท่านอาจอ้างอิงหรือแชร์เนื้อหาของเว็บไซต์ได้เพื่อวัตถุประสงค์ที่ไม่ใช่เชิงพาณิชย์ โดยต้องระบุแหล่งที่มาอย่างชัดเจน การนำเนื้อหาไปใช้เชิงพาณิชย์หรือดัดแปลงโดยไม่ได้รับอนุญาตถือเป็นการละเมิดลิขสิทธิ์',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'การปฏิเสธความรับผิดชอบ',
    items: [
      {
        subtitle: 'ความถูกต้องของข้อมูล',
        text: 'สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์พยายามอย่างเต็มที่เพื่อให้ข้อมูลบนเว็บไซต์ถูกต้องและเป็นปัจจุบัน อย่างไรก็ตาม ไม่รับประกันความสมบูรณ์ของข้อมูลทั้งหมด ผู้ใช้ควรตรวจสอบข้อมูลสำคัญจากแหล่งอ้างอิงอย่างเป็นทางการเสมอ',
      },
      {
        subtitle: 'ลิงก์ภายนอก',
        text: 'เว็บไซต์อาจมีลิงก์ไปยังเว็บไซต์ภายนอกที่สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ไม่ได้ควบคุม เราไม่รับผิดชอบต่อเนื้อหาหรือนโยบายของเว็บไซต์เหล่านั้น',
      },
    ],
  },
  {
    icon: Scale,
    title: 'กฎหมายที่ใช้บังคับ',
    items: [
      {
        subtitle: 'เขตอำนาจกฎหมาย',
        text: 'ข้อกำหนดการใช้งานนี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย รวมถึง พ.ร.บ. คอมพิวเตอร์ พ.ศ. 2550 และฉบับแก้ไข และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
      },
      {
        subtitle: 'การระงับข้อพิพาท',
        text: 'ข้อพิพาทที่เกิดขึ้นจากการใช้งานเว็บไซต์จะพยายามแก้ไขโดยการเจรจาก่อนเป็นอันดับแรก หากไม่สามารถตกลงกันได้จะดำเนินการตามขั้นตอนทางกฎหมายไทย',
      },
    ],
  },
];

export default function TermsOfService() {
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
                <Scale size={18} className="text-yru-pink" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Terms of Service</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
              >
                ข้อกำหนด<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">
                  การใช้งาน
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-lg text-slate-400 font-bold leading-relaxed text-base"
              >
                " กฎเกณฑ์และเงื่อนไขเหล่านี้มีขึ้นเพื่อให้การใช้งานเว็บไซต์เป็นไปอย่างยุติธรรมและปลอดภัยสำหรับทุกคน "
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="hidden lg:flex justify-end select-none pointer-events-none"
            >
              <Scale size={400} strokeWidth={0.5} className="text-white" />
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
              <Scale size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yru-pink mb-2">อัปเดตล่าสุด : มิถุนายน 2568</p>
              <p className="text-slate-300 text-lg leading-relaxed font-bold max-w-4xl">
                ข้อกำหนดการใช้งานฉบับนี้กำหนดกฎเกณฑ์และเงื่อนไขในการใช้งานเว็บไซต์ของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์
                มหาวิทยาลัยราชภัฏยะลา กรุณาอ่านอย่างละเอียดก่อนการใช้งาน
                เพื่อความเข้าใจถึงสิทธิและหน้าที่ของท่านในฐานะผู้ใช้บริการ
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

        {/* Contact + Related link */}
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
            <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight uppercase">ติดต่อและข้อมูลเพิ่มเติม</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-bold max-w-3xl mb-4">
              หากท่านมีคำถามเกี่ยวกับข้อกำหนดนี้ หรือต้องการรายงานการละเมิด กรุณาติดต่อ:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-black flex-wrap">
              <a href="mailto:studentcouncil@yru.ac.th" className="inline-flex items-center gap-2 px-6 py-3 bg-yru-pink text-white hover:bg-slate-900 transition-all duration-300 shadow-[0_10px_30px_rgba(255,46,121,0.2)] uppercase tracking-widest">
                <Mail size={16} />
                studentcouncil@yru.ac.th
              </a>
              <a href="/privacy-policy" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-widest">
                → อ่านนโยบายความเป็นส่วนตัว
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

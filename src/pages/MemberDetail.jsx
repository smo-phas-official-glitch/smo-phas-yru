import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, GraduationCap, Briefcase, Quote, Mail, Facebook, Instagram, Youtube, Play, ExternalLink, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { teamData } from '../data/teamData';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛡️ ตรวจสอบว่า id เป็นตัวเลขจริงภายในขอบเขตที่ถูกต้อง
  const numericId = /^\d+$/.test(id) ? parseInt(id, 10) : id;

  // กรอง social link URL
  const sanitizeSocialUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return null;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return null;
    return trimmed;
  };

  useEffect(() => {
    const found = teamData.find(m => String(m.id) === String(numericId));
    if (found) {
      // Create a shallow copy to prevent modifying read-only import
      const cloned = { ...found };
      try { if (typeof cloned.experience === 'string') cloned.experience = JSON.parse(cloned.experience); } catch (e) { cloned.experience = cloned.experience ? cloned.experience.split('\n') : []; }
      try { if (typeof cloned.educationBackground === 'string') cloned.educationBackground = JSON.parse(cloned.educationBackground); } catch (e) { cloned.educationBackground = cloned.educationBackground ? cloned.educationBackground.split('\n') : []; }
      try { if (typeof cloned.bioText === 'string') cloned.bioText = JSON.parse(cloned.bioText); } catch (e) { cloned.bioText = cloned.bioText ? cloned.bioText.split('\n') : null; }
      setMember(cloned);
    } else {
      setMember(null);
    }
    setLoading(false);
  }, [numericId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-yru-pink" size={48} /></div>;
  }

  if (!member) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">ไม่พบข้อมูลสมาชิก</h2>
        <p className="text-slate-500 font-bold mb-8">สมาชิกที่คุณค้นหาไม่มีอยู่ในระบบ</p>
        <Link to="/team" className="text-yru-pink hover:underline font-black inline-flex items-center gap-2">กลับไปยังหน้าทีม</Link>
      </div>
    );
  }

  // แปลง Google Drive Viewer URL เป็น Direct Image URL
  const getDirectImageUrl = (url) => {
    if (!url) return '/images/team/anwa.png';
    const match1 = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (match1 && match1[1]) return `https://drive.google.com/thumbnail?id=${match1[1]}&sz=w800`;
    
    const match2 = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
    if (match2 && match2[1]) return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w800`;
    
    return url;
  };

  const rawImage = member.image || member.Image;
  const imageUrl = getDirectImageUrl(
    rawImage && !rawImage.includes('placeholder') 
      ? rawImage 
      : '/images/team/anwa.png'
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header - PTP Style */}
      <section className="relative flex flex-col lg:flex-row bg-white lg:h-screen lg:overflow-hidden lg:min-h-[700px]">
        {/* Left Side: Photo */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[55%] h-[55vh] lg:h-full relative"
        >
          <img 
            src={imageUrl} 
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* Right Side: Pink Info Block */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full lg:w-[45%] min-h-[45vh] lg:min-h-full lg:h-full bg-yru-pink flex flex-col justify-center px-8 md:px-16 pt-32 pb-16 relative"
        >
          {/* Back Button */}
          <Link 
            to="/team" 
            className="absolute top-24 left-8 md:left-16 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold z-[20]"
          >
            <ArrowLeft size={20} />
            หน้าก่อนหน้า
          </Link>

          <div className="space-y-8 max-w-xl">
             <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white text-lg md:text-xl font-bold mb-2 opacity-90"
                >
                  {member.title}
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl md:text-6xl font-black text-white leading-tight mb-4"
                >
                  {member.name}
                </motion.h1>
                <div className="w-24 h-1 bg-white rounded-full opacity-30" />
             </div>

             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="pt-12"
             >
                <Quote size={32} className="text-white opacity-40 mb-4" />
                <p className="text-xl md:text-3xl font-black text-white leading-relaxed">
                  {member.motto || "ยกเครื่องสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์ เพื่อชาวราชภัฏยะลาทุกคน"}
                </p>

                {/* Social & Contact Icons */}
                {(sanitizeSocialUrl(member.facebook) || sanitizeSocialUrl(member.ig) || member.email) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-center gap-4 mt-10"
                  >
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title={member.email}
                      >
                        <Mail size={20} className="text-white" />
                      </a>
                    )}
                    {sanitizeSocialUrl(member.facebook) && (
                      <a
                        href={sanitizeSocialUrl(member.facebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
                        title="Facebook"
                      >
                        <img src="/images/socialicon/fb.png" alt="Facebook" className="w-10 h-10 object-contain" />
                      </a>
                    )}
                    {sanitizeSocialUrl(member.ig) && (
                      <a
                        href={sanitizeSocialUrl(member.ig)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
                        title="Instagram"
                      >
                        <img src="/images/socialicon/ig.png" alt="Instagram" className="w-10 h-10 object-contain" />
                      </a>
                    )}
                  </motion.div>
                )}
             </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Biography Section (เฉพาะคนที่มีข้อมูลนี้ เช่น ประธาน) */}
      {member.bioText && (
        <section className="py-32 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              {/* รูปภาพ */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-5/12"
              >
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                    <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative">
                       <img 
                         src={member.bioImage} 
                         alt={member.name} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                       />
                       
                       {/* Elegant Pink Wash Gradient */}
                       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-yru-pink/80 via-yru-pink/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-700" />
                       
                       {/* Corner Accents */}
                       <div className="absolute top-0 right-0 w-32 h-32 bg-yru-pink/5 blur-3xl" />
                    </div>
                 </div>
              </motion.div>
              
              {/* ข้อความ Biography */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-7/12 space-y-12 lg:pl-8"
              >
                {/* คำกล่าวหรือ Headline */}
                {member.bioQuote && (
                  <h2 className="text-4xl md:text-6xl font-black text-yru-pink leading-tight tracking-tight whitespace-pre-wrap">
                    "{member.bioQuote}"
                  </h2>
                )}
                
                {/* ย่อหน้าข้อมูล */}
                <div className="space-y-8 relative">
                  <div className="absolute -left-6 top-2 w-1.5 h-full bg-slate-100 rounded-full" />
                  {member.bioText.map((paragraph, idx) => (
                    <p key={idx} className="text-xl md:text-2xl text-slate-700 font-bold leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Main Details Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">

               {/* Education/Faculty Block */}
               <div className="bg-white p-10 rounded-none shadow-xl shadow-slate-200 border border-slate-100">
                  <div className="flex items-center gap-4 mb-10">
                    <GraduationCap size={32} className="text-yru-pink" />
                    <h2 className="text-3xl font-black text-slate-900">ข้อมูลการศึกษา</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">คณะ / Faculty</p>
                        <p className="text-xl font-bold text-slate-800">{member.faculty || 'ไม่ระบุ'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">สาขาวิชา / Major</p>
                        <p className="text-xl font-bold text-slate-800">{member.major || 'ไม่ระบุ'}</p>
                     </div>
                  </div>

                  {member.educationBackground && member.educationBackground.length > 0 && (
                     <div className="mt-12 pt-10 border-t border-slate-100 space-y-6 relative z-10">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">ประวัติการศึกษาเพิ่มเติม</p>
                        {member.educationBackground.map((edu, i) => (
                          <div key={i} className="flex gap-6 group">
                              <div className="flex flex-col items-center">
                                  <div className="w-3 h-3 bg-slate-200 group-hover:bg-yru-pink transition-colors duration-300 rounded-sm" />
                                  {i !== member.educationBackground.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2" />}
                              </div>
                              <div className="pb-8">
                                  <p className="text-lg font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{edu}</p>
                              </div>
                          </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Experience Block */}
               <div className="bg-white p-10 rounded-none shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150">
                    <Briefcase size={120} />
                  </div>
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                    <Briefcase size={32} className="text-yru-pink" />
                    <h2 className="text-3xl font-black text-slate-900">ประสบการณ์และผลงาน</h2>
                  </div>
                  <div className="space-y-6 relative z-10">
                    {member.experience && member.experience.length > 0 ? (
                      member.experience.map((exp, i) => (
                        <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-yru-pink shadow-lg shadow-yru-pink/20" />
                                {i !== member.experience.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2" />}
                            </div>
                            <div className="pb-8">
                                <p className="text-lg font-bold text-slate-700 leading-relaxed group-hover:text-yru-pink transition-colors">{exp}</p>
                            </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 font-bold">กำลังอัพเดทข้อมูลเร็วๆ นี้...</p>
                    )}
                  </div>
               </div>

          </div>
        </div>
      </section>
    </div>
  );
}

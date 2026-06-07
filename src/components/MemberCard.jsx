/**
 * MemberCard.jsx
 * คอมโพเนนต์แสดงบัตรข้อมูลของสมาชิก (Member Card)
 * ใช้ในหน้า Team และ OrChart เพื่อแสดงรูปภาพ, ตำแหน่ง, และชื่อสมาชิก
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MemberCard({ member }) {
  // แปลง Google Drive Viewer URL เป็น Direct Image URL
  const getDirectImageUrl = (url) => {
    if (!url) return '/images/team/anwa.png';
    const match1 = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (match1 && match1[1]) return `https://drive.google.com/thumbnail?id=${match1[1]}&sz=w800`;
    
    const match2 = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
    if (match2 && match2[1]) return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w800`;
    
    return url;
  };

  // หากไม่มีรูปภาพสมาชิก ให้ใช้รูปภาพ Placeholder แทน
  const rawImage = member.image || member.Image;
  const imageUrl = getDirectImageUrl(
    rawImage && !rawImage.includes('placeholder')
      ? rawImage
      : '/images/team/anwa.png'
  );

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-slate-300/60 border border-slate-100 group h-full flex flex-col transition-shadow duration-300">

        {/* ส่วนรูปภาพสมาชิก (Photo Section) */}
        <div className="relative flex-shrink-0 overflow-hidden">
          <div className="aspect-[3/4] bg-slate-100 relative group-hover:scale-105 transition-transform duration-700">
            <img
              src={imageUrl}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
            {/* เลเยอร์ไล่สีชมพูทับหน้า (Gradient Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-t from-yru-pink/60 via-yru-pink/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* แสงเรืองรอง (Inner Glow) เมื่อ Hover */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(236,72,153,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* ป้ายชื่อตำแหน่งแบบลอย (Floating Title Badge) */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="inline-block bg-white text-yru-pink text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl whitespace-nowrap border border-yru-pink/10">
              {member.title}
            </span>
          </div>
        </div>

        {/* ส่วนข้อมูลเนื้อหา (Info Section) — พื้นหลังสีชมพู ตัวอักษรสีขาว */}
        <div className="pt-8 pb-6 px-6 flex flex-col flex-1 bg-yru-pink text-white relative z-10 shadow-[0_-10px_20px_rgba(236,72,153,0.1)]">
          {/* ชื่อสมาชิก */}
          <div className="mb-1">
            <h3 className="text-xl font-black text-white leading-tight tracking-tight">
              {member.name}
            </h3>
          </div>

          {/* เส้นคั่น (Divider) */}
          <div className="h-px w-10 bg-white/50 my-4" />

          {/* คณะ / สาขาวิชา */}
          {member.faculty && (
            <p className="text-xs font-bold text-white/80 leading-relaxed mb-1">
              {member.faculty}
            </p>
          )}

          {/* ลิงก์รายละเอียด (CTA Link) */}
          <div className="mt-auto pt-5">
            <Link
              to={`/team/${member.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-black text-white hover:text-slate-100 transition-colors group/link underline decoration-white/20 underline-offset-4"
            >
              ทำความรู้จัก
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
              >
                <path d="M7 7h10v10" /><path d="M7 17 17 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

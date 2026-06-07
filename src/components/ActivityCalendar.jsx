/**
 * ActivityCalendar.jsx
 * ปฏิทินกิจกรรมแบบ Interactive — ธีมเหลี่ยมๆ Brutalist/Editorial
 * ให้เข้ากับ Design System ของเว็บ (sharp edges, yru-pink accent, offset shadow)
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Users, Clock, Loader } from 'lucide-react';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

/* ─── ค่าคงที่ ─── */
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const CATEGORY_CONFIG = {
  'บังคับ': { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'บังคับ' },
  'สมรรถนะ': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', label: 'สมรรถนะ' },
  'default': { color: '#ec4899', bg: 'rgba(236,72,153,0.10)', label: 'ทั่วไป' },
};

/* ─── ฟังก์ชันช่วย ─── */
function getBuddhistYear(year) {
  return year + 543;
}

function formatThaiDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;
}

function getEventCategory(event) {
  if (event.category) return CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['default'];
  return CATEGORY_CONFIG['default'];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function ActivityCalendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=public&table=ปฏิทิน`);
        const json = await res.json();
        if (json.success) {
          const data = json.data || [];
          setCalendarData(data);
          if (data.length > 0) {
             const allDates = data.map(e => new Date(e.start));
             const minDate = new Date(Math.min(...allDates));
             if (!isNaN(minDate)) {
               setCurrentMonth(minDate.getMonth());
               setCurrentYear(minDate.getFullYear());
             }
          }
        }
      } catch (e) {
        console.error('Error fetching calendar', e);
      } finally {
        setLoading(false);
      }
    };
    if (GAS_URL) fetchCalendar();
    else setLoading(false);
  }, []);

  /* ─── กรองกิจกรรมตามเดือน ─── */
  const monthEvents = useMemo(() => {
    return calendarData.filter(event => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      return start <= monthEnd && end >= monthStart;
    });
  }, [currentMonth, currentYear]);

  /* ─── กรองตามหมวดหมู่ ─── */
  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return monthEvents;
    return monthEvents.filter(e => {
      if (activeFilter === 'บังคับ') return e.category === 'บังคับ';
      if (activeFilter === 'สมรรถนะ') return e.category === 'สมรรถนะ';
      if (activeFilter === 'ทั่วไป') return !e.category;
      return true;
    });
  }, [monthEvents, activeFilter]);

  /* ─── หากิจกรรมของวันที่เลือก ─── */
  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return calendarData.filter(event => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;
      const sel = new Date(currentYear, currentMonth, selectedDate);
      return sel >= new Date(start.getFullYear(), start.getMonth(), start.getDate())
        && sel <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }, [selectedDate, currentMonth, currentYear]);

  /* ─── สร้างตาราง calendar grid ─── */
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  function getEventsForDay(day) {
    return calendarData.filter(event => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;
      const d = new Date(currentYear, currentMonth, day);
      return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate())
        && d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }

  /* ─── นำทางเดือน ─── */
  function prevMonth() {
    setSelectedDate(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  }

  function nextMonth() {
    setSelectedDate(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  }

  const today = new Date();
  const isToday = (day) =>
    today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <section className="py-24 md:py-32 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="mb-16">
          <span className="text-yru-pink font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            Activity Calendar
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
            ปฏิทินกิจกรรม<br />
            <span className="text-yru-pink">ประจำปีการศึกษา {getBuddhistYear(currentYear)}</span>
          </h2>
          <p className="text-slate-500 font-bold leading-relaxed text-lg border-l-4 border-slate-300 pl-6 max-w-2xl">
            ตารางกิจกรรมของสโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์และองค์กรนักศึกษา มหาวิทยาลัยราชภัฏยะลา
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ─── ปฏิทิน (Calendar Grid) ─── */}
          <div className="lg:col-span-7">
            <div className="relative group">
              {/* Offset shadow — เหมือน Facebook widget */}
              <div className="absolute inset-0 bg-yru-pink translate-x-3 translate-y-3 z-0 transition-transform group-hover:translate-x-5 group-hover:translate-y-5" />

              <div className="relative z-10 bg-white border-2 border-slate-900">
                {/* Month navigation bar */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={prevMonth}
                    className="w-10 h-10 border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="text-center">
                    <h3 className="text-white font-black text-xl uppercase tracking-wider">
                      {THAI_MONTHS[currentMonth]}
                    </h3>
                    <span className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">
                      พ.ศ. {getBuddhistYear(currentYear)}
                    </span>
                  </div>
                  <button
                    onClick={nextMonth}
                    className="w-10 h-10 border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b-2 border-slate-900">
                  {THAI_DAYS_SHORT.map((day, i) => (
                    <div
                      key={day}
                      className={`py-3 text-center text-[11px] font-black uppercase tracking-wider border-r border-slate-200 last:border-r-0 ${
                        i === 0 ? 'text-red-400 bg-red-50/50' : i === 6 ? 'text-blue-400 bg-blue-50/50' : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                  {/* Empty cells */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square border-r border-b border-slate-100" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedDate === day;
                    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();

                    return (
                      <motion.button
                        key={day}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setSelectedDate(isSelected ? null : day)}
                        className={`
                          aspect-square border-r border-b border-slate-100 flex flex-col items-center justify-center relative transition-all cursor-pointer text-sm
                          ${isSelected
                            ? 'bg-yru-pink text-white'
                            : isToday(day)
                              ? 'bg-slate-900 text-white'
                              : hasEvents
                                ? 'bg-slate-50 hover:bg-yru-pink/10 text-slate-800'
                                : 'hover:bg-slate-50 text-slate-500'
                          }
                          ${dayOfWeek === 0 && !isSelected && !isToday(day) ? '!text-red-400' : ''}
                          ${dayOfWeek === 6 && !isSelected && !isToday(day) ? '!text-blue-400' : ''}
                        `}
                      >
                        <span className={`font-bold ${isSelected || isToday(day) ? 'font-black text-base' : ''}`}>
                          {day}
                        </span>
                        {hasEvents && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((evt, idx) => (
                              <div
                                key={idx}
                                className="w-1.5 h-1.5"
                                style={{
                                  backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : getEventCategory(evt).color,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="px-6 py-3 border-t-2 border-slate-900 bg-slate-50 flex flex-wrap gap-5 justify-center">
                  {Object.entries(CATEGORY_CONFIG).filter(([k]) => k !== 'default').map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5" style={{ backgroundColor: cfg.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{cfg.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5" style={{ backgroundColor: CATEGORY_CONFIG['default'].color }} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">ทั่วไป</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── รายการกิจกรรม (Event List) ─── */}
          <div className="lg:col-span-5">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'ทั้งหมด' },
                { key: 'บังคับ', label: 'บังคับ' },
                { key: 'สมรรถนะ', label: 'สมรรถนะ' },
                { key: 'ทั่วไป', label: 'ทั่วไป' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all border-2 ${
                    activeFilter === f.key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Selected date detail popup */}
            <AnimatePresence mode="wait">
              {selectedDate && selectedEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 relative"
                >
                  <div className="absolute inset-0 bg-slate-900 translate-x-2 translate-y-2 z-0" />
                  <div className="relative z-10 p-5 bg-yru-pink text-white border-2 border-slate-900">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-3">
                      {selectedDate} {THAI_MONTHS[currentMonth]} {getBuddhistYear(currentYear)}
                    </p>
                    {selectedEvents.map((evt, i) => (
                      <div key={i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-white/20' : ''}`}>
                        <p className="font-black text-base leading-snug">{evt.title}</p>
                        {evt.location && (
                          <p className="text-white/80 text-xs font-bold mt-1 flex items-center gap-1.5">
                            <MapPin size={11} /> {evt.location}
                          </p>
                        )}
                        {evt.owner && (
                          <p className="text-white/80 text-xs font-bold mt-1 flex items-center gap-1.5">
                            <Users size={11} /> {evt.owner}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Event list */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              <AnimatePresence>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => {
                    const cat = getEventCategory(event);
                    const start = new Date(event.start);
                    const end = event.end ? new Date(event.end) : null;

                    return (
                      <motion.div
                        key={`${event.title}-${event.start}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ delay: index * 0.03 }}
                        className="group bg-white border-2 border-slate-100 hover:border-slate-900 p-4 transition-all hover:-translate-y-0.5 cursor-default"
                      >
                        <div className="flex gap-4">
                          {/* Date badge */}
                          <div
                            className="w-14 h-14 flex flex-col items-center justify-center shrink-0 border-2 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: cat.bg, borderColor: cat.color + '30' }}
                          >
                            <span className="text-lg font-black leading-none" style={{ color: cat.color }}>
                              {start.getDate()}
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-wider mt-0.5" style={{ color: cat.color, opacity: 0.6 }}>
                              {THAI_MONTHS[start.getMonth()].slice(0, 3)}.
                            </span>
                          </div>

                          {/* Event info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-800 text-sm leading-snug truncate group-hover:text-yru-pink transition-colors">
                              {event.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                              {end && (
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Clock size={10} />
                                  {formatThaiDate(event.start)} – {formatThaiDate(event.end)}
                                </span>
                              )}
                              {event.location && (
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                                  <MapPin size={10} />
                                  {event.location}
                                </span>
                              )}
                              {event.owner && (
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Users size={10} />
                                  {event.owner}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Category tag */}
                          <div className="shrink-0 self-start">
                            <span
                              className="text-[9px] font-black uppercase tracking-wider px-2 py-1 border"
                              style={{ backgroundColor: cat.bg, color: cat.color, borderColor: cat.color + '30' }}
                            >
                              {event.category || 'ทั่วไป'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 border-2 border-dashed border-slate-200"
                  >
                    <CalendarDays size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-black text-sm uppercase tracking-wider">ไม่มีกิจกรรมในเดือนนี้</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Event count */}
            {filteredEvents.length > 0 && (
              <div className="mt-5 pt-4 border-t-2 border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  {filteredEvents.length} กิจกรรม — {THAI_MONTHS[currentMonth]} {getBuddhistYear(currentYear)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

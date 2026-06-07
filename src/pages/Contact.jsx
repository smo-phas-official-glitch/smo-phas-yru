import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, MessageSquare, AlertCircle,
  CheckCircle, XCircle, Loader, ClipboardList, RefreshCw,
  Lock, LogOut, ChevronDown, Shield, Eye, EyeOff,
  Clock, RotateCcw, Ban, Calendar, Tag,
  Camera, ImagePlus, Trash2, ExternalLink, SwitchCamera, X as XIcon,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import CustomLoader from '../components/Loader';

// ============================================================
//  ⚙️ Config — อ่านจาก .env.local
// ============================================================
const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';
const EMAILJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
// ============================================================

// 🛡️ Security
const MAX_NAME_LEN = 100;
const MAX_SUBJECT_LEN = 200;
const MAX_MESSAGE_LEN = 2000;
const MAX_ID_LEN = 20;
const SUBMIT_COOLDOWN = 60;
const INJECTION_PATTERN = /<script|javascript:|on\w+\s*=|data:\s*text\/html/i;

function sanitizeInput(value) {
  return String(value).replace(/[<>"'`]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' }[c])
  );
}

function validateForm(form) {
  const errors = [];
  if (!form.subject.trim()) errors.push('กรุณากรอกหัวข้อ');
  if (!form.message.trim()) errors.push('กรุณากรอกรายละเอียด');
  if (form.name.length > MAX_NAME_LEN) errors.push(`ชื่อต้องไม่เกิน ${MAX_NAME_LEN} ตัวอักษร`);
  if (form.student_id.length > MAX_ID_LEN) errors.push(`รหัสนักศึกษาต้องไม่เกิน ${MAX_ID_LEN} ตัวอักษร`);
  if (form.subject.length > MAX_SUBJECT_LEN) errors.push(`หัวข้อต้องไม่เกิน ${MAX_SUBJECT_LEN} ตัวอักษร`);
  if (form.message.length > MAX_MESSAGE_LEN) errors.push(`รายละเอียดต้องไม่เกิน ${MAX_MESSAGE_LEN} ตัวอักษร`);
  const allText = [form.name, form.student_id, form.subject, form.message].join(' ');
  if (INJECTION_PATTERN.test(allText)) errors.push('พบข้อความที่ไม่อนุญาต กรุณาตรวจสอบอีกครั้ง');
  return errors;
}

// ─── Status config (SVG icons) ─────────────────────────────
const STATUS_CONFIG = {
  'รอดำเนินการ': { Icon: Clock, iconCls: 'text-slate-500', textCls: 'text-slate-600', bg: 'bg-white', border: 'border-slate-300', badge: 'bg-slate-100 text-slate-600 border-slate-200', label: 'รอดำเนินการ' },
  'กำลังดำเนินการ': { Icon: RotateCcw, iconCls: 'text-blue-500', textCls: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200', label: 'กำลังดำเนินการ' },
  'ดำเนินการเสร็จแล้ว': { Icon: CheckCircle, iconCls: 'text-emerald-500', textCls: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'ดำเนินการเสร็จแล้ว' },
  'ไม่สามารถดำเนินการได้': { Icon: Ban, iconCls: 'text-rose-500', textCls: 'text-rose-700', bg: 'bg-rose-50/50', border: 'border-rose-400', badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'ดำเนินการไม่ได้' },
};
const STATUS_LIST = Object.keys(STATUS_CONFIG);

function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['รอดำเนินการ'];
  const { Icon, iconCls, badge, label } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 border font-black ${size === 'lg' ? 'px-3 py-1.5 text-[11px]' : 'px-2.5 py-1 text-[10px]'
      } ${badge}`}>
      <Icon size={size === 'lg' ? 11 : 10} className={iconCls} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  return d.toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────
//  Camera Modal (getUserMedia — works on desktop + mobile)
// ─────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacing] = useState('environment'); // front / back
  const [snapshot, setSnapshot] = useState(null);          // base64 of captured frame
  const [camError, setCamError] = useState('');

  // Start camera stream
  const startStream = useCallback(async (facing) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setReady(false);
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setReady(true);
        };
      }
    } catch (err) {
      setCamError(
        err.name === 'NotAllowedError'
          ? 'ไม่ได้รับอนุญาตใช้กล้อง กรุณาอนุญาตในเบราว์เซอร์'
          : 'ไม่พบกล้อง หรือกล้องถูกใช้งานอยู่'
      );
    }
  }, []);

  useEffect(() => {
    startStream(facingMode);
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const switchCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacing(next);
    setSnapshot(null);
    startStream(next);
  };

  // Capture frame from video to canvas
  const snap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const b64 = canvas.toDataURL('image/jpeg', 0.85);
    setSnapshot(b64);
  };

  const retake = () => setSnapshot(null);

  const confirm = () => {
    if (!snapshot) return;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(snapshot);
  };

  const close = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[300]"
        onClick={close}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-slate-900 w-full max-w-xl pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Camera size={18} className="text-yru-pink" />
              <span className="font-black text-white text-sm uppercase tracking-widest">ถ่ายรูปหลักฐาน</span>
            </div>
            <button onClick={close} className="text-slate-400 hover:text-white transition-colors p-1">
              <XIcon size={20} />
            </button>
          </div>

          {/* Camera view */}
          <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
            {camError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                <XCircle size={40} className="text-rose-400" />
                <p className="text-white font-bold text-sm">{camError}</p>
                <p className="text-slate-400 text-xs font-bold">ลองใช้ "เลือกจากเครื่อง" แทนได้เลย</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay playsInline muted
                  className={`w-full h-full object-cover ${snapshot ? 'hidden' : 'block'}`}
                  style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                />
                {snapshot && (
                  <img src={snapshot} alt="snapshot" className="w-full h-full object-cover" />
                )}
                {!ready && !snapshot && !camError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="animate-spin text-yru-pink" size={32} />
                  </div>
                )}
                {/* Viewfinder corners */}
                {!snapshot && ready && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yru-pink" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yru-pink" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yru-pink" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yru-pink" />
                  </div>
                )}
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 py-5 gap-4">
            {!snapshot ? (
              <>
                <button onClick={switchCamera}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-30"
                  disabled={!ready || !!camError}
                >
                  <SwitchCamera size={16} /> สลับกล้อง
                </button>
                {/* Shutter */}
                <button
                  onClick={snap}
                  disabled={!ready || !!camError}
                  className="w-16 h-16 rounded-full bg-white border-4 border-slate-600 hover:border-yru-pink hover:scale-105 transition-all disabled:opacity-40 flex-shrink-0 mx-auto"
                  title="ถ่ายรูป"
                />
                <div className="w-24" />
              </>
            ) : (
              <>
                <button onClick={retake}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-black uppercase tracking-widest transition-colors"
                >
                  <RotateCcw size={14} /> ถ่ายใหม่
                </button>
                <button onClick={confirm}
                  className="flex items-center gap-2 px-6 py-3 bg-yru-pink hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-[0_4px_16px_rgba(236,72,153,0.4)]"
                >
                  <CheckCircle size={14} /> ใช้รูปนี้
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────
export default function Contact() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminMode = urlParams.get('admin') === 'true';

  // ─── Form state
  const [status, setStatus] = useState('idle');
  const [validationErrors, setValidationErrors] = useState([]);
  const [cooldown, setCooldown] = useState(0);
  const [form, setForm] = useState({ name: '', student_id: '', subject: '', message: '' });

  // ─── Image evidence state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false); // camera modal
  const fileInputRef = useRef(null);

  // ─── Tracking table state
  const [petitions, setPetitions] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  // ─── Admin state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingRow, setUpdatingRow] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin_session');
    if (saved) {
      try {
        const { password, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setAdminPassword(password);
          setAdminLoggedIn(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  useEffect(() => {
    if (adminLoggedIn && GAS_URL) {
      const fetchAdminData = async () => {
        setAdminLoading(true);
        try {
          const res = await fetch(`${GAS_URL}?action=admin&password=${encodeURIComponent(adminPassword)}`);
          const json = await res.json();
          if (json.success) setAdminData([...(json.data || [])].reverse());
          else if (json.error === 'Invalid password') {
            setAdminLoggedIn(false);
            setAdminPassword('');
            localStorage.removeItem('admin_session');
          }
        } catch (e) { } finally { setAdminLoading(false); }
      };
      fetchAdminData();
    }
  }, [adminLoggedIn]);

  // ─── Fetch public petitions
  const fetchPublicPetitions = useCallback(async () => {
    if (!GAS_URL) { setTableError('ยังไม่ได้ตั้งค่า GAS URL'); setTableLoading(false); return; }
    try {
      setTableLoading(true);
      setTableError('');
      const res = await fetch(`${GAS_URL}?action=public`);
      const json = await res.json();
      if (json.success) {
        setPetitions([...(json.data || [])].reverse());
        setLastRefresh(new Date());
      } else {
        setTableError(json.error || 'เกิดข้อผิดพลาด');
      }
    } catch {
      setTableError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicPetitions();
    const interval = setInterval(fetchPublicPetitions, 3_600_000);
    return () => clearInterval(interval);
  }, [fetchPublicPetitions]);

  useEffect(() => {
    if (isAdminMode) setShowAdminModal(true);
  }, [isAdminMode]);

  // ─── Image handlers
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('ขนาดไฟล์ต้องไม่เกิน 5MB'); return; }
    setImageFile(file);
    const b64 = await fileToBase64(file);
    setImagePreview(b64);
    e.target.value = '';
  };

  // Called when CameraModal captures a snapshot
  const handleCameraCapture = (base64) => {
    setImageFile({ name: `photo_${Date.now()}.jpg` }); // synthetic file object
    setImagePreview(base64);
    setShowCamera(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ─── Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    const limits = { name: MAX_NAME_LEN, student_id: MAX_ID_LEN, subject: MAX_SUBJECT_LEN, message: MAX_MESSAGE_LEN };
    if (value.length <= (limits[name] ?? 500)) setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startCooldown = useCallback(() => {
    setCooldown(SUBMIT_COOLDOWN);
    const iv = setInterval(() => {
      setCooldown((p) => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; });
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || status === 'sending') return;
    const errors = validateForm(form);
    if (errors.length > 0) { setValidationErrors(errors); return; }
    setValidationErrors([]);
    if (!GAS_URL) { setStatus('error'); return; }

    setStatus('sending');
    try {
      const payload = {
        action: 'submit',
        name: sanitizeInput(form.name.trim()) || 'นิรนาม',
        student_id: sanitizeInput(form.student_id.trim()) || '-',
        subject: sanitizeInput(form.subject.trim()),
        message: sanitizeInput(form.message.trim()),
        image_base64: imagePreview || null,
        image_name: imageFile?.name || null,
      };
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        // ส่ง Email ทันทีหลังบันทึกลง Sheet สำเร็จ
        if (EMAILJS_KEY && EMAILJS_SERVICE && EMAILJS_TEMPLATE) {
          try {
            await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
              name: payload.name,
              student_id: payload.student_id,
              subject: payload.subject,
              message: payload.message,
              evidence: json.evidenceUrl || 'ไม่ได้แนบหลักฐาน',
            }, EMAILJS_KEY);
          } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
          }
        }

        setStatus('success');
        setForm({ name: '', student_id: '', subject: '', message: '' });
        removeImage();
        startCooldown();
        setTimeout(fetchPublicPetitions, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  // ─── Admin handlers
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!GAS_URL || !adminPassword) return;
    setAdminLoading(true);
    setAdminError('');
    try {
      const res = await fetch(`${GAS_URL}?action=admin&password=${encodeURIComponent(adminPassword)}`);
      const json = await res.json();
      if (json.success) {
        setAdminLoggedIn(true);
        setAdminData([...(json.data || [])].reverse());
        localStorage.setItem('admin_session', JSON.stringify({
          password: adminPassword,
          timestamp: Date.now()
        }));
      } else {
        setAdminError(json.error || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setAdminError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleStatusUpdate = async (rowIndex, newStatus) => {
    setUpdatingRow(rowIndex);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'updateStatus', password: adminPassword, rowIndex, newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setAdminData(prev => {
          const arr = [...prev];
          arr[rowIndex] = { ...arr[rowIndex], status: newStatus };
          return arr;
        });
        fetchPublicPetitions();
      } else if (json.error === 'Invalid password') {
        setAdminLoggedIn(false);
        setAdminPassword('');
        localStorage.removeItem('admin_session');
      } else {
        alert('เกิดข้อผิดพลาด: ' + json.error);
      }
    } catch {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setUpdatingRow(null);
    }
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setAdminPassword('');
    setAdminData([]);
    setAdminError('');
    setShowAdminModal(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="pt-0 pb-32 bg-slate-50 min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white mb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-yru-pink/10 -skew-x-12 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 border border-white/20 mb-10"
              >
                <MessageSquare size={18} className="text-yru-pink" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Student Support Center</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
              >
                ติดต่อสโม <span className="text-yru-pink">&</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400">ร้องเรียน</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="max-w-lg text-slate-400 font-bold leading-relaxed"
              >
                เราพร้อมรับฟังทุกปัญหาและข้อเสนอแนะ เพื่อร่วมพัฒนาสวัสดิการและคุณภาพชีวิตของนักศึกษาทุกคน
              </motion.p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 1.5 }}
              className="hidden lg:flex justify-end select-none pointer-events-none"
            >
              <Mail size={380} strokeWidth={0.5} className="text-white" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ── Contact Info + Form ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left — channels */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-4">
              Channels <div className="h-0.5 flex-1 bg-slate-200" />
            </h2>
            {[
              { icon: Phone, label: 'เบอร์โทรศัพท์', value: '073-299-699 ต่อ 182', sub: 'จันทร์-ศุกร์ (๐๘.๓๐ - ๑๖.๓๐ น.)' },
              { icon: Mail, label: 'อีเมลสภาฯ', value: 'smo-phas-official@yru.ac.th', sub: 'ส่งได้ตลอด ๒๔ ชั่วโมง' },
              { icon: MapPin, label: 'ที่ตั้งสำนักงาน', value: 'ตึกคณะสาธารณสุขและสหเวชศาสตร์ ชั้น 1', sub: 'กองพัฒนานักศึกษา มรย.' },
            ].map((m, i) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                className="bg-white p-8 border border-slate-100 hover:border-yru-pink shadow-xl shadow-slate-100/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 group-hover:bg-yru-pink transition-colors duration-300" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center group-hover:bg-yru-pink transition-colors shadow-inner">
                    <m.icon className="text-slate-400 group-hover:text-white transition-colors" size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{m.label}</p>
                </div>
                <p className="font-black text-slate-900 text-xl mb-1">{m.value}</p>
                <p className="text-sm text-slate-500 font-bold">{m.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Right — Grievance Form */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-slate-100 relative h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-48 h-2 bg-yru-pink" />
              <div className="absolute top-0 right-0 w-2 h-48 bg-yru-pink" />
              <div className="absolute bottom-[-5%] right-[-5%] opacity-[0.03] pointer-events-none">
                <MessageSquare size={300} />
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10 border-b-4 border-slate-900 pb-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">ส่งเรื่องราวร้องทุกข์</h2>
                  <p className="text-slate-500 font-bold max-w-lg">
                    เรื่องราวของคุณจะถูกเก็บเป็น <span className="text-yru-pink">ความลับ</span> และเข้าสู่การพิจารณาโดยคณะกรรมการสภาฯ
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 shadow-xl rotate-2 flex-shrink-0">
                  <AlertCircle size={16} className="text-yru-pink" />
                  <span className="text-xs font-black tracking-[0.2em] uppercase">High Priority</span>
                </div>
              </div>

              {/* Banners */}
              <AnimatePresence>
                {status === 'sending' && <CustomLoader fullScreen={true} />}
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mb-10 flex items-center gap-6 bg-emerald-50 border-l-8 border-emerald-500 text-emerald-800 p-8">
                      <CheckCircle size={32} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-black text-2xl mb-1">ส่งคำร้องสำเร็จแล้ว!</p>
                        <p className="font-bold text-sm opacity-80">บันทึกข้อมูลเรียบร้อย สามารถติดตามสถานะด้านล่างได้เลย</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mb-10 flex items-center gap-6 bg-rose-50 border-l-8 border-rose-500 text-rose-800 p-8">
                      <XCircle size={32} className="text-rose-500 flex-shrink-0" />
                      <div>
                        <p className="font-black text-2xl mb-1">เกิดข้อผิดพลาด!</p>
                        <p className="font-bold text-sm opacity-80">กรุณาลองใหม่อีกครั้ง หรือติดต่อผ่านโทรศัพท์/อีเมล</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8 flex-1 relative z-10 flex flex-col">

                {/* Name + Student ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">ชื่อ-นามสกุล (ไม่ระบุก็ได้)</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus:border-yru-pink focus:bg-white outline-none transition-all font-bold text-slate-900"
                      placeholder="นาย/นางสาว สโมสรนักศึกษาคณะสาธารณะสุขและสหเวชศาสตร์" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">รหัสนักศึกษา / ผู้ติดต่อ</label>
                    <input type="text" name="student_id" value={form.student_id} onChange={handleChange}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus:border-yru-pink focus:bg-white outline-none transition-all font-bold text-slate-900"
                      placeholder="๔๐๖xxxxxxxx" />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    เรื่องที่ต้องการร้องเรียน / หัวข้อ <span className="text-yru-pink">*</span>
                  </label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus:border-yru-pink focus:bg-white outline-none transition-all font-bold text-slate-900"
                    placeholder="หัวข้อที่คุณต้องการแจ้งให้สภาฯ ทราบ" />
                </div>

                {/* Image Evidence Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    รูปหลักฐาน (ถ้ามี) — ไม่เกิน 5 MB
                  </label>

                  {/* Hidden file inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {imagePreview ? (
                    /* Preview */
                    <div className="relative border-2 border-slate-200 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="หลักฐาน"
                        className="w-full max-h-64 object-contain bg-slate-50"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 text-white px-3 py-2 text-xs font-black uppercase tracking-wide transition-all backdrop-blur-sm"
                        >
                          <ImagePlus size={13} /> เปลี่ยน
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex items-center gap-1.5 bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-2 text-xs font-black uppercase tracking-wide transition-all backdrop-blur-sm"
                        >
                          <Trash2 size={13} /> ลบ
                        </button>
                      </div>
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2">
                        <p className="text-xs font-bold text-slate-500 truncate">{imageFile?.name}</p>
                      </div>
                    </div>
                  ) : (
                    /* Upload buttons */
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-3 py-8 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-yru-pink hover:bg-pink-50/30 transition-all group"
                      >
                        <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center group-hover:bg-yru-pink group-hover:border-yru-pink transition-colors shadow-sm">
                          <ImagePlus size={22} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-700 uppercase tracking-wide">เลือกจากเครื่อง</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">JPG, PNG, HEIC</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="flex flex-col items-center justify-center gap-3 py-8 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-yru-pink hover:bg-pink-50/30 transition-all group"
                      >
                        <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center group-hover:bg-yru-pink group-hover:border-yru-pink transition-colors shadow-sm">
                          <Camera size={22} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-700 uppercase tracking-wide">ถ่ายรูป</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">เปิดกล้อง</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    รายละเอียดเหตุการณ์ / ปัญหา <span className="text-yru-pink">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} required
                    className="w-full flex-1 min-h-[140px] px-6 py-5 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 focus:border-yru-pink focus:bg-white resize-none outline-none transition-all font-bold text-slate-900 leading-relaxed"
                    placeholder="โปรดระบุรายละเอียด เหตุการณ์ วันเวลา และสถานที่เกิดเหตุอย่างครบถ้วน..." />
                </div>

                {/* Validation errors */}
                <AnimatePresence>
                  {validationErrors.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex flex-col gap-2 bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4">
                        <p className="font-black text-sm">กรุณาแก้ไขข้อมูลต่อไปนี้:</p>
                        <ul className="list-disc list-inside text-sm font-bold space-y-1">
                          {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit row */}
                <div className="pt-8 mt-auto flex flex-col xl:flex-row items-center justify-between gap-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold max-w-sm uppercase tracking-widest text-center xl:text-left">
                    โดยการส่งข้อมูลนี้ คุณยืนยันว่าข้อมูลเป็นความจริงและยอมรับนโยบายความเป็นส่วนตัว
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending' || cooldown > 0}
                    className="w-full xl:w-auto px-16 py-6 bg-slate-900 text-white font-black shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:bg-yru-pink hover:shadow-yru-pink/30 transition-all flex items-center justify-center group uppercase tracking-[0.2em] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <><Loader className="mr-3 animate-spin" size={20} /> SENDING...</>
                    ) : cooldown > 0 ? (
                      <><Loader className="mr-3" size={20} /> รอ {cooldown} วินาที...</>
                    ) : (
                      <>SUBMIT REPORT <Send className="ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" size={18} strokeWidth={2.5} /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* ══ Petition Tracking Section ══════════════════════════ */}
        <section>
          {/* Dark hero header */}
          <div className="bg-slate-900 text-white px-10 py-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />
            <div className="absolute top-0 left-0 w-1 h-full bg-yru-pink" />
            <div className="absolute bottom-0 left-0 w-32 h-[3px] bg-yru-pink" />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden md:block">
              <ClipboardList size={200} strokeWidth={0.8} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 mb-5">
                  <ClipboardList size={13} className="text-yru-pink" />
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60">Status Tracker</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-3">
                  ติดตามสถานะ<span className="text-yru-pink">คำร้อง</span>
                </h2>
                <p className="text-slate-400 font-bold text-sm flex items-center gap-2">
                  <RefreshCw size={12} className={tableLoading ? 'animate-spin text-yru-pink' : 'text-slate-600'} />
                  อัพเดตอัตโนมัติทุก 1 ชั่วโมง
                  {lastRefresh && <span className="text-slate-600">· ล่าสุด {lastRefresh.toLocaleTimeString('th-TH')}</span>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchPublicPetitions}
                  disabled={tableLoading}
                  className="flex items-center justify-center gap-2.5 px-6 py-4 bg-yru-pink text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-600 transition-all duration-300 disabled:opacity-50 flex-shrink-0 shadow-[0_8px_24px_rgba(236,72,153,0.35)]"
                >
                  <RefreshCw size={15} className={tableLoading ? 'animate-spin' : ''} />
                  รีเฟรช
                </button>
              </div>
            </div>
          </div>

          {/* Status Legend — equal-width 4 column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-x border-b border-slate-200">
            {STATUS_LIST.map((s) => {
              const { Icon, iconCls, textCls, bg, border, label } = STATUS_CONFIG[s];
              return (
                <div key={s} className={`flex items-center gap-3 px-5 py-5 border-r border-slate-200 last:border-r-0 ${bg}`}>
                  <div className={`w-9 h-9 flex items-center justify-center border-2 flex-shrink-0 bg-white ${border}`}>
                    <Icon size={15} className={iconCls} strokeWidth={2.5} />
                  </div>
                  <p className={`text-xs font-black ${textCls}`}>{label}</p>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {tableError && (
            <div className="flex items-center gap-4 bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 text-rose-800 px-6 py-5 font-bold text-sm mt-4">
              <XCircle size={20} className="flex-shrink-0 text-rose-500" />
              {tableError}
            </div>
          )}

          {/* Loading */}
          {tableLoading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-5 bg-white border border-t-0 border-slate-200">
              <div className="w-14 h-14 bg-slate-900 flex items-center justify-center">
                <Loader className="animate-spin text-yru-pink" size={24} />
              </div>
              <p className="font-black text-slate-500 text-sm uppercase tracking-widest">กำลังโหลดข้อมูล...</p>
            </div>

            /* Empty */
          ) : petitions.length === 0 && !tableError ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4 bg-white border border-t-0 border-slate-200">
              <div className="w-16 h-16 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                <ClipboardList size={26} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <p className="font-black text-slate-400 text-sm uppercase tracking-widest">ยังไม่มีคำร้องในระบบ</p>
            </div>

            /* Table */
          ) : (
            <div className="overflow-x-auto border border-t-0 border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    {[
                      { icon: null, label: '#' },
                      { icon: Calendar, label: 'วันที่ยื่น' },
                      { icon: Tag, label: 'หัวข้อคำร้อง' },
                      { icon: ClipboardList, label: 'สถานะ' },
                      { icon: RefreshCw, label: 'อัพเดทล่าสุด' },
                    ].map(({ icon: IconComp, label }) => (
                      <th key={label} className="px-5 py-4 text-left whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {IconComp && <IconComp size={12} className="text-yru-pink flex-shrink-0" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {petitions.map((p, idx) => (
                    <motion.tr
                      key={p.id || idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.035 }}
                      className="bg-white hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-500 font-black text-xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-slate-500 font-bold text-sm whitespace-nowrap">
                        {formatDate(p.timestamp).replace(' ', '\n')}
                      </td>
                      <td className="px-5 py-5 min-w-[200px]">
                        <p className="text-slate-800 font-black text-sm truncate">{p.subject}</p>
                      </td>
                      <td className="px-5 py-5 whitespace-nowrap">
                        <StatusBadge status={p.status} size="lg" />
                      </td>
                      <td className="px-5 py-5 text-slate-400 font-bold text-xs whitespace-nowrap">
                        {formatDate(p.updated_at).replace(' ', '\n')}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  แสดง {petitions.length} รายการ
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Data
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ══ ADMIN MODAL ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showAdminModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
              onClick={() => !adminLoggedIn && setShowAdminModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">

                {/* Modal Header */}
                <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <Shield size={22} className="text-yru-pink" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
                      <p className="font-black text-lg">จัดการคำร้องนักศึกษา</p>
                    </div>
                  </div>
                  {adminLoggedIn && (
                    <button onClick={handleAdminLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-rose-500 border border-white/20 hover:border-rose-500 text-white font-black text-xs uppercase tracking-widest transition-all"
                    >
                      <LogOut size={13} /> ออกจากระบบ
                    </button>
                  )}
                </div>

                <div className="p-8">
                  {!adminLoggedIn ? (
                    <div className="max-w-sm mx-auto py-8">
                      <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-slate-900 flex items-center justify-center mx-auto mb-6">
                          <Lock size={26} className="text-yru-pink" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Admin Login</h3>
                        <p className="text-slate-400 font-bold text-sm mt-2">ป้อนรหัสผ่านเพื่อเข้าใช้งาน</p>
                      </div>
                      <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="รหัสผ่าน Admin"
                            className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-yru-pink outline-none font-bold text-slate-900 pr-14"
                            required
                          />
                          <button type="button" onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {adminError && (
                          <div className="flex items-center gap-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 text-sm font-bold">
                            <XCircle size={16} /> {adminError}
                          </div>
                        )}
                        <button type="submit" disabled={adminLoading}
                          className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.2em] hover:bg-yru-pink transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                        >
                          {adminLoading ? <><Loader className="animate-spin" size={18} /> กำลังเข้าสู่ระบบ...</> : <>เข้าสู่ระบบ <Lock size={16} /></>}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <p className="font-black text-slate-900 text-lg">
                          คำร้องทั้งหมด <span className="text-yru-pink">{adminData.length}</span> รายการ
                        </p>
                        <p className="text-sm font-bold text-slate-400">คลิก "เปลี่ยนสถานะ" เพื่อแก้ไข</p>
                      </div>
                      {adminData.length === 0 ? (
                        <div className="text-center py-20 text-slate-300">
                          <ClipboardList size={48} strokeWidth={1} className="mx-auto mb-4" />
                          <p className="font-bold text-slate-400">ยังไม่มีคำร้อง</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {adminData.map((row) => (
                            <div key={row.rowIndex} className="border border-slate-100 hover:border-slate-200 transition-colors bg-white p-6">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5">#{row.id}</span>
                                    <span className="text-xs font-bold text-slate-400">{formatDate(row.timestamp)}</span>
                                  </div>
                                  <p className="font-black text-slate-900 text-lg mb-1">{row.subject}</p>
                                  <p className="text-sm font-bold text-slate-500 mb-3">
                                    ผู้ยื่น: {row.name || 'นิรนาม'}{row.student_id && row.student_id !== '-' && ` · ${row.student_id}`}
                                  </p>
                                  <p className="text-sm text-slate-700 font-bold leading-relaxed bg-slate-50 p-4 border-l-4 border-slate-200">
                                    {row.message}
                                  </p>
                                  {row.evidence && row.evidence !== '-' && (
                                    <a href={row.evidence} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline mt-3"
                                    >
                                      <ExternalLink size={12} /> ดูหลักฐาน
                                    </a>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                  <StatusBadge status={row.status} size="lg" />
                                  <div className="relative">
                                    <select
                                      value={row.status}
                                      onChange={(e) => handleStatusUpdate(row.rowIndex, e.target.value)}
                                      disabled={updatingRow === row.rowIndex}
                                      className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-yru-pink transition-all disabled:opacity-60 cursor-pointer"
                                    >
                                      {STATUS_LIST.map(statusOption => (
                                        <option key={statusOption} value={statusOption}>{statusOption}</option>
                                      ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                                      {updatingRow === row.rowIndex ? <Loader size={14} className="animate-spin" /> : <ChevronDown size={14} />}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-bold">อัพเดท: {formatDate(row.updated_at)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ══ CAMERA MODAL ══════════════════════════════════════ */}
      <AnimatePresence>
        {showCamera && (
          <CameraModal
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

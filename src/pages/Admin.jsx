import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Loader, LogOut, ClipboardList, ExternalLink, ChevronDown, XCircle, Plus, Edit, Trash2, Calendar, Users, Briefcase } from 'lucide-react';
import CustomLoader from '../components/Loader';

const GAS_URL = import.meta.env.VITE_GAS_WEBAPP_URL || '';

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [activeTab, setActiveTab] = useState('คำร้อง'); // Tabs: คำร้อง, ชุดบริหาร, ฝ่ายงาน, ปฏิทิน
  const [adminData, setAdminData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingRow, setEditingRow] = useState(null);

  const fetchData = async (tab = activeTab) => {
    if (!adminLoggedIn || !GAS_URL) return;
    setIsFetching(true);
    try {
      const res = await fetch(`${GAS_URL}?action=admin&password=${encodeURIComponent(adminPassword)}&table=${encodeURIComponent(tab)}`);
      const json = await res.json();
      if (json.success) {
        setAdminData(json.data || []);
      } else {
        if (json.error === 'Invalid password') handleLogout();
        alert(json.error);
      }
    } catch {
      alert('Error fetching data');
    } finally {
      setIsFetching(false);
    }
  };

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
    if (adminLoggedIn) fetchData();
  }, [adminLoggedIn, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!GAS_URL || !adminPassword) return;
    setAdminLoading(true);
    try {
      const res = await fetch(`${GAS_URL}?action=admin&password=${encodeURIComponent(adminPassword)}&table=คำร้อง`);
      const json = await res.json();
      if (json.success) {
        setAdminLoggedIn(true);
        setAdminData(json.data || []);
        localStorage.setItem('admin_session', JSON.stringify({
          password: adminPassword,
          timestamp: Date.now()
        }));
      } else {
        setAdminError(json.error || 'Invalid password');
      }
    } catch {
      setAdminError('Connection error');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setAdminPassword('');
    localStorage.removeItem('admin_session');
  };

  const handleCrud = async (action, rowIndex = null) => {
    setIsFetching(true);
    try {
      const payload = { action, table: activeTab, password: adminPassword, rowIndex, data: formData };
      if (formData.image_base64) {
        payload.image_base64 = formData.image_base64;
      }
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setFormData({});
        fetchData();
      } else {
        alert(json.error);
      }
    } catch {
      alert('Error saving data');
    } finally {
      setIsFetching(false);
    }
  };

  const handleStatusUpdate = async (rowIndex, newStatus) => {
    setIsFetching(true);
    try {
      const payload = { action: 'updateStatus', table: 'คำร้อง', password: adminPassword, rowIndex, newStatus };
      await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
      fetchData();
    } catch {
      alert('Error updating status');
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: 'กำลังอัปโหลด...', image_base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full space-y-6 border-t-4 border-yru-pink">
          <div className="text-center">
            <Lock size={48} className="mx-auto text-yru-pink mb-4" />
            <h2 className="text-2xl font-black text-slate-900">ผู้ดูแลระบบ</h2>
            <p className="text-sm text-slate-500 font-bold mt-2">เข้าสู่ระบบเพื่อจัดการข้อมูล</p>
          </div>
          {adminError && <div className="text-rose-600 bg-rose-50 p-3 rounded text-sm font-bold border border-rose-200">{adminError === 'Invalid password' ? 'รหัสผ่านไม่ถูกต้อง' : 'การเชื่อมต่อผิดพลาด'}</div>}
          <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="รหัสผ่านผู้ดูแลระบบ" required className="w-full p-3 border rounded focus:border-yru-pink outline-none" />
          <button type="submit" disabled={adminLoading} className="w-full py-3 bg-slate-900 text-white rounded font-bold hover:bg-yru-pink transition-colors">
            {adminLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'คำร้อง', icon: ClipboardList },
    { id: 'ชุดบริหาร', icon: Users },
    { id: 'ฝ่ายงาน', icon: Briefcase },
    { id: 'ปฏิทิน', icon: Calendar }
  ];

  const renderTable = () => {
    if (adminData.length === 0) return <div className="p-8 text-center text-slate-500">ไม่มีข้อมูล</div>;
    const headers = Object.keys(adminData[0]).filter(k => k !== 'rowIndex');
    
    const tableHeadersMap = {
      id: 'ลำดับ', title: activeTab === 'ปฏิทิน' ? 'ชื่อกิจกรรม' : 'ตำแหน่ง', 
      name: activeTab === 'ฝ่ายงาน' ? 'ชื่อฝ่ายงาน' : 'ชื่อ-สกุล', 
      major: 'สาขาวิชา', faculty: 'คณะ', 
      image: 'รูปภาพ', Image: 'รูปภาพ', motto: 'คติประจำใจ', chair: 'หัวหน้าฝ่าย', description: 'รายละเอียด', 
      vision: 'วิสัยทัศน์', bgImage: 'ลิงก์รูปปก', duties: 'หน้าที่', members: 'บุคลากร', start: 'วันที่เริ่ม', end: 'วันที่สิ้นสุด', category: 'หมวดหมู่', 
      ig: 'Instagram', facebook: 'Facebook',
      location: 'สถานที่', owner: 'ผู้รับผิดชอบ', educationBackground: 'ประวัติการศึกษา', experience: 'ประสบการณ์ทำงาน',
      'วันที่ยื่น': 'วันที่ยื่น', 'หัวข้อ': 'หัวข้อ', 'สถานะ': 'สถานะ', 'อัพเดทล่าสุด': 'อัพเดทล่าสุด', 'ลิ้งค์หลักฐาน': 'หลักฐาน'
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm">
              {headers.map(h => <th key={h} className="p-4 whitespace-nowrap">{tableHeadersMap[h] || h}</th>)}
              <th className="p-4 whitespace-nowrap text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {adminData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                {headers.map(h => (
                  <td key={h} className="p-4 max-w-xs truncate">
                    {h === 'สถานะ' && activeTab === 'คำร้อง' ? (
                      <select value={row[h]} onChange={(e) => handleStatusUpdate(row.rowIndex, e.target.value)} className="p-1 border rounded text-xs bg-white">
                        <option>รอดำเนินการ</option>
                        <option>กำลังดำเนินการ</option>
                        <option>ดำเนินการเสร็จแล้ว</option>
                        <option>ไม่สามารถดำเนินการได้</option>
                      </select>
                    ) : h === 'ลิ้งค์หลักฐาน' || h === 'image' || String(row[h]).startsWith('http') ? (
                      <a href={row[h]} target="_blank" rel="noreferrer" className="text-yru-pink truncate inline-block max-w-[100px]">Link</a>
                    ) : (h === 'start' || h === 'end') && row[h] ? (
                      !isNaN(new Date(row[h]).getTime()) ? new Date(row[h]).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }) : String(row[h])
                    ) : String(row[h])}
                  </td>
                ))}
                <td className="p-4 text-right flex gap-2 justify-end">
                  {activeTab !== 'คำร้อง' && (
                    <button onClick={() => { setEditingRow(row.rowIndex); setFormData(row); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="แก้ไข"><Edit size={16}/></button>
                  )}
                  <button onClick={() => { if(confirm('ต้องการลบข้อมูลนี้ใช่หรือไม่?')) handleCrud('delete', row.rowIndex); }} className="p-2 text-rose-600 hover:bg-rose-50 rounded" title="ลบ"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;
    let fields = [];
    if (activeTab === 'ชุดบริหาร') fields = ['id', 'title', 'name', 'major', 'faculty', 'image', 'motto', 'educationBackground', 'experience', 'ig', 'facebook'];
    if (activeTab === 'ฝ่ายงาน') fields = ['id', 'name', 'chair', 'description', 'vision', 'bgImage', 'duties', 'members'];
    if (activeTab === 'ปฏิทิน') fields = ['title', 'start', 'end', 'category', 'location', 'owner'];

    const fieldLabels = {
      id: 'ลำดับ (ID)', 
      title: activeTab === 'ปฏิทิน' ? 'ชื่อกิจกรรม' : 'ตำแหน่ง', 
      name: activeTab === 'ฝ่ายงาน' ? 'ชื่อฝ่ายงาน' : 'ชื่อ-สกุล', 
      major: 'สาขาวิชา', faculty: 'คณะ', 
      image: 'รูปภาพโปรไฟล์', motto: 'คติประจำใจ', chair: 'หัวหน้าฝ่าย', description: 'รายละเอียด', 
      vision: 'วิสัยทัศน์', bgImage: 'ลิงก์รูปปก (URL)', duties: 'หน้าที่ความรับผิดชอบ (ขึ้นบรรทัดใหม่เพื่อแยกข้อ)', 
      members: 'บุคลากร (รูปแบบ -> ตำแหน่ง: ชื่อ-สกุล แล้วขึ้นบรรทัดใหม่)', start: 'วันที่เริ่ม', end: 'วันที่สิ้นสุด', 
      category: 'หมวดหมู่ (บังคับ/สมรรถนะ/ทั่วไป)', location: 'สถานที่', owner: 'ผู้รับผิดชอบ',
      educationBackground: 'ประวัติการศึกษา (แยกแต่ละข้อด้วยการขึ้นบรรทัดใหม่)', experience: 'ประสบการณ์ทำงาน (แยกแต่ละข้อด้วยการขึ้นบรรทัดใหม่)',
      ig: 'Instagram (URL)', facebook: 'Facebook (URL)'
    };

    const getDirectImageUrl = (url) => {
      if (!url) return '';
      const match1 = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
      if (match1 && match1[1]) return `https://drive.google.com/thumbnail?id=${match1[1]}&sz=w800`;
      
      const match2 = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
      if (match2 && match2[1]) return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w800`;
      
      return url;
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{editingRow ? 'แก้ไข' : 'เพิ่มข้อมูล'} {activeTab}</h2>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f}>
                <label className="block text-sm font-bold text-slate-600 mb-1">{fieldLabels[f] || f}</label>
                {activeTab === 'ชุดบริหาร' && f === 'image' ? (
                  <div className="flex flex-col gap-2">
                     <p className="text-xs text-rose-500 font-bold mb-1">* สามารถวางลิงก์รูปภาพจากเว็บไซต์ฝากรูปได้โดยตรง</p>
                     <input type="text" value={formData[f] || ''} onChange={(e) => setFormData({...formData, [f]: e.target.value})} className="w-full p-2 border rounded bg-slate-50" placeholder="วางลิงก์ URL ของรูปภาพ..." />
                     {(() => {
                        const rawImage = formData.image || formData.Image;
                        if (rawImage && rawImage.startsWith('http')) {
                           return <img src={getDirectImageUrl(rawImage)} alt="preview" className="w-20 h-20 object-contain border rounded bg-slate-50" />;
                        }
                        return null;
                     })()}
                  </div>
                ) : f === 'educationBackground' || f === 'experience' || f === 'duties' || f === 'members' || f === 'description' || f === 'vision' ? (
                  <textarea rows={3} value={formData[f] || ''} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-2 border rounded" placeholder="พิมพ์ข้อความแล้วกด Enter เพื่อขึ้นบรรทัดใหม่สำหรับข้อถัดไป..." />
                ) : f === 'start' || f === 'end' ? (
                  <input type="date" value={formData[f] || ''} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-2 border rounded" />
                ) : (
                  <input type="text" value={formData[f] || ''} onChange={e => setFormData({...formData, [f]: e.target.value})} className="w-full p-2 border rounded" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-slate-50">ยกเลิก</button>
            <button onClick={() => handleCrud(editingRow ? 'update' : 'create', editingRow)} disabled={isFetching} className="px-4 py-2 bg-yru-pink text-white rounded hover:bg-rose-600">{isFetching ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <div className="bg-slate-900 text-white p-6 rounded-xl mb-4 border-l-4 border-yru-pink">
            <h1 className="font-black text-xl mb-1">ระบบจัดการส่วนหลัง</h1>
            <button onClick={handleLogout} className="text-xs text-rose-300 hover:text-white flex items-center gap-1 mt-2 transition-colors"><LogOut size={14}/> ออกจากระบบ</button>
          </div>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-yru-pink text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              <tab.icon size={20} /> {tab.id}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-2xl font-black text-slate-900">จัดการ{activeTab}</h2>
            <div className="flex gap-3">
              <button onClick={() => fetchData()} className="p-2 border rounded hover:bg-slate-100" disabled={isFetching}><Loader size={20} className={isFetching ? 'animate-spin' : ''}/></button>
              {activeTab !== 'คำร้อง' && (
                <button onClick={() => { setEditingRow(null); setFormData({}); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded hover:bg-yru-pink transition-colors"><Plus size={18}/> เพิ่มข้อมูล</button>
              )}
            </div>
          </div>
          {renderTable()}
        </div>
      </div>
      {renderModal()}
      {isFetching && <CustomLoader fullScreen={true} />}
    </div>
  );
}

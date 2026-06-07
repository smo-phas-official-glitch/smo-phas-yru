import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildings } from '../data/buildings';
import { Map as MapIcon, Navigation, Satellite, Globe, Search, X, Maximize2, Info, View } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom DivIcon showing building ID number
const createBuildingIcon = (id, isSelected = false) => L.divIcon({
    className: '',
    html: `
        <div class="building-marker ${isSelected ? 'building-marker--selected' : ''}">
            <span class="building-marker__id">${id}</span>
        </div>
    `,
    iconSize: isSelected ? [44, 52] : [36, 44],
    iconAnchor: isSelected ? [22, 52] : [18, 44],
    popupAnchor: [0, -44],
});

const tileLayers = {
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri',
    },
    street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
};

function MapRecenter({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) map.setView(coords, 19, { animate: true });
    }, [coords, map]);
    return null;
}

export default function Map() {
    const [selected, setSelected] = useState(null);
    const [showRefImage, setShowRefImage] = useState(false);
    const [mapType, setMapType] = useState('360');
    const [search, setSearch] = useState('');
    const center = [6.5465, 101.2820];

    const filtered = buildings.filter(b =>
        b.name.includes(search) || b.id.toString().toLowerCase().includes(search.toLowerCase())
    );

    const openNav = (lat, lng) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <div className="pt-0 pb-32 min-h-screen bg-gradient-to-br from-pink-100/50 via-white to-slate-200/40 bg-fixed">
            
            {/* Premium Hero Header - Blueprint Style */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900 text-white mb-0">
                <div className="absolute inset-0 z-0">
                    {/* Subtle grid pattern background */}
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
                                <MapIcon size={18} className="text-yru-pink" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Campus Navigation</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight uppercase"
                            >
                                แผนผัง<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yru-pink to-pink-400 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)]">อาคาร มรย.</span>
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="max-w-lg text-slate-400 font-bold leading-relaxed text-base"
                            >
                                ค้นหาสถานที่และอาคารต่างๆ ภายในมหาวิทยาลัยราชภัฏยะลา 
                                พร้อมระบบนำทางและการแสดงข้อมูลเบื้องต้นของแต่ละอาคาร
                            </motion.p>
                        </motion.div>

                        {/* Visual Decoration to balance the side */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.15, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="hidden lg:flex justify-end select-none pointer-events-none"
                        >
                            <MapIcon size={400} strokeWidth={0.5} className="text-white" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-2px]">

                {/* Map Type Toggle */}
                <div className="flex items-center gap-0 mb-0 border-b-2 border-slate-200 overflow-x-auto">
                    <button
                        onClick={() => setMapType('360')}
                        className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-sm font-black uppercase tracking-widest border-b-4 -mb-0.5 transition-all whitespace-nowrap ${
                            mapType === '360'
                                ? 'border-yru-pink text-yru-pink'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <View size={16} /> แผนที่ 360°
                    </button>
                    <button
                        onClick={() => setMapType('satellite')}
                        className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-sm font-black uppercase tracking-widest border-b-4 -mb-0.5 transition-all whitespace-nowrap ${
                            mapType === 'satellite'
                                ? 'border-yru-pink text-yru-pink'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <Satellite size={16} /> ดาวเทียม
                    </button>
                    <button
                        onClick={() => setMapType('street')}
                        className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-sm font-black uppercase tracking-widest border-b-4 -mb-0.5 transition-all whitespace-nowrap ${
                            mapType === 'street'
                                ? 'border-yru-pink text-yru-pink'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <Globe size={16} /> แผนที่ถนน
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={() => setShowRefImage(true)}
                        className="flex items-center gap-2 px-6 py-4 text-sm font-black text-slate-400 hover:text-yru-pink transition-colors uppercase tracking-widest whitespace-nowrap"
                    >
                        <Maximize2 size={16} /> แผนผังอ้างอิง
                    </button>
                </div>

                {/* ─── 360° Virtual Map (Full Width) ─── */}
                {mapType === '360' && (
                    <div className="border-2 border-slate-200 border-t-0">
                        <div className="relative w-full" style={{ height: '75vh', minHeight: '500px' }}>
                            <iframe
                                src="https://map360.yru.ac.th/"
                                title="แผนที่เสมือนจริง 360° มหาวิทยาลัยราชภัฏยะลา"
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        {/* 360 info bar */}
                        <div className="px-8 py-5 bg-white border-t-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="border-l-4 border-yru-pink pl-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">แผนที่เสมือนจริง 360°</p>
                                <p className="text-sm font-bold text-slate-500">
                                    สำรวจบริเวณมหาวิทยาลัยแบบ 360 องศา คลิกจุดกระพริบเพื่อเปลี่ยนมุมมอง ลากเมาส์เพื่อดูรอบๆ
                                </p>
                            </div>
                            <div className="md:ml-auto flex-shrink-0">
                                <a
                                    href="https://map360.yru.ac.th/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 font-black text-xs uppercase tracking-widest hover:bg-yru-pink transition-colors"
                                >
                                    <Maximize2 size={13} /> เปิดเต็มจอ
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Leaflet Map with Building List (satellite / street) ─── */}
                {mapType !== '360' && (
                <>
                {/* 2-column grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] border-2 border-slate-200 border-t-0">

                    {/* ─── LEFT: Building List ─── */}
                    <div className="border-r-2 border-slate-200 flex flex-col">
                        {/* Search */}
                        <div className="border-b-2 border-slate-200 p-4 flex items-center gap-3 bg-white">
                            <Search size={18} className="text-slate-300 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="ค้นหาอาคาร..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 outline-none text-sm font-bold text-slate-700 placeholder-slate-300 bg-transparent"
                            />
                            {search && (
                                <button onClick={() => setSearch('')}>
                                    <X size={16} className="text-slate-300 hover:text-slate-700 transition-colors" />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1 max-h-[620px] custom-scrollbar">
                            {filtered.length === 0 && (
                                <div className="p-8 text-center text-slate-400 font-bold text-sm">ไม่พบอาคาร</div>
                            )}
                            {filtered.map((b) => (
                                <motion.button
                                    key={b.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelected(b)}
                                    className={`w-full text-left px-6 py-4 border-b border-slate-100 transition-all flex items-start gap-4 group ${
                                        selected?.id === b.id
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    {/* Number badge */}
                                    <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-black text-xs border-2 transition-colors ${
                                        selected?.id === b.id
                                            ? 'border-yru-pink text-yru-pink bg-transparent'
                                            : 'border-slate-200 text-slate-400 group-hover:border-yru-pink group-hover:text-yru-pink'
                                    }`}>
                                        {b.id.toString().length > 3 ? '★' : b.id}
                                    </span>
                                    <div className="min-w-0">
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${selected?.id === b.id ? 'text-yru-pink' : 'text-slate-400'}`}>
                                            อาคาร {b.id}
                                        </div>
                                        <div className={`font-black text-sm leading-tight ${selected?.id === b.id ? 'text-white' : 'text-slate-700'}`}>
                                            {b.name}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Stats bar */}
                        <div className="border-t-2 border-slate-200 px-6 py-3 bg-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-yru-pink rotate-45 flex-shrink-0" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {filtered.length} อาคาร / สถานที่
                            </span>
                        </div>
                    </div>

                    {/* ─── RIGHT: Map ─── */}
                    <div className="relative h-[680px] flex flex-col">
                        <MapContainer
                            center={center}
                            zoom={17}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                        >
                            <TileLayer
                                key={mapType}
                                attribution={tileLayers[mapType].attribution}
                                url={tileLayers[mapType].url}
                            />

                            {buildings.map((b) => (
                                <Marker
                                    key={b.id}
                                    position={[b.lat, b.lng]}
                                    icon={createBuildingIcon(b.id, selected?.id === b.id)}
                                    eventHandlers={{ click: () => setSelected(b) }}
                                >
                                    <Popup>
                                        <div className="min-w-[200px]">
                                            <img
                                                src={b.image}
                                                alt={b.name}
                                                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block', marginBottom: '10px' }}
                                            />
                                            <div style={{ fontSize: '9px', fontWeight: 900, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2px' }}>
                                                อาคาร {b.id}
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 900, fontStyle: 'normal', color: '#1e293b', marginBottom: '10px', lineHeight: 1.3 }}>
                                                {b.name}
                                            </div>
                                            <button
                                                onClick={() => openNav(b.lat, b.lng)}
                                                style={{
                                                    width: '100%', background: '#1e293b', color: '#fff',
                                                    border: 'none', padding: '9px 0', fontWeight: 900,
                                                    fontSize: '11px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#ec4899'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
                                            >
                                                <Navigation size={12} /> นำทาง Google Maps
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {selected && <MapRecenter coords={[selected.lat, selected.lng]} />}
                        </MapContainer>

                        {/* Selected Banner */}
                        <AnimatePresence>
                            {selected && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-0 left-0 right-0 z-[500] bg-slate-900 border-t-4 border-yru-pink flex items-center gap-4 px-6 py-4"
                                >
                                    <img
                                        src={selected.image}
                                        alt={selected.name}
                                        className="w-12 h-12 object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[9px] font-black text-yru-pink uppercase tracking-[0.3em]">อาคาร {selected.id}</div>
                                        <div className="text-white font-black text-sm truncate">{selected.name}</div>
                                    </div>
                                    <button
                                        onClick={() => openNav(selected.lat, selected.lng)}
                                        className="flex-shrink-0 bg-yru-pink text-white px-5 py-2.5 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-yru-dark-pink transition-colors"
                                    >
                                        <Navigation size={13} /> นำทาง
                                    </button>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="flex-shrink-0 text-slate-500 hover:text-white p-1 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                </>
                )}

                {/* Info note bar */}
                <div className="border-2 border-slate-200 border-t-0 px-8 py-5 bg-white flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="border-l-4 border-yru-pink pl-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">หมายเหตุ</p>
                        <p className="text-sm font-bold text-slate-500">
                            พิกัดอาคารเป็นค่าโดยประมาณ หากพิกัดไม่ตรง สามารถกดปุ่ม "นำทาง" เพื่อค้นหาผ่าน Google Maps ได้โดยตรง
                        </p>
                    </div>
                    <div className="md:ml-auto flex-shrink-0">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            มหาวิทยาลัยราชภัฏยะลา · 133 ถ.เทศบาล 3 ต.สะเตง อ.เมือง จ.ยะลา
                        </span>
                    </div>
                </div>
            </div>

            {/* Reference Image Modal */}
            <AnimatePresence>
                {showRefImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setShowRefImage(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-4xl w-full bg-white shadow-2xl border-t-4 border-yru-pink"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="px-8 py-5 border-b-2 border-slate-100 flex items-center gap-4">
                                <div className="bg-slate-900 p-2">
                                    <Info size={20} className="text-yru-pink" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                    แผนผังอ้างอิง มรย.
                                </h3>
                                <button
                                    onClick={() => setShowRefImage(false)}
                                    className="ml-auto p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="p-4 max-h-[75vh] overflow-auto">
                                <img
                                    src="/images/mapsdata.png"
                                    alt="Reference Map YRU"
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; }
                .leaflet-popup-content-wrapper {
                    border-radius: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    border: 2px solid #f1f5f9 !important;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.12) !important;
                }
                .leaflet-popup-content { margin: 12px !important; }
                .leaflet-popup-tip-container { display: none !important; }

                /* Custom Building Marker */
                .building-marker {
                    width: 36px;
                    height: 44px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
                }
                .building-marker::before {
                    content: '';
                    width: 36px;
                    height: 36px;
                    background: #dc2626;
                    border: 3px solid #fff;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(220,38,38,0.4);
                }
                .building-marker::after {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #dc2626;
                    border-radius: 50%;
                    margin-top: 2px;
                }
                .building-marker__id {
                    position: absolute;
                    top: 4px;
                    left: 0;
                    width: 36px;
                    text-align: center;
                    font-size: 10px;
                    font-weight: 900;
                    color: #fff;
                    line-height: 1;
                    pointer-events: none;
                    letter-spacing: -0.02em;
                }
                .building-marker--selected::before {
                    width: 44px;
                    height: 44px;
                    background: #ec4899;
                    box-shadow: 0 4px 16px rgba(236,72,153,0.5);
                    border-color: #fff;
                }
                .building-marker--selected::after {
                    background: #ec4899;
                }
                .building-marker--selected .building-marker__id {
                    width: 44px;
                    font-size: 11px;
                    top: 5px;
                }
            `}</style>
        </div>
    );
}

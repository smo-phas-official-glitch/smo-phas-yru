import React from 'react';

const FacebookFeed = ({
  pageUrl = "https://www.facebook.com/profile.php?id=61586876716834", // อัปเดตให้ตรงกับเพจสโมสรนักศึกษาคณะสาธารณะสุขฯ มรย.
  width = 500,
  height = 800
}) => {
  return (
    <div className="flex justify-center w-full bg-white p-4 shadow-2xl border border-slate-100">
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(pageUrl)}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Page Feed"
      ></iframe>
    </div>
  );
};

export default FacebookFeed;

# คู่มือการนำเว็บไปเป็นโครงสำหรับคณะอื่นๆ (Template Guide) แบบละเอียด

โปรเจกต์นี้ถูกออกแบบมาเพื่อให้สามารถนำไปปรับใช้เป็นระบบจองห้องและระบบจัดการข้อมูลสำหรับคณะอื่นๆ ได้ โดยคุณสามารถเปลี่ยนข้อมูล สีสัน และการตั้งค่าต่างๆ ได้ตามขั้นตอนด้านล่างนี้

---

## ส่วนที่ 1: การเตรียมตัวและปรับแต่งหน้าตา (UI & Data)

### 1. การติดตั้งเริ่มต้น
1. Clone หรือ Fork โปรเจกต์นี้ไปยังเครื่องของคุณ
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรันคำสั่งติดตั้ง Dependencies:
   ```bash
   npm install
   ```

### 2. การเปลี่ยนชื่อเว็บและโลโก้
- **ชื่อเว็บไซต์ (Title):** เปิดไฟล์ `index.html` แล้วแก้ไขแท็ก `<title>ชื่อคณะของคุณ</title>`
- **โลโก้เว็บ (Favicon):** นำไฟล์โลโก้ของคณะคุณไปวางในโฟลเดอร์ `public` (เช่น `favicon.ico` หรือ `logo.png`) แล้วอัปเดตพาธในแท็ก `<link rel="icon" ...>` ในไฟล์ `index.html`

### 3. การเปลี่ยนสีประจำคณะ (Theme Colors)
ระบบถูกออกแบบมาให้เปลี่ยนสีได้ง่ายๆ ผ่าน CSS Variables
1. ไปที่ไฟล์ `src/index.css`
2. ค้นหาส่วนของ **DESIGN TOKENS** (ประมาณบรรทัดที่ 37)
3. เปลี่ยนรหัสสี (Hex code) ให้เป็นสีประจำคณะของคุณ:
   ```css
   @theme {
     --color-yru-pink: #รหัสสีหลักของคุณ;      /* สีหลัก */
     --color-yru-dark-pink: #รหัสสีเข้มของคุณ; /* สีเข้มสำหรับทำ Gradient */
     /* ...ตัวแปรอื่นๆ... */
   }
   ```

### 4. เทคนิคการจัดการรูปภาพ (ลบพื้นหลัง & ฝากรูปฟรี)
- **การลบพื้นหลัง (Remove Background):** เพื่อให้เว็บดูสวยงาม แนะนำให้ใช้รูปตึกหรือห้องที่ลบพื้นหลังออกแล้ว (เป็นไฟล์ `.png` โปร่งใส) 
  - *เว็บลบพื้นหลังฟรีแนะนำ:* [remove.bg](https://www.remove.bg/th), [Photoroom](https://www.photoroom.com/tools/background-remover) หรือ [Adobe Express](https://express.adobe.com/tools/remove-background)
- **การอัปโหลดเพื่อเอา URL (ฝากรูปฟรี):** หากไม่ต้องการนำไฟล์รูปมาใส่ในโปรเจกต์โดยตรง สามารถฝากรูปออนไลน์แล้วนำลิงก์มาใส่ได้
  - *เว็บฝากรูปฟรีแนะนำ:* 
    1. **[Imgur](https://imgur.com/upload)**: อัปโหลดเสร็จให้คลิกขวาที่รูปแล้วเลือก "Copy image address" (คัดลอกที่อยู่รูปภาพ) ลิงก์ที่ได้จะลงท้ายด้วย `.png` หรือ `.jpg`
    2. **[Postimages](https://postimages.org/)**: อัปโหลดแล้วเลือกคัดลอกลิงก์ในช่อง "Direct link" (ลิงก์ตรงสำหรับหน้าบอร์ด)
    3. **Discord**: นำรูปไปส่งในห้องแชท Discord ส่วนตัว คลิกขวาที่รูปแล้วเลือก "Copy Image Link" นำมาใช้ได้เลย

---

## ส่วนที่ 2: การตั้งค่าระบบหลังบ้าน (Backend & Config)

ระบบนี้ใช้ Google Apps Script เป็นฐานข้อมูล (แทน Database แบบดั้งเดิม) และ EmailJS สำหรับส่งอีเมลแจ้งเตือน

### 1. การตั้งค่า Google Apps Script (ฐานข้อมูลระบบจอง)
1. ไปที่โฟลเดอร์ `google-apps-script` ในโปรเจกต์นี้
2. เปิดไฟล์ `Code.gs` และก๊อปปี้โค้ดทั้งหมด
3. ไปที่ Google Drive ของคณะ > สร้าง **Google Sheets** ใหม่ (สำหรับเก็บข้อมูลการจอง)
4. ใน Google Sheets ไปที่เมนู **ส่วนขยาย (Extensions) > Apps Script**
5. วางโค้ดที่ก๊อปปี้มาทับโค้ดเดิม แล้วกดบันทึก (Save)
6. กด **ทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้รายการใหม่ (New deployment)**
7. เลือกประเภทเป็น **เว็บแอป (Web App)**
8. ตั้งค่า:
   - สิทธิ์การเข้าถึง (Who has access): **ทุกคน (Anyone)**
9. กด **ทำให้ใช้งานได้** (และกดยอมรับสิทธิ์การเข้าถึงบัญชี Google)
10. คุณจะได้ **URL ของเว็บแอป (Web App URL)** (ก๊อปปี้เก็บไว้)

### 2. การตั้งค่า EmailJS (ระบบส่งอีเมล)
1. ไปที่เว็บ [EmailJS](https://www.emailjs.com/) และสมัครสมาชิก/เข้าสู่ระบบ
2. ไปที่ **Email Services** > Add New Service (เลือก Gmail) แล้วทำการเชื่อมต่ออีเมลคณะ > คุณจะได้ **Service ID**
3. ไปที่ **Email Templates** > Create New Template
   - ออกแบบอีเมลตามต้องการ (สามารถรับค่าตัวแปรจากเว็บได้เช่น `{{studentName}}`)
   - บันทึกแล้วคุณจะได้ **Template ID**
4. ไปที่ **Account** (มุมซ้าย) > คุณจะได้ **Public Key**

### 3. นำค่าทั้งหมดมาใส่ใน Environment Variables
สร้างไฟล์ชื่อ `.env` ไว้ที่โฟลเดอร์นอกสุดของโปรเจกต์ (Root) และใส่ค่าที่ได้มาจากข้อ 1 และข้อ 2 ดังนี้:

```env
# เอา URL จาก Google Apps Script มาใส่ตรงนี้
VITE_GAS_WEBAPP_URL=https://script.google.com/macros/s/xxxxxxxxxxxx/exec

# เอาค่าจาก EmailJS มาใส่ตรงนี้
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxx
VITE_EMAILJS_SERVICE_ID=xxxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=xxxxxxxxx
```
*(ทดสอบรันเว็บในเครื่องด้วยคำสั่ง `npm run dev` เพื่อดูผลลัพธ์)*

---

## ส่วนที่ 3: วิธีการ Deploy ขึ้น Production (Vercel)

เมื่อทุกอย่างพร้อมแล้ว ขั้นตอนสุดท้ายคือการนำเว็บขึ้นออนไลน์ฟรีผ่าน Vercel

### 1. เอาโค้ดขึ้น GitHub
1. สร้าง Repository ใหม่บน GitHub ของคุณ/คณะ
2. Push โค้ดทั้งหมดขึ้น GitHub
   ```bash
   git add .
   git commit -m "Initial commit for new faculty"
   git push origin main
   ```

### 2. นำขึ้น Vercel ผ่าน Dashboard (ง่ายที่สุด)
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. ล็อกอินด้วย GitHub แล้วคลิกปุ่ม **"Add New..." > "Project"**
3. ค้นหา Repository ที่เพิ่งอัปโหลดไป แล้วคลิก **Import**
4. ขยายเมนู **"Environment Variables"**
5. เพิ่มตัวแปรทั้งหมดที่มีในไฟล์ `.env` เข้าไป (VITE_GAS_WEBAPP_URL และ VITE_EMAILJS ทั้ง 3 ตัว) โดยใส่ Name และ Value ทีละชุดแล้วกด Add
6. ตรวจสอบให้แน่ใจว่า Framework Preset ถูกตั้งเป็น `Vite`
7. คลิกปุ่ม **Deploy**
8. รอประมาณ 1-2 นาที คุณก็จะได้ลิงก์เว็บไซต์คณะใหม่ที่พร้อมใช้งานทันที!

---
**คำแนะนำเพิ่มเติม:** หากมีการแก้ไขโค้ดและ Push ขึ้น GitHub รอบถัดไป Vercel จะทำการ Deploy อัปเดตให้โดยอัตโนมัติ (Continuous Integration)

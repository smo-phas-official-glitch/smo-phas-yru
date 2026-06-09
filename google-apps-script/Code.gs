/**
 * =============================================================
 *  YRU Student Council — Generic Backend
 *  Google Apps Script Backend (Code.gs)
 * =============================================================
 */

const ADMIN_PASSWORD  = 'Smophas@256999';

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const table = e.parameter.table || 'คำร้อง';
    const action = e.parameter.action || 'public';
    const password = e.parameter.password || '';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(table);
    if (!sheet) return createResponse({ success: true, data: [] });

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return createResponse({ success: true, data: [] });

    const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    const values = dataRange.getDisplayValues(); // Use display values to keep formatting
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    let data = [];
    for (let i = 0; i < values.length; i++) {
      let rowObj = { rowIndex: i + 2 };
      for (let j = 0; j < headers.length; j++) {
        rowObj[headers[j]] = values[i][j];
      }
      data.push(rowObj);
    }

    if (action !== 'admin' && table === 'คำร้อง') {
      data = data.map(r => ({
        id: r['ลำดับ'], timestamp: r['วันที่ยื่น'], subject: r['หัวข้อ'], status: r['สถานะ'], updated_at: r['อัพเดทล่าสุด']
      }));
    }

    return createResponse({ success: true, data: data });
  } catch (err) {
    return createResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const table = body.table || 'คำร้อง';
    const action = body.action || 'submit';
    const password = body.password || '';

    // Authentication for admin actions
    if (!(table === 'คำร้อง' && action === 'submit')) {
      if (password !== ADMIN_PASSWORD) {
        return createResponse({ success: false, error: 'รหัสผ่านไม่ถูกต้อง' });
      }
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(table);

    if (action === 'submit' && table === 'คำร้อง') {
       return handleSubmitGrievance_(body, sheet, ss);
    }
    
    if (action === 'create') {
      if (!sheet) {
        sheet = ss.insertSheet(table);
        sheet.appendRow(Object.keys(body.data));
      }
      if (body.image_base64) {
        const url = saveImageToDrive_(body.image_base64, `upload_${table}`);
        body.data.image = url;
        body.data.Image = url;
      }
      
      let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Auto-append missing headers
      const newKeys = Object.keys(body.data).filter(k => !headers.includes(k) && k !== 'image_base64');
      if (newKeys.length > 0) {
        headers = headers.concat(newKeys);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }

      const newRow = headers.map(h => body.data[h] !== undefined ? body.data[h] : '');
      sheet.appendRow(newRow);
      return createResponse({ success: true, message: 'Created successfully' });
    }

    if (action === 'update') {
      if (!sheet) return createResponse({ success: false, error: 'Table not found' });
      if (body.image_base64) {
        const url = saveImageToDrive_(body.image_base64, `upload_${table}`);
        body.data.image = url;
        body.data.Image = url;
      }
      const rowIndex = body.rowIndex;
      let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Auto-append missing headers
      const newKeys = Object.keys(body.data).filter(k => !headers.includes(k) && k !== 'image_base64');
      if (newKeys.length > 0) {
        headers = headers.concat(newKeys);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }

      const newRow = headers.map(h => body.data[h] !== undefined ? body.data[h] : '');
      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
      return createResponse({ success: true, message: 'Updated successfully' });
    }

    if (action === 'delete') {
      if (!sheet) return createResponse({ success: false, error: 'Table not found' });
      sheet.deleteRow(body.rowIndex);
      return createResponse({ success: true, message: 'Deleted successfully' });
    }

    if (action === 'updateStatus' && table === 'คำร้อง') {
      return handleUpdateStatus_(body, sheet);
    }

    return createResponse({ success: false, error: 'Unknown action or table' });

  } catch (err) {
    return createResponse({ success: false, error: err.message });
  }
}

function saveImageToDrive_(base64DataRaw, prefix) {
  try {
    const folderId = '16qKC4diJEQy7-n9GpZe_OCkW24ossw3M';
    const folder = DriveApp.getFolderById(folderId);
    
    const base64Data  = base64DataRaw.split(',')[1] || base64DataRaw;
    const mimeMatch   = base64DataRaw.match(/^data:([^;]+);/);
    const mimeType    = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext         = mimeType.split('/')[1] || 'jpg';
    const fileName    = `${prefix}_${Date.now()}.${ext}`;
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
    
    // Return a direct download/view link instead of the viewer page
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (e) {
    return '[Error Uploading Image]';
  }
}

function handleSubmitGrievance_(body, sheet, ss) {
  if (!sheet) {
    sheet = ss.insertSheet('คำร้อง');
    sheet.appendRow(['ลำดับ', 'วันที่ยื่น', 'ชื่อ-นามสกุล', 'รหัสนักศึกษา', 'หัวข้อ', 'รายละเอียด', 'ลิ้งค์หลักฐาน', 'สถานะ', 'อัพเดทล่าสุด']);
  }
  const lastRow = sheet.getLastRow();
  const newId = lastRow <= 1 ? 1 : parseInt(sheet.getRange(lastRow, 1).getValue() || 0) + 1;
  const now = new Date();

  let evidenceUrl = '-';
  if (body.image_base64) {
    evidenceUrl = saveImageToDrive_(body.image_base64, `evidence_${newId}`);
  }

  const row = [newId, now, body.name || 'นิรนาม', body.student_id || '-', body.subject || '', body.message || '', evidenceUrl, 'รอดำเนินการ', now];
  sheet.appendRow(row);
  return createResponse({ success: true, id: newId, evidenceUrl: evidenceUrl });
}

function handleUpdateStatus_(body, sheet) {
  sheet.getRange(body.rowIndex, 8).setValue(body.newStatus); 
  sheet.getRange(body.rowIndex, 9).setValue(new Date()); 
  return createResponse({ success: true });
}

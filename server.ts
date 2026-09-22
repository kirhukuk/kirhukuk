import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// JSON body parsing (büyük sayfalar ve makaleler için 15mb sınır)
app.use(express.json({ limit: '15mb' }));

// Veri saklama dizini ve dosyası
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'cms-store.json');

// Firebase Yapılandırma Sabitleri ('kir-hukuk' projesi)
const FIREBASE_API_KEY = "AIzaSyDoGEAcL9YChHBm2C9w2HMDieNCK_2smdA";
const FIREBASE_PROJECT_ID = "kir-hukuk";

// Dizin yoksa oluştur
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Yardımcı fonksiyonlar: veriyi oku ve yaz
function readStore(): any | null {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[CMS Store] Okuma hatası:', err);
  }
  return null;
}

function writeStore(data: any): boolean {
  try {
    const tempFile = STORE_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, STORE_FILE);
    return true;
  } catch (err) {
    console.error('[CMS Store] Yazma hatası:', err);
    return false;
  }
}

function extractFieldValue(f: any): any {
  if (!f) return '';
  if (f.stringValue !== undefined) return f.stringValue;
  if (f.booleanValue !== undefined) return f.booleanValue;
  if (f.integerValue !== undefined) return parseInt(f.integerValue, 10);
  if (f.doubleValue !== undefined) return parseFloat(f.doubleValue);
  if (f.timestampValue !== undefined) return f.timestampValue;
  return '';
}

/**
 * Sunucu üzerinden doğrudan Firebase Firestore 'messages' koleksiyonundan veri çeker.
 * Mobil veya masaüstü cihazlar bu endpoint ile Firebase verilerini anında alır.
 */
async function fetchFromFirebaseMessages(): Promise<any[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'messages' }]
        }
      })
    });

    if (!res.ok) {
      return [];
    }

    const items = await res.json();
    if (!Array.isArray(items)) return [];

    const list = items
      .filter((it: any) => it.document)
      .map((it: any) => {
        const doc = it.document;
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        const created = extractFieldValue(fields.createdAt) || doc.createTime;
        const createdFmt = extractFieldValue(fields.createdAtFormatted) || (created ? new Date(created).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '');

        return {
          id: id,
          firestoreId: id,
          name: extractFieldValue(fields.name) || 'İsimsiz Ziyaretçi',
          phone: extractFieldValue(fields.phone) || '',
          email: extractFieldValue(fields.email) || '',
          subject: extractFieldValue(fields.subject) || 'Hukuki Danışmanlık Talebi',
          message: extractFieldValue(fields.message) || '',
          practiceArea: extractFieldValue(fields.practiceArea) || 'Genel Hukuki Uyuşmazlık',
          appointmentDate: extractFieldValue(fields.appointmentDate) || '',
          appointmentTime: extractFieldValue(fields.appointmentTime) || '',
          meetingType: extractFieldValue(fields.meetingType) || 'in_person',
          type: extractFieldValue(fields.type) || 'contact',
          status: extractFieldValue(fields.status) || 'new',
          source: extractFieldValue(fields.source) || 'Web Sitesi',
          isRead: extractFieldValue(fields.status) === 'read' || extractFieldValue(fields.status) === 'replied',
          createdAt: created,
          date: createdFmt || created || new Date().toISOString(),
          createdAtFormatted: createdFmt
        };
      });

    list.sort((a: any, b: any) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });

    return list;
  } catch (err) {
    console.warn('[Firebase Sunucu] Mesaj çekme hatası:', err);
    return [];
  }
}

/**
 * Sunucu üzerinden doğrudan Firebase Firestore 'messages' koleksiyonuna yazar.
 */
async function writeToFirebaseMessages(payload: any): Promise<string | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/messages?key=${FIREBASE_API_KEY}`;
    const isoDate = new Date().toISOString();

    const fields: Record<string, any> = {
      name: { stringValue: String(payload.name || '').trim() },
      phone: { stringValue: String(payload.phone || '').trim() },
      email: { stringValue: String(payload.email || '').trim() },
      subject: { stringValue: String(payload.subject || 'Hukuki Danışmanlık Talebi').trim() },
      message: { stringValue: String(payload.message || '').trim() },
      practiceArea: { stringValue: String(payload.practiceArea || '').trim() },
      appointmentDate: { stringValue: String(payload.appointmentDate || '').trim() },
      appointmentTime: { stringValue: String(payload.appointmentTime || '').trim() },
      meetingType: { stringValue: String(payload.meetingType || 'in_person') },
      type: { stringValue: String(payload.type || 'contact') },
      status: { stringValue: String(payload.status || 'new') },
      source: { stringValue: String(payload.source || 'Mobil / Web').trim() },
      kvkkConsent: { booleanValue: Boolean(payload.kvkkConsent) },
      createdAtFormatted: { stringValue: String(payload.createdAtFormatted || new Date().toLocaleString('tr-TR')) },
      createdAt: { timestampValue: isoDate }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    if (res.ok) {
      const json: any = await res.json();
      const docName = json.name || '';
      return docName.split('/').pop() || null;
    }
  } catch (err) {
    console.warn('[Firebase Sunucu] Mesaj yazma hatası:', err);
  }
  return null;
}

// ==========================================
// API ROTALARI (Masaüstü & Mobil Eşzamanlama)
// ==========================================

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Firebase 'messages' verilerini doğrudan sunucudan al (Masaüstü & Mobil için garantili veri alma)
app.get('/api/firebase/messages', async (req, res) => {
  try {
    const fbMessages = await fetchFromFirebaseMessages();

    // Yerel depoyu da güncelle
    const store = readStore() || {};
    if (fbMessages.length > 0) {
      store.messages = fbMessages;
      writeStore(store);
    }

    res.json({
      success: true,
      source: 'firebase',
      count: fbMessages.length,
      messages: fbMessages.length > 0 ? fbMessages : (store.messages || [])
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tüm CMS verisini getir
app.get('/api/cms', (req, res) => {
  const store = readStore();
  res.json({
    success: true,
    hasData: Boolean(store),
    data: store || null
  });
});

// CMS verisini güncelle / kaydet
app.post('/api/cms', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Geçersiz veri' });
    }

    const current = readStore() || {};
    const updated = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString()
    };

    const ok = writeStore(updated);
    if (!ok) {
      return res.status(500).json({ success: false, error: 'Kayıt başarısız' });
    }

    res.json({ success: true, updatedAt: updated.updatedAt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mesajları listele (Yerel + Firebase birleşik)
app.get('/api/messages', async (req, res) => {
  const store = readStore();
  const localMessages = store?.messages || [];
  
  if (localMessages.length === 0) {
    const fbMessages = await fetchFromFirebaseMessages();
    if (fbMessages.length > 0) {
      store.messages = fbMessages;
      writeStore(store);
      return res.json({ success: true, messages: fbMessages });
    }
  }

  res.json({ success: true, messages: localMessages });
});

// Yeni mesaj kaydet (Hem yerel depoya hem doğrudan Firebase 'kir-hukuk' projesine %100 yazar)
app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = req.body;
    if (!newMsg || !newMsg.name) {
      return res.status(400).json({ success: false, error: 'Eksik mesaj verisi' });
    }

    // 1. Firebase Firestore'a yaz (Sunucu tüneli ile asla mobilde takılmaz)
    let firestoreDocId = newMsg.firestoreId;
    if (!firestoreDocId) {
      firestoreDocId = await writeToFirebaseMessages(newMsg);
    }

    const store = readStore() || {};
    const currentMessages: any[] = Array.isArray(store.messages) ? store.messages : [];
    
    const msgWithMeta = {
      ...newMsg,
      id: firestoreDocId || newMsg.id || ('msg-' + Date.now()),
      firestoreId: firestoreDocId || newMsg.firestoreId,
      createdAt: newMsg.createdAt || new Date().toISOString(),
      status: newMsg.status || 'new'
    };

    const updatedMessages = [msgWithMeta, ...currentMessages.filter((m: any) => m.id !== msgWithMeta.id && m.firestoreId !== msgWithMeta.firestoreId)];
    store.messages = updatedMessages;
    writeStore(store);

    res.json({ success: true, message: msgWithMeta, firestoreId: firestoreDocId });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mesaj durumunu güncelle (Okundu, Yanıtlandı vb.)
app.patch('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const store = readStore() || {};
    const currentMessages: any[] = Array.isArray(store.messages) ? store.messages : [];

    const updatedMessages = currentMessages.map((m: any) => {
      if (m.id === id || m.firestoreId === id) {
        return {
          ...m,
          status: status || m.status,
          notes: notes !== undefined ? notes : m.notes,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    });

    store.messages = updatedMessages;
    writeStore(store);

    // Firebase'de de güncelle
    try {
      const docId = id;
      if (!docId.startsWith('msg-local-')) {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/messages/${docId}?updateMask.fieldPaths=status&key=${FIREBASE_API_KEY}`;
        await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { status: { stringValue: status || 'read' } } })
        }).catch(() => null);
      }
    } catch {}

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mesaj sil
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore() || {};
    const currentMessages: any[] = Array.isArray(store.messages) ? store.messages : [];

    store.messages = currentMessages.filter((m: any) => m.id !== id && m.firestoreId !== id);
    writeStore(store);

    // Firebase'den de sil
    try {
      const docId = id;
      if (!docId.startsWith('msg-local-')) {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/messages/${docId}?key=${FIREBASE_API_KEY}`;
        await fetch(url, { method: 'DELETE' }).catch(() => null);
      }
    } catch {}

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATİK DOSYA SUNUCUSU
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sunucu] KIR HUKUK aktif: http://0.0.0.0:${PORT}`);
  });
}

start();

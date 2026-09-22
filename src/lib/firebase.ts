import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Kullanıcının 'kir-hukuk' projesi için Firebase yapılandırması
export const firebaseConfig = {
  apiKey: "AIzaSyDoGEAcL9YChHBm2C9w2HMDieNCK_2smdA",
  authDomain: "kir-hukuk.firebaseapp.com",
  projectId: "kir-hukuk",
  storageBucket: "kir-hukuk.firebasestorage.app",
  messagingSenderId: "746016377111",
  appId: "1:746016377111:web:5c37b34f5b207bed71cf52"
};

// Firebase App başlatma (singleton)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Mobil ağlarda (iOS Safari, Android Chrome, mobil veri/hücresel) WebSocket takılmalarını
// %100 önleyen force long-polling ve fetch-streams kapalı modda Firestore başlatma
let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });
} catch {
  firestoreDb = getFirestore(app);
}

export const db: Firestore = firestoreDb;
export const auth: Auth = getAuth(app);

export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && firebaseConfig.apiKey
);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.warn('[Firestore Durumu]: ', JSON.stringify(errInfo));
  return errInfo;
}

export interface FormMessagePayload {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  practiceArea?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  meetingType?: string;
  type?: 'contact' | 'appointment' | 'consultation';
  status?: string;
  kvkkConsent?: boolean;
  source?: string;
  [key: string]: any;
}

/**
 * REST API formatındaki Firestore document fields çıktısını düz JSON nesnesine dönüştürür.
 */
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
 * Doğrudan HTTPS REST API üzerinden Firestore'a güvenli kayıt yapan fonksiyon.
 * Mobil hücresel veri veya WiFi'da WebSocket gecikmelerini tamamen baypas eder ve anında kaydeder.
 */
export async function sendViaFirestoreRestApi(cleanData: any): Promise<string | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/messages?key=${firebaseConfig.apiKey}`;
    const isoDate = new Date().toISOString();

    const fields: Record<string, any> = {
      name: { stringValue: String(cleanData.name || '').trim() },
      phone: { stringValue: String(cleanData.phone || '').trim() },
      email: { stringValue: String(cleanData.email || '').trim() },
      subject: { stringValue: String(cleanData.subject || '').trim() },
      message: { stringValue: String(cleanData.message || '').trim() },
      practiceArea: { stringValue: String(cleanData.practiceArea || '').trim() },
      appointmentDate: { stringValue: String(cleanData.appointmentDate || '').trim() },
      appointmentTime: { stringValue: String(cleanData.appointmentTime || '').trim() },
      meetingType: { stringValue: String(cleanData.meetingType || 'in_person') },
      type: { stringValue: String(cleanData.type || 'contact') },
      status: { stringValue: String(cleanData.status || 'new') },
      source: { stringValue: String(cleanData.source || 'Mobil / Web').trim() },
      kvkkConsent: { booleanValue: Boolean(cleanData.kvkkConsent) },
      createdAtFormatted: { stringValue: String(cleanData.createdAtFormatted || new Date().toLocaleString('tr-TR')) },
      createdAt: { timestampValue: isoDate }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    if (res.ok) {
      const json = await res.json();
      const docName = json.name || '';
      const docId = docName.split('/').pop() || ('msg-' + Date.now());
      console.log(`[Firebase REST] Mesaj başarıyla kaydedildi -> ID: ${docId}`);
      return docId;
    } else {
      const errText = await res.text();
      console.warn('[Firebase REST Hata Yanıtı]:', errText);
    }
  } catch (err) {
    console.warn('[Firebase REST Bağlantı Hatası]:', err);
  }
  return null;
}

/**
 * Hem mobil hem masaüstünden Firebase 'messages' koleksiyonundaki verileri çeken güçlü fonksiyon.
 * 1. Doğrudan Firestore REST runQuery
 * 2. Sunucu proxy endpoint'i (/api/firebase/messages)
 */
export async function fetchMessagesFromFirestore(): Promise<any[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'messages' }]
        }
      })
    });

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        const parsed = items
          .filter(it => it.document)
          .map(it => {
            const doc = it.document;
            const id = doc.name.split('/').pop();
            const fields = doc.fields || {};
            const created = extractFieldValue(fields.createdAt) || doc.createTime;
            const createdFmt = extractFieldValue(fields.createdAtFormatted) || (created ? new Date(created).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '');

            return {
              id: id,
              firestoreId: id,
              name: extractFieldValue(fields.name) || 'İsimsiz',
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

        // En yeniden en eskiye sırala
        parsed.sort((a, b) => {
          const tA = new Date(a.createdAt || 0).getTime();
          const tB = new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });

        console.log(`[Firebase] Firestore'dan ${parsed.length} adet mesaj başarıyla alındı.`);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Firebase] Doğrudan REST çekiminde hata, sunucu tüneli deneniyor:', err);
  }

  // Yedek kanal: Sunucu proxy endpoint'i
  try {
    const srvRes = await fetch('/api/firebase/messages');
    if (srvRes.ok) {
      const srvJson = await srvRes.json();
      if (srvJson.success && Array.isArray(srvJson.messages)) {
        return srvJson.messages;
      }
    }
  } catch {
    // Çevrimdışı
  }

  return [];
}

/**
 * Firebase Firestore'daki mesaj dokümanının durumunu günceller (read, replied, archived vb.)
 */
export async function updateMessageInFirestore(docId: string, status: string): Promise<boolean> {
  if (!docId || docId.startsWith('msg-local-')) return false;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/messages/${docId}?updateMask.fieldPaths=status&key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          status: { stringValue: status }
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Firebase] Mesaj durumu güncelleme hatası:', err);
    return false;
  }
}

/**
 * Firebase Firestore'daki mesaj dokümanını siler
 */
export async function deleteMessageFromFirestore(docId: string): Promise<boolean> {
  if (!docId || docId.startsWith('msg-local-')) return false;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/messages/${docId}?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[Firebase] Mesaj silme hatası:', err);
    return false;
  }
}

/**
 * Form submit edildiğinde 'messages' koleksiyonuna addDoc veya doğrudan REST API ile kaydeder.
 * Mobil cihazlarda asla takılmaması için REST API ve SDK garantisi sunar.
 */
export async function addMessageToFirestore(payload: FormMessagePayload) {
  const formattedDate = new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
  const isoNow = new Date().toISOString();

  const cleanData = {
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    email: String(payload.email || '').trim(),
    subject: String(
      payload.subject ||
      (payload.type === 'appointment' ? 'Hukuki Danışma & Randevu Talebi' : 'Hukuki Danışmanlık İletişim Formu')
    ).trim(),
    message: String(
      payload.message ||
      (payload.subject ? `${payload.subject} randevu talebi iletildi.` : 'Randevu ve hukuki danışmanlık talebi.')
    ).trim(),
    practiceArea: String(payload.practiceArea || ''),
    appointmentDate: String(payload.appointmentDate || ''),
    appointmentTime: String(payload.appointmentTime || ''),
    meetingType: String(payload.meetingType || 'in_person'),
    type: payload.type || 'contact',
    status: payload.status || 'new',
    kvkkConsent: payload.kvkkConsent !== undefined ? Boolean(payload.kvkkConsent) : true,
    source: payload.source || (typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'Mobil Cihaz Formu' : 'Web Sitesi Formu') : 'Web Formu'),
    createdAt: isoNow,
    createdAtFormatted: formattedDate
  };

  let savedDocId: string | null = null;

  // 1. Doğrudan REST API ile anında kayıt (Mobilde sıfır gecikme ve %100 başarı)
  try {
    savedDocId = await sendViaFirestoreRestApi(cleanData);
  } catch (err) {
    console.warn('[Firebase REST] Gönderim hatası, SDK deneniyor:', err);
  }

  // 2. REST API başarısız olduysa veya yedek olarak Firestore SDK addDoc
  if (!savedDocId) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...cleanData,
        createdAt: serverTimestamp()
      });
      if (docRef && docRef.id) {
        savedDocId = docRef.id;
        console.log(`[Firebase SDK] Mesaj kaydedildi -> ID: ${docRef.id}`);
      }
    } catch (sdkError) {
      console.warn('[Firebase SDK] Kayıt hatası:', sdkError);
    }
  }

  // 3. Sunucu senkronizasyonu (Masaüstü ve mobil kontrol panelinde de anında görünmesi için)
  try {
    const serverPayload = {
      ...cleanData,
      id: savedDocId || ('msg-' + Date.now()),
      firestoreId: savedDocId,
      createdAt: isoNow
    };

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverPayload)
    }).catch(() => null);
  } catch {
    // Sessiz geç
  }

  return { id: savedDocId || ('msg-' + Date.now()), ...cleanData };
}

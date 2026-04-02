// ============================================================
// FIRESTORE OPERATIONS — SwiftShip
// All database reads/writes centralized here
// ============================================================

import { db } from '../firebase-config.js';
import {
  collection, doc, getDocs, getDoc, addDoc, setDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ══════════════════════════════════════════════════════════════
// COURIERS
// ══════════════════════════════════════════════════════════════

export async function getCouriers(activeOnly = false) {
  const ref = collection(db, 'couriers');
  const q = activeOnly
    ? query(ref, where('is_active', '==', true))
    : query(ref, orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCourier(data) {
  const ref = collection(db, 'couriers');
  return await addDoc(ref, { ...data, createdAt: serverTimestamp() });
}

export async function updateCourier(id, data) {
  const ref = doc(db, 'couriers', id);
  return await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCourier(id) {
  return await deleteDoc(doc(db, 'couriers', id));
}

export async function toggleCourierStatus(id, currentStatus) {
  return await updateDoc(doc(db, 'couriers', id), {
    is_active: !currentStatus,
    updatedAt: serverTimestamp()
  });
}

// ══════════════════════════════════════════════════════════════
// RATES
// ══════════════════════════════════════════════════════════════

export async function getRates(filters = {}) {
  const ref = collection(db, 'rates');
  let q = ref;

  const constraints = [];
  if (filters.courier_name) constraints.push(where('courier_name', '==', filters.courier_name));
  if (filters.from_country) constraints.push(where('from_country', '==', filters.from_country));
  if (filters.to_country)   constraints.push(where('to_country',   '==', filters.to_country));

  if (constraints.length) q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addRate(data) {
  return await addDoc(collection(db, 'rates'), {
    ...data, createdAt: serverTimestamp()
  });
}

export async function updateRate(id, data) {
  return await updateDoc(doc(db, 'rates', id), {
    ...data, updatedAt: serverTimestamp()
  });
}

export async function deleteRate(id) {
  return await deleteDoc(doc(db, 'rates', id));
}

// ══════════════════════════════════════════════════════════════
// INQUIRIES
// ══════════════════════════════════════════════════════════════

export async function submitInquiry(data) {
  return await addDoc(collection(db, 'inquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp()
  });
}

export async function getInquiries(statusFilter = null) {
  const ref = collection(db, 'inquiries');
  const q = statusFilter
    ? query(ref, where('status', '==', statusFilter), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateInquiryStatus(id, status) {
  return await updateDoc(doc(db, 'inquiries', id), {
    status,
    updatedAt: serverTimestamp()
  });
}

// ══════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════

export async function getUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ══════════════════════════════════════════════════════════════
// SEED SAMPLE DATA (run once from admin)
// ══════════════════════════════════════════════════════════════

export async function seedSampleData() {
  // Couriers
  const couriers = [
    { name: 'DHL Express',    tracking_url: 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_id}&brand=DHL', is_active: true, logo: '🟡' },
    { name: 'FedEx',          tracking_url: 'https://www.fedex.com/fedextrack/?trknbr={tracking_id}', is_active: true, logo: '🟣' },
    { name: 'UPS',            tracking_url: 'https://www.ups.com/track?tracknum={tracking_id}', is_active: true, logo: '🟤' },
    { name: 'Aramex',         tracking_url: 'https://www.aramex.com/track/{tracking_id}', is_active: true, logo: '🔴' },
    { name: 'Blue Dart',      tracking_url: 'https://www.bluedart.com/tracking?trackFor=0&trackNo={tracking_id}', is_active: true, logo: '🔵' },
    { name: 'India Post EMS', tracking_url: 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx', is_active: false, logo: '⚪' }
  ];

  const rates = [
    {
      courier_name: 'DHL Express',
      from_country: 'India',
      to_country: 'USA',
      weight_slabs: ['0–0.5 kg', '0.5–1 kg', '1–2 kg', '2–5 kg', '5–10 kg'],
      prices: { '0–0.5 kg': '₹1,800', '0.5–1 kg': '₹2,400', '1–2 kg': '₹3,600', '2–5 kg': '₹5,200', '5–10 kg': '₹9,800' }
    },
    {
      courier_name: 'FedEx',
      from_country: 'India',
      to_country: 'USA',
      weight_slabs: ['0–0.5 kg', '0.5–1 kg', '1–2 kg', '2–5 kg', '5–10 kg'],
      prices: { '0–0.5 kg': '₹1,650', '0.5–1 kg': '₹2,200', '1–2 kg': '₹3,300', '2–5 kg': '₹4,900', '5–10 kg': '₹9,200' }
    },
    {
      courier_name: 'Aramex',
      from_country: 'India',
      to_country: 'UAE',
      weight_slabs: ['0–0.5 kg', '0.5–1 kg', '1–2 kg', '2–5 kg'],
      prices: { '0–0.5 kg': '₹900', '0.5–1 kg': '₹1,400', '1–2 kg': '₹2,100', '2–5 kg': '₹3,800' }
    },
    {
      courier_name: 'DHL Express',
      from_country: 'India',
      to_country: 'UK',
      weight_slabs: ['0–0.5 kg', '0.5–1 kg', '1–2 kg', '2–5 kg'],
      prices: { '0–0.5 kg': '₹1,600', '0.5–1 kg': '₹2,100', '1–2 kg': '₹3,200', '2–5 kg': '₹5,600' }
    }
  ];

  for (const c of couriers) {
    await addDoc(collection(db, 'couriers'), { ...c, createdAt: serverTimestamp() });
  }
  for (const r of rates) {
    await addDoc(collection(db, 'rates'), { ...r, createdAt: serverTimestamp() });
  }
}

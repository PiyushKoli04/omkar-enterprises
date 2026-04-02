# SwiftShip — International Courier Aggregator
## Setup Guide

---

## 📁 Project Structure

```
courier-app/
├── index.html              ← Homepage (tracking + hero)
├── rates.html              ← Rate comparison page
├── contact.html            ← Inquiry/contact form
├── firebase-config.js      ← Firebase config (you must update this)
├── firestore.rules         ← Paste into Firebase Console → Rules
├── css/
│   └── style.css           ← Full design system
├── js/
│   ├── auth.js             ← Authentication logic
│   ├── firestore.js        ← All Firestore operations
│   ├── ui.js               ← Reusable UI utilities
│   └── components.js       ← Navbar, Footer, Auth Modal
└── admin/
    └── admin.html          ← Full admin panel
```

---

## 🚀 Quick Setup

### Step 1: Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Google + Email/Password providers)
4. Enable **Firestore Database** (start in production mode)
5. Go to Project Settings → General → Your Apps → Add Web App
6. Copy the firebaseConfig object

### Step 2: Update firebase-config.js
```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 3: Set Firestore Security Rules
- Copy contents of `firestore.rules` into Firebase Console → Firestore → Rules
- Replace `YOUR_ADMIN_UID_HERE` with your actual admin UID (see Step 5)

### Step 4: Set CORS / Authorized Domains
- Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (e.g., `localhost`, `yourdomain.com`)

### Step 5: Get Admin UID
1. Open your app and log in with Google (or email)
2. Go to Firebase Console → Authentication → Users
3. Copy the **UID** of your admin user
4. Update `ADMIN_UID` in `firebase-config.js`
5. Update `YOUR_ADMIN_UID_HERE` in `firestore.rules`

### Step 6: Seed Sample Data
1. Deploy the app (or open locally via Live Server)
2. Log in as admin
3. Go to `/admin/admin.html` → click **Seed Data** in sidebar
4. Click **Run Seed Data** — this populates sample couriers & rates

---

## 🌐 Deployment

### Option A: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to courier-app/
firebase deploy
```

### Option B: Any Static Host
Upload all files to Netlify, Vercel, or GitHub Pages.
- Works as pure static HTML/CSS/JS
- No build step required

---

## 👤 User Roles

| Feature | Guest | Logged In | Admin |
|---------|-------|-----------|-------|
| Track shipments | ✅ | ✅ | ✅ |
| View rates | ✅ | ✅ | ✅ |
| Submit inquiry | ✅ | ✅ (auto-fill) | ✅ |
| Admin panel | ❌ | ❌ | ✅ |
| Manage couriers | ❌ | ❌ | ✅ |
| Manage rates | ❌ | ❌ | ✅ |
| Manage inquiries | ❌ | ❌ | ✅ |

---

## 📊 Firestore Collections

### `couriers/`
```json
{
  "name": "DHL Express",
  "tracking_url": "https://www.dhl.com/track?AWB={tracking_id}",
  "is_active": true,
  "logo": "🟡",
  "createdAt": "timestamp"
}
```

### `rates/`
```json
{
  "courier_name": "DHL Express",
  "from_country": "India",
  "to_country": "USA",
  "weight_slabs": ["0–0.5 kg", "0.5–1 kg", "1–2 kg"],
  "prices": {
    "0–0.5 kg": "₹1,800",
    "0.5–1 kg": "₹2,400",
    "1–2 kg":   "₹3,600"
  },
  "createdAt": "timestamp"
}
```

### `inquiries/`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "subject": "Rate Quote Request",
  "message": "Need pricing for 5kg to USA",
  "status": "new",
  "uid": "firebase-user-uid-or-null",
  "source": "guest",
  "createdAt": "timestamp"
}
```

### `users/`
```json
{
  "uid": "firebase-user-uid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "timestamp"
}
```

---

## 🎨 Design System

The app uses a dark theme with:
- **Font**: Syne (headings) + DM Sans (body)
- **Primary**: #f97316 (orange)
- **Accent**: #38bdf8 (sky blue)
- **Background**: #0a0d14 (deep dark)

---

## 🔧 Admin Panel Features

1. **Courier Manager** — Add/edit/delete couriers, toggle active status, set tracking URLs with `{tracking_id}` placeholder
2. **Rate Manager** — Create rate tables with dynamic weight slab builder, edit/delete entries
3. **Inquiry Manager** — View all inquiries, filter by status (New/In Progress/Resolved), update status with one click
4. **Seed Data** — One-click population of sample data for testing

---

## 📝 Notes

- No build tools needed — runs as pure ES modules in modern browsers
- Firebase SDK loaded via CDN (v10)
- All JavaScript is modular and organized by concern
- Responsive down to 320px viewport width
- Tracking always opens in a new tab (never embeds external URLs)


<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDxNtqP_tYD5X7sk2kryf9S4dEX-8RfKKE",
    authDomain: "couri-674bd.firebaseapp.com",
    projectId: "couri-674bd",
    storageBucket: "couri-674bd.firebasestorage.app",
    messagingSenderId: "127783621682",
    appId: "1:127783621682:web:049f444a85484eadf5d82b",
    measurementId: "G-KWM9DVBH0C"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

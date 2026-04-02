// ============================================================
// COMPONENTS MODULE — SwiftShip
// Navbar, Footer, Auth Modal, shared UI
// ============================================================

import { signInWithGoogle, loginWithEmail, registerWithEmail, logout, getCurrentUser, isAdmin, onUserChange } from './auth.js';
import { showToast, validateFields, setBtnLoading } from './ui.js';

// ── Navbar HTML ────────────────────────────────────────────
const NAVBAR_HTML = `
<nav class="navbar">
  <div class="container">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-logo">
        <div class="logo-icon">✈</div>
        Swift<span>Ship</span>
      </a>
      <ul class="navbar-nav">
        <li><a href="index.html">Home</a></li>
        <li><a href="rates.html">Rates</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li id="nav-admin-link" class="hidden"><a href="admin/admin.html">Admin Panel</a></li>
      </ul>
      <div class="navbar-actions">
        <div id="nav-guest-actions">
          <button class="btn btn-primary btn-sm" id="nav-login-btn">Sign In</button>
        </div>
        <div id="nav-user-actions" class="hidden flex gap-1">
          <div class="user-avatar" id="nav-avatar">U</div>
          <button class="btn btn-secondary btn-sm" id="nav-logout-btn">Sign Out</button>
        </div>
      </div>
      <button class="hamburger" id="hamburger-btn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div class="mobile-nav" id="mobile-nav">
  <a href="index.html">🏠 Home</a>
  <a href="rates.html">💰 Rates</a>
  <a href="contact.html">📬 Contact</a>
  <div id="mobile-admin-link" class="hidden"><a href="admin/admin.html">⚙️ Admin Panel</a></div>
  <div id="mobile-auth-area" style="margin-top:16px"></div>
</div>
`;

// ── Footer HTML ────────────────────────────────────────────
const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div class="logo-icon" style="width:32px;height:32px;background:var(--c-primary);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1rem">✈</div>
          <span style="font-family:var(--f-display);font-size:1.2rem;font-weight:800">Swift<span style="color:var(--c-primary)">Ship</span></span>
        </div>
        <p style="font-size:0.9rem;max-width:260px;margin-bottom:20px">Your trusted international courier aggregator. Compare rates, track shipments, and ship smarter.</p>
        <div style="display:flex;gap:10px">
          <a href="#" class="btn btn-secondary btn-sm btn-icon">𝕏</a>
          <a href="#" class="btn btn-secondary btn-sm btn-icon">in</a>
          <a href="#" class="btn btn-secondary btn-sm btn-icon">f</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul class="footer-links">
          <li><a href="index.html">Shipment Tracking</a></li>
          <li><a href="rates.html">Rate Comparison</a></li>
          <li><a href="contact.html">Get a Quote</a></li>
          <li><a href="contact.html">Support</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Couriers</h4>
        <ul class="footer-links">
          <li><a href="#">DHL Express</a></li>
          <li><a href="#">FedEx</a></li>
          <li><a href="#">UPS</a></li>
          <li><a href="#">Aramex</a></li>
          <li><a href="#">Blue Dart</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} SwiftShip. All rights reserved.</p>
      <p>Built for global shipping excellence.</p>
    </div>
  </div>
</footer>
`;

// ── Auth Modal HTML ────────────────────────────────────────
const AUTH_MODAL_HTML = `
<div class="modal-overlay" id="auth-modal">
  <div class="modal">
    <div class="modal-header">
      <div>
        <h3>Welcome to SwiftShip</h3>
        <p class="text-sm text-muted mt-1">Sign in to access personalized features</p>
      </div>
      <button class="modal-close btn" id="auth-modal-close">✕</button>
    </div>
    <div class="modal-tabs">
      <button class="modal-tab active" data-tab="login">Sign In</button>
      <button class="modal-tab" data-tab="register">Create Account</button>
    </div>
    <button class="btn-google" id="google-signin-btn">
      <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      Continue with Google
    </button>
    <div class="divider">or continue with email</div>

    <!-- Login Form -->
    <div id="login-form-section">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-control" id="login-email" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" id="login-password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-full" id="login-submit-btn">Sign In</button>
      </div>
    </div>

    <!-- Register Form -->
    <div id="register-form-section" class="hidden">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-control" id="reg-name" placeholder="John Doe">
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-control" id="reg-email" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password (min 6 characters)</label>
          <input type="password" class="form-control" id="reg-password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-full" id="register-submit-btn">Create Account</button>
      </div>
    </div>
  </div>
</div>
`;

// ── Inject components ──────────────────────────────────────
export function injectNavbar() {
  const slot = document.getElementById('navbar-slot');
  if (slot) slot.outerHTML = NAVBAR_HTML;
  else document.body.insertAdjacentHTML('afterbegin', NAVBAR_HTML);
}

export function injectFooter() {
  const slot = document.getElementById('footer-slot');
  if (slot) slot.outerHTML = FOOTER_HTML;
  else document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
}

export function injectAuthModal() {
  document.body.insertAdjacentHTML('beforeend', AUTH_MODAL_HTML);
}

// ── Wire up auth modal ─────────────────────────────────────
export function setupAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  // Open
  document.getElementById('nav-login-btn')?.addEventListener('click', () => openModal());

  // Close
  document.getElementById('auth-modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Tabs
  modal.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('login-form-section').classList.toggle('hidden', which !== 'login');
      document.getElementById('register-form-section').classList.toggle('hidden', which !== 'register');
    });
  });

  // Google
  document.getElementById('google-signin-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('google-signin-btn');
    btn.disabled = true;
    try {
      await signInWithGoogle();
      closeModal();
    } finally {
      btn.disabled = false;
    }
  });

  // Email login
  document.getElementById('login-submit-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('login-submit-btn');
    const email = document.getElementById('login-email').value;
    const pass  = document.getElementById('login-password').value;
    if (!validateFields([
      { value: email, message: 'Please enter your email.' },
      { value: pass,  message: 'Please enter your password.' }
    ])) return;
    setBtnLoading(btn, true);
    try { await loginWithEmail(email, pass); closeModal(); }
    finally { setBtnLoading(btn, false, 'Sign In'); }
  });

  // Email register
  document.getElementById('register-submit-btn')?.addEventListener('click', async () => {
    const btn  = document.getElementById('register-submit-btn');
    const name = document.getElementById('reg-name').value;
    const email= document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    if (!validateFields([
      { value: name,  message: 'Please enter your full name.' },
      { value: email, message: 'Please enter your email.' },
      { value: pass,  message: 'Please enter a password.' }
    ])) return;
    if (pass.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
    setBtnLoading(btn, true);
    try { await registerWithEmail(name, email, pass); closeModal(); }
    finally { setBtnLoading(btn, false, 'Create Account'); }
  });
}

function openModal()  { document.getElementById('auth-modal')?.classList.add('open'); }
function closeModal() { document.getElementById('auth-modal')?.classList.remove('open'); }

// ── Wire navbar auth state ─────────────────────────────────
export function setupNavbarAuth() {
  onUserChange(user => {
    const guestEl  = document.getElementById('nav-guest-actions');
    const userEl   = document.getElementById('nav-user-actions');
    const avatar   = document.getElementById('nav-avatar');
    const adminLink = document.getElementById('nav-admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    const mobileAuth = document.getElementById('mobile-auth-area');

    if (user) {
      guestEl?.classList.add('hidden');
      userEl?.classList.remove('hidden');
      if (avatar) {
        const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        avatar.textContent = initials;
        avatar.title = user.displayName || user.email;
      }
      if (isAdmin()) {
        adminLink?.classList.remove('hidden');
        mobileAdminLink?.classList.remove('hidden');
      }
      if (mobileAuth) mobileAuth.innerHTML = `<button class="btn btn-secondary btn-full" id="mobile-logout">Sign Out</button>`;
      document.getElementById('mobile-logout')?.addEventListener('click', logout);
    } else {
      guestEl?.classList.remove('hidden');
      userEl?.classList.add('hidden');
      adminLink?.classList.add('hidden');
      mobileAdminLink?.classList.add('hidden');
      if (mobileAuth) mobileAuth.innerHTML = `<button class="btn btn-primary btn-full" id="mobile-login">Sign In</button>`;
      document.getElementById('mobile-login')?.addEventListener('click', () => openModal());
    }
  });

  document.getElementById('nav-logout-btn')?.addEventListener('click', logout);

  // Hamburger
  const ham = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  ham?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
}

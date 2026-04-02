// ============================================================
// UI MODULE — SwiftShip
// Reusable UI components, toast, spinner, modals, etc.
// ============================================================

// ── Toast Notifications ────────────────────────────────────
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const TOAST_ICONS = { success: '✓', error: '✕', info: 'ℹ' };

export function showToast(message, type = 'info', duration = 3500) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${TOAST_ICONS[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Loading Overlay ────────────────────────────────────────
let overlay = null;

export function showLoading() {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

export function hideLoading() {
  if (overlay) overlay.style.display = 'none';
}

// ── Inline Spinner ─────────────────────────────────────────
export function createSpinner(small = false) {
  const el = document.createElement('div');
  el.className = small ? 'spinner spinner-sm' : 'spinner';
  return el;
}

// ── Alert Component ────────────────────────────────────────
export function createAlert(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  const icons = { success: '✓', danger: '✕', info: 'ℹ', warning: '⚠' };
  el.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  return el;
}

// ── Empty State ────────────────────────────────────────────
export function createEmptyState(icon, title, subtitle = '') {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h3>${title}</h3>
      ${subtitle ? `<p>${subtitle}</p>` : ''}
    </div>
  `;
}

// ── Confirm Dialog ─────────────────────────────────────────
export function showConfirm(message, title = 'Confirm Action') {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <h3>${title}</h3>
        </div>
        <p style="margin-bottom:24px;color:var(--c-text-2)">${message}</p>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
          <button class="btn btn-danger" id="confirm-ok">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirm-ok').onclick    = () => { overlay.remove(); resolve(true);  };
  });
}

// ── Badge Helper ───────────────────────────────────────────
export function statusBadge(status) {
  const map = {
    new:         ['badge-info',    'New'],
    in_progress: ['badge-warning', 'In Progress'],
    resolved:    ['badge-success', 'Resolved'],
    active:      ['badge-success', 'Active'],
    inactive:    ['badge-neutral', 'Inactive'],
  };
  const [cls, label] = map[status] || ['badge-neutral', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ── Format Timestamp ───────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Validate Form Fields ───────────────────────────────────
export function validateFields(rules) {
  // rules: [{ value, message }]
  for (const { value, message } of rules) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      showToast(message, 'error');
      return false;
    }
  }
  return true;
}

// ── Set button loading state ───────────────────────────────
export function setBtnLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner spinner-sm"></div> Loading...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ── Navbar active link ─────────────────────────────────────
export function setActiveNav() {
  const links = document.querySelectorAll('.navbar-nav a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href.includes(path) || (path === 'index.html' && href === 'index.html'));
  });
}

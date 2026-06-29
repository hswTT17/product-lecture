/* ── Dark / Light mode ── */
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'light';
html.dataset.theme = saved;
toggle.checked = saved === 'dark';
toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  html.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});

/* ── Char counter ── */
const messageEl = document.getElementById('message');
const charCount = document.getElementById('charCount');
const charWrap  = charCount.closest('.char-count');
const MAX_CHARS = 1000;

messageEl.addEventListener('input', () => {
  const len = messageEl.value.length;
  charCount.textContent = len;
  if (len > MAX_CHARS) {
    messageEl.value = messageEl.value.slice(0, MAX_CHARS);
    charCount.textContent = MAX_CHARS;
  }
  charWrap.classList.toggle('warn', len >= MAX_CHARS * 0.9);
});

/* ── Validation helpers ── */
const rules = {
  name:    v => v.trim().length >= 2   || '이름을 2자 이상 입력해주세요.',
  company: v => v.trim().length >= 1   || '회사 / 브랜드명을 입력해주세요.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || '올바른 이메일 주소를 입력해주세요.',
  phone:   v => !v.trim() || /^[\d\-+() ]{7,15}$/.test(v.trim()) || '올바른 연락처를 입력해주세요.',
  website: v => !v.trim() || /^https?:\/\/.+/.test(v.trim()) || 'URL은 http:// 또는 https://로 시작해야 합니다.',
  type:    v => v !== ''               || '제휴 유형을 선택해주세요.',
  message: v => v.trim().length >= 10  || '제안 내용을 10자 이상 입력해주세요.',
};

function validateField(id) {
  const el  = document.getElementById(id);
  const msg = document.getElementById('err-' + id);
  const result = rules[id](el.value);
  const valid = result === true;
  el.classList.toggle('invalid', !valid);
  if (msg) msg.textContent = valid ? '' : result;
  return valid;
}

/* attach blur validation */
Object.keys(rules).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => validateField(id));
});

/* ── Toast helper ── */
let toastTimer;
function showToast(type, text) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.className = 'toast ' + type + ' show';
  toast.textContent = text;
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 6000);
}

/* ── Form submit ── */
const form = document.getElementById('affiliateForm');
const btn  = document.getElementById('submitBtn');

form.addEventListener('submit', async e => {
  e.preventDefault();

  /* validate all fields */
  const valid = Object.keys(rules).map(id => validateField(id)).every(Boolean);
  if (!valid) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(form),
    });

    if (res.ok) {
      showToast('success', '✅ 문의가 성공적으로 전송됐습니다! 빠르게 연락드리겠습니다.');
      form.reset();
      charCount.textContent = '0';
      charWrap.classList.remove('warn');
      Object.keys(rules).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
      });
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = data?.errors?.map(err => err.message).join(', ') || '전송에 실패했습니다.';
      showToast('error', '⚠️ ' + msg);
    }
  } catch {
    showToast('error', '⚠️ 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
});

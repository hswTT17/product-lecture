import { useState } from 'react'

const NAV = [
  { href: '/', label: '홈' },
  { href: '/posts', label: '아티클' },
  { href: '/consult', label: 'AI 컨설팅' },
  { href: '/about', label: '소개' },
  { href: '/contact', label: '제휴 문의' },
]

export default function Header({ dark, setDark }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const path = window.location.pathname

  return (
    <header>
      <div className="header-inner">
        <a href="/" className="logo">파트너십 인사이트</a>
        <nav>
          {NAV.map(({ href, label }) => (
            <a key={href} href={href} className={path === href ? 'active' : ''}>
              {label}
            </a>
          ))}
        </nav>
        <label className="switch" aria-label="다크 모드 토글">
          <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
          <span className="slider">
            <span className="icon">☀️</span>
            <span className="icon">🌙</span>
          </span>
        </label>
        <button
          className="nav-toggle"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {NAV.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  )
}

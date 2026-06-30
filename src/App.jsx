import { useState, useEffect } from 'react'

const articles = [
  {
    tag: '제휴 마케팅',
    date: '2026.06.20',
    href: '/posts/affiliate-marketing-guide',
    title: '제휴 마케팅 완전 가이드 — 처음 시작하는 사람을 위한 로드맵',
    desc: '제휴 마케팅의 개념부터 파트너 선정, 계약 조건 협상, 성과 측정까지 단계별로 설명합니다.',
    featured: true,
  },
  {
    tag: '공동 마케팅',
    date: '2026.06.15',
    href: '/posts/co-marketing-strategy',
    title: '공동 마케팅 캠페인 설계 전략 5가지',
    desc: '브랜드 간 시너지를 극대화하는 공동 마케팅 캠페인 기획 노하우를 정리했습니다.',
    featured: false,
  },
  {
    tag: '성장 전략',
    date: '2026.06.10',
    href: '/posts/partnership-growth',
    title: '파트너십으로 매출을 2배 높인 스타트업 사례 분석',
    desc: '국내 스타트업 3곳의 파트너십 전략을 분석해 공통된 성공 요인을 도출했습니다.',
    featured: false,
  },
]

export default function App() {
  const [dark, setDark] = useState(() => (localStorage.getItem('theme') || 'light') === 'dark')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [dark])

  return (
    <>
      <header>
        <div className="header-inner">
          <a href="/" className="logo">파트너십 인사이트</a>
          <nav>
            <a href="/" className="active">홈</a>
            <a href="/posts">아티클</a>
            <a href="/about">소개</a>
            <a href="/contact">제휴 문의</a>
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
          <a href="/" onClick={() => setMobileOpen(false)}>홈</a>
          <a href="/posts" onClick={() => setMobileOpen(false)}>아티클</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>소개</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>제휴 문의</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <span className="badge">비즈니스 협업 전문 미디어</span>
          <h1>더 나은 파트너십으로<br />함께 성장하세요</h1>
          <p>제휴 마케팅, 공동 마케팅, 브랜드 협업까지 — 실전에서 검증된 파트너십 전략을 공유합니다.</p>
          <div className="hero-cta">
            <a href="/posts" className="btn-primary">아티클 보기</a>
            <a href="/contact" className="btn-outline">제휴 문의하기</a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-inner">
          <div className="feature-card">
            <span className="feat-icon">🤝</span>
            <h3>검증된 협업 전략</h3>
            <p>실제 사례를 바탕으로 한 파트너십 수립부터 운영까지의 전 과정을 다룹니다.</p>
          </div>
          <div className="feature-card">
            <span className="feat-icon">📈</span>
            <h3>데이터 기반 인사이트</h3>
            <p>수치와 데이터로 뒷받침된 마케팅 전략으로 실질적인 성과를 이끌어냅니다.</p>
          </div>
          <div className="feature-card">
            <span className="feat-icon">💡</span>
            <h3>실전 적용 가능한 팁</h3>
            <p>이론에 그치지 않고 내일 당장 적용할 수 있는 실용적인 콘텐츠를 제공합니다.</p>
          </div>
        </div>
      </section>

      <section className="articles">
        <div className="section-inner">
          <h2 className="section-title">최신 아티클</h2>
          <div className="article-grid">
            {articles.map(a => (
              <article key={a.href} className={`article-card${a.featured ? ' featured' : ''}`}>
                <div className="article-meta">
                  <span className="tag">{a.tag}</span>
                  <span className="date">{a.date}</span>
                </div>
                <h3><a href={a.href}>{a.title}</a></h3>
                <p>{a.desc}</p>
                <a href={a.href} className="read-more">자세히 읽기 →</a>
              </article>
            ))}
          </div>
          <div className="articles-more">
            <a href="/posts" className="btn-outline">모든 아티클 보기</a>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="section-inner">
          <h2>파트너십 제안이 있으신가요?</h2>
          <p>콘텐츠 협력, 공동 마케팅, 스폰서십 등 다양한 형태의 제휴를 환영합니다.</p>
          <a href="/contact" className="btn-primary" style={{ background: '#fff', color: '#333' }}>제휴 문의 바로가기</a>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-links">
            <a href="/about">소개</a>
            <a href="/posts">아티클</a>
            <a href="/contact">제휴 문의</a>
            <a href="/privacy">개인정보처리방침</a>
          </div>
          <p className="footer-copy">© 2026 파트너십 인사이트. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { site } from '@/content/site'
import { projects } from '@/content/projects'
import { services } from '@/content/services'

export default function Home() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'Video Editing', message: '' })

  useEffect(() => {
    // ── 1. Nav scroll state ──
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── 2. Scroll reveal ──
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    revealEls.forEach((el) => io.observe(el))

    const revealInView = () => {
      const h = window.innerHeight || document.documentElement.clientHeight
      revealEls.forEach((el) => {
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < h * 0.92)
          el.classList.add('in')
      })
    }
    window.addEventListener('scroll', revealInView, { passive: true })
    window.addEventListener('load', revealInView)
    revealInView()

    // ── 3. Count-up stats ──
    const runCount = (el: HTMLElement) => {
      if (el.dataset.done) return
      el.dataset.done = '1'
      const target = +(el.dataset.count || '0')
      const suffix = el.dataset.suffix || ''
      const dur = 1400
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(target * eased) + suffix
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const countEls = document.querySelectorAll<HTMLElement>('[data-count]')
    const cio = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { cio.unobserve(e.target); runCount(e.target as HTMLElement) } }) },
      { threshold: 0.5 }
    )
    countEls.forEach((el) => cio.observe(el))

    // ── 4. Failsafe ──
    const failTimer = setTimeout(() => {
      revealInView()
      const probe = document.querySelector('.reveal.in')
      if (probe && parseFloat(getComputedStyle(probe).opacity) < 0.9)
        document.documentElement.classList.add('reveal-failsafe')
      countEls.forEach((el) => { if (!el.dataset.done) runCount(el) })
    }, 650)

    // ── 5. Cursor spotlight ──
    const spot = document.getElementById('spotlight')
    let onPointerMove: ((e: PointerEvent) => void) | null = null
    if (spot && window.matchMedia('(pointer:fine)').matches) {
      onPointerMove = (e: PointerEvent) => {
        spot.style.opacity = '1'
        spot.style.setProperty('--mx', e.clientX + 'px')
        spot.style.setProperty('--my', e.clientY + 'px')
      }
      window.addEventListener('pointermove', onPointerMove as EventListener, { passive: true })
    }

    // ── 6. Film-leader countdown ──
    const leader = document.getElementById('leader')
    let leaderTick: ReturnType<typeof setInterval> | null = null
    let leaderSafeTimer: ReturnType<typeof setTimeout> | null = null
    if (leader) {
      const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches
      const finish = () => {
        leader.classList.add('open')
        setTimeout(() => leader.classList.add('gone'), 1100)
      }
      if (reduce || sessionStorage.getItem('leaderShown')) {
        leader.classList.add('gone')
      } else {
        sessionStorage.setItem('leaderShown', '1')
        const numEl = document.getElementById('leaderNum')
        let n = 3
        if (numEl) numEl.textContent = String(n)
        leaderTick = setInterval(() => {
          n--
          if (n <= 0) { clearInterval(leaderTick!); finish(); return }
          if (numEl) numEl.textContent = String(n)
        }, 620)
        leader.addEventListener('click', () => { clearInterval(leaderTick!); finish() })
        leaderSafeTimer = setTimeout(() => {
          if (!leader.classList.contains('open')) { clearInterval(leaderTick!); finish() }
        }, 3000)
      }
    }

    // ── 7. Mobile nav toggle ──
    const toggle = document.querySelector('.nav-toggle')
    const navLinks = document.querySelector<HTMLElement>('.nav-links')
    const closeNav = () => navLinks?.classList.remove('mobile-open')
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => navLinks.classList.toggle('mobile-open'))
      // close on link click
      navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav))
    }

    // ── 8. Timeline ──
    // Build waveforms
    document.querySelectorAll<HTMLElement>('.wave[data-wave]').forEach((w) => {
      const n = +(w.dataset.wave || '60')
      const seed = n * 7.3
      let html = ''
      for (let i = 0; i < n; i++) {
        const h = 18 + Math.abs(Math.sin(i * 0.5 + seed) * Math.cos(i * 0.17 + seed)) * 68 + Math.sin(i * 1.7) * 8
        html += `<i style="height:${Math.max(10, Math.min(92, h)).toFixed(0)}%"></i>`
      }
      w.innerHTML = html
    })

    // Build ruler
    const ruler = document.getElementById('tlRuler')
    const fmt = (s: number) => {
      const f = Math.floor((s % 1) * 24)
      const sec = Math.floor(s) % 60
      const min = Math.floor(s / 60) % 60
      const hr = Math.floor(s / 3600)
      const p = (n: number) => String(n).padStart(2, '0')
      return `${p(hr)}:${p(min)}:${p(sec)}:${p(f)}`
    }
    const buildRuler = () => {
      if (!ruler) return
      ruler.innerHTML = ''
      const w = ruler.clientWidth || 800
      const step = 64
      const count = Math.ceil(w / step)
      for (let i = 0; i <= count; i++) {
        const major = i % 4 === 0
        const t = document.createElement('span')
        t.className = 'tick' + (major ? ' major' : '')
        t.style.left = i * step + 'px'
        ruler.appendChild(t)
        if (major) {
          const lab = document.createElement('span')
          lab.className = 'tlabel'
          lab.style.left = i * step + 'px'
          lab.textContent = fmt(i * 2)
          ruler.appendChild(lab)
        }
      }
    }
    buildRuler()
    window.addEventListener('resize', buildRuler, { passive: true })

    // Playhead rAF
    const ph = document.getElementById('playhead')
    const tcEl = document.getElementById('timecode')
    const lane = document.querySelector<HTMLElement>('.tl-lane')
    const headW = () => {
      const tl = document.querySelector<HTMLElement>('.timeline')
      return tl ? (parseInt(getComputedStyle(tl).getPropertyValue('--tl-head')) || 64) : 64
    }
    const DUR = 14
    const t0 = performance.now()
    let raf: number
    const frame = (now: number) => {
      const elapsed = ((now - t0) / 1000) % DUR
      const p = elapsed / DUR
      const hw = headW()
      const laneW = lane ? lane.clientWidth : window.innerWidth - hw
      if (ph) ph.style.left = hw + p * laneW + 'px'
      if (tcEl) tcEl.textContent = fmt(elapsed)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      io.disconnect()
      cio.disconnect()
      clearTimeout(failTimer)
      if (leaderTick) clearInterval(leaderTick)
      if (leaderSafeTimer) clearTimeout(leaderSafeTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', revealInView)
      window.removeEventListener('load', revealInView)
      window.removeEventListener('resize', buildRuler)
      if (onPointerMove)
        window.removeEventListener('pointermove', onPointerMove as EventListener)
    }
  }, [])

  // ── Contact form handler ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setFormState(res.ok ? 'sent' : 'error')
    } catch {
      setFormState('error')
    }
  }

  // Split projects into feature + rest
  const featureProject = projects.find((p) => p.feature)
  const sideProjects = projects.filter((p) => !p.feature).slice(0, 2)
  const bottomProjects = projects.filter((p) => !p.feature).slice(2, 5)

  return (
    <>
      {/* ══ Film-leader intro ══ */}
      <div className="leader" id="leader">
        <div className="leader-panel top"></div>
        <div className="leader-panel bottom"></div>
        <div className="leader-core">
          <div className="leader-ring">
            <span className="leader-sweep"></span>
            <span className="leader-num" id="leaderNum">3</span>
          </div>
          <div className="leader-meta">SEQ_01 · 23.976 fps · Loading Reel</div>
        </div>
      </div>

      {/* ══ Atmosphere ══ */}
      <div className="grid-bg" aria-hidden="true"></div>
      <div className="grid-major" aria-hidden="true"></div>
      <div className="grid-glow" aria-hidden="true"></div>
      <div className="persp-wrap" aria-hidden="true"><div className="persp-grid"></div></div>
      <div className="horizon-glow" aria-hidden="true"></div>
      <div className="aurora" aria-hidden="true">
        <span className="a1"></span>
        <span className="a2"></span>
        <span className="a3"></span>
      </div>
      <div className="glow-top" aria-hidden="true"></div>
      <div className="spotlight" id="spotlight" aria-hidden="true"></div>
      <div className="scanline" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>

      {/* ══ Nav ══ */}
      <nav id="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#top" className="logo">
            <span className="mark" aria-hidden="true"></span>
            {site.logoLabel}<span className="dim">{site.logoHandle}</span>
          </a>
          <div className="nav-links">
            <a href="#intro">About</a>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <a href="#contact" className="btn-hire">
            <span className="live-dot" aria-hidden="true"></span>Hire Me
          </a>
          <button className="nav-toggle" aria-label="Toggle menu">☰</button>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <header className="hero" id="top">
        <span className="frame-corner tl" aria-hidden="true"></span>
        <span className="frame-corner tr" aria-hidden="true"></span>

        <div className="tc-hud" aria-hidden="true">
          <span className="rec"><span className="d"></span>REC</span>
          <span className="sep"></span>
          <span className="tc" id="timecode">00:00:00:00</span>
          <span className="sep"></span>
          <span className="fps">23.976 fps</span>
        </div>

        <div className="status reveal">
          <span className="live-dot" aria-hidden="true"></span>
          {site.status} — <b>{site.year}</b>
        </div>
        <h1>
          <span className="green reveal" data-d="1">{site.nameFirst}</span>
          <span className="outline reveal" data-d="2">{site.nameLast}</span>
        </h1>
        <p className="tagline reveal" data-d="3">
          {site.tagline} <b>{site.taglineBold}</b> {site.taglineRest}
        </p>
        <div className="scroll-hint reveal" data-d="4">
          <span>Scroll</span>
          <span className="line" aria-hidden="true"></span>
        </div>

        {/* ── Premiere-style Timeline dock ── */}
        <div className="timeline" aria-hidden="true">
          <div className="tl-toolbar">
            <span className="seq"><span className="dot"></span>SEQ_01 · REEL_2026.prproj</span>
            <span className="transport">
              <span className="tbtn">◀</span>
              <span className="tbtn play">▶</span>
              <span className="tbtn">▶▌</span>
            </span>
            <span className="zoom">— ▦ +</span>
          </div>
          <div className="tl-ruler" id="tlRuler"></div>
          <div className="tl-tracks">
            <div className="tl-track t-gfx" style={{ '--th': '34px' } as React.CSSProperties}>
              <div className="tl-head">V2<span className="lk"></span></div>
              <div className="tl-lane">
                <div className="clip gfx" style={{ left: '6%', width: '18%' }}>Title_In.mogrt</div>
                <div className="clip gfx" style={{ left: '54%', width: '14%' }}>Lower_3rd</div>
                <div className="clip g" style={{ left: '80%', width: '13%' }}>Glow_FX</div>
              </div>
            </div>
            <div className="tl-track">
              <div className="tl-head">V1<span className="lk"></span></div>
              <div className="tl-lane">
                <div className="clip v" style={{ left: '2%', width: '22%' }}>A001_C012.mov</div>
                <div className="clip v" style={{ left: '25%', width: '17%' }}>B_ROLL_04</div>
                <div className="clip g" style={{ left: '43%', width: '9%' }}>Color_LUT</div>
                <div className="clip v" style={{ left: '53%', width: '20%' }}>INTV_wide.mp4</div>
                <div className="clip v" style={{ left: '74%', width: '24%' }}>DRONE_5k.mov</div>
              </div>
            </div>
            <div className="tl-track" style={{ '--th': '36px' } as React.CSSProperties}>
              <div className="tl-head">A1<span className="lk"></span></div>
              <div className="tl-lane">
                <div className="clip audio" style={{ left: '2%', width: '46%' }}><div className="wave" data-wave="60"></div></div>
                <div className="clip audio" style={{ left: '50%', width: '48%' }}><div className="wave" data-wave="62"></div></div>
              </div>
            </div>
          </div>
          <div className="playhead" id="playhead" style={{ left: '64px' }}></div>
        </div>
      </header>

      {/* ══ About / Intro ══ */}
      <section className="block" id="intro">
        <div className="wrap">
          <div className="intro-grid">
            <div className="intro-bio">
              <div className="eyebrow reveal">About</div>
              <h3 className="reveal" data-d="1">
                I turn raw footage into stories that hold attention from frame one.
              </h3>
              <p className="reveal" data-d="2" dangerouslySetInnerHTML={{ __html: site.bio1 }} />
              <p className="reveal" data-d="3" dangerouslySetInnerHTML={{ __html: site.bio2 }} />
              <div className="sig reveal" data-d="3">{site.sig}</div>
            </div>
            <div className="reveal" data-d="2">
              <div className="photo-card">
                <span className="corner tr" aria-hidden="true"></span>
                <span className="corner bl" aria-hidden="true"></span>
                <div className="open-badge">
                  <span className="live-dot" aria-hidden="true"></span>Open for Work
                </div>
                {/* Replace with your portrait: <img src="/portrait.jpg" alt="Syam Kumar" /> */}
                <div className="ph"><span>[ portrait ]</span></div>
              </div>
            </div>
          </div>

          <div className="stats">
            {site.stats.map((s, i) => (
              <div className="stat reveal" data-d={String(i + 1)} key={i}>
                {s.count !== null ? (
                  <div className="num" data-count={String(s.count)} data-suffix={s.suffix}>
                    0{s.suffix}
                  </div>
                ) : (
                  <div className="num">{s.display}</div>
                )}
                <div className="label">{s.label}</div>
              </div>
            ))}
            <div className="stat reveal" data-d="4">
              <div className="num"><span className="u">{site.locationCode}</span></div>
              <div className="label">{site.location}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Tool Marquee ══ */}
      <section className="marquee-band" aria-label="Toolkit">
        <div className="marquee-fade" aria-hidden="true"></div>
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((set) => (
            <div className="marquee-set" key={set} aria-hidden={set === 1}>
              <span className="m-item">Premiere Pro</span><span className="m-dot"></span>
              <span className="m-item">After Effects</span><span className="m-dot"></span>
              <span className="m-item">CapCut</span><span className="m-dot"></span>
              <span className="m-item">Illustrator</span><span className="m-dot"></span>
              <span className="m-item">Canva</span><span className="m-dot"></span>
              <span className="m-item">DaVinci Resolve</span><span className="m-dot"></span>
              <span className="m-item">Photoshop</span><span className="m-dot"></span>
              <span className="m-item">Figma</span><span className="m-dot"></span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Work ══ */}
      <section className="block" id="work">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="idx">02</span>
            <h2>Selected Work</h2>
          </div>

          {/* Grid A: feature + 2 side cards */}
          <div className="work-grid">
            {featureProject && (
              <article
                className="work-card feature reveal"
                data-d="1"
                data-tc={featureProject.timecode}
                onClick={() => window.open(featureProject.videoUrl, '_blank')}
              >
                <div className="work-thumb"></div>
                <div className="work-glow"></div>
                <div className="play" aria-hidden="true"></div>
                <div className="work-meta">
                  <div className="cat">
                    {featureProject.category}
                    <span className="dur">· {featureProject.duration}</span>
                  </div>
                  <h4>{featureProject.title}</h4>
                  {featureProject.tags && (
                    <div className="tags">
                      {featureProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  )}
                </div>
              </article>
            )}
            {sideProjects.map((p, i) => (
              <article
                key={p.id}
                className="work-card reveal"
                data-d={String(i + 2)}
                data-tc={p.timecode}
                onClick={() => window.open(p.videoUrl, '_blank')}
              >
                <div className="work-thumb"></div>
                <div className="work-glow"></div>
                <div className="play" aria-hidden="true"></div>
                <div className="work-meta">
                  <div className="cat">{p.category}<span className="dur">· {p.duration}</span></div>
                  <h4>{p.title}</h4>
                </div>
              </article>
            ))}
          </div>

          {/* Grid B: 3 equal cards */}
          {bottomProjects.length > 0 && (
            <div className="work-grid-equal">
              {bottomProjects.map((p, i) => (
                <article
                  key={p.id}
                  className="work-card reveal"
                  data-d={String(i + 1)}
                  data-tc={p.timecode}
                  onClick={() => window.open(p.videoUrl, '_blank')}
                >
                  <div className="work-thumb"></div>
                  <div className="work-glow"></div>
                  <div className="play" aria-hidden="true"></div>
                  <div className="work-meta">
                    <div className="cat">{p.category}<span className="dur">· {p.duration}</span></div>
                    <h4>{p.title}</h4>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="work-foot reveal">
            <p>A small slice of recent work — full reel available on request.</p>
            <a href="#contact" className="link-arrow">View full portfolio →</a>
          </div>
        </div>
      </section>

      {/* ══ Services ══ */}
      <section className="block" id="services">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="idx">03</span>
            <h2>Services</h2>
          </div>
          <div className="svc-grid">
            {services.map((svc, i) => (
              <div className="svc reveal" data-d={String((i % 3) + 1)} key={svc.num}>
                <div className="num">{svc.num}</div>
                <div className="ico">
                  <svg viewBox="0 0 24 24" aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: svc.iconPath }} />
                </div>
                <h4>{svc.title}</h4>
                <p>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Contact ══ */}
      <section className="block" id="contact">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-left">
              <div className="eyebrow reveal" style={{ marginBottom: '24px' }}>Contact</div>
              <h2 className="reveal" data-d="1">
                Let&apos;s create<br />something <span className="green">great</span>
              </h2>
              <p className="reveal" data-d="2">
                Have a project, a deadline, or just an idea worth shaping? I reply to every message within 24 hours.
              </p>
              <div className="contact-list reveal" data-d="2">
                <a className="contact-row" href={`mailto:${site.email}`}>
                  <span className="ck">Email</span>
                  <span className="cv">{site.email}</span>
                  <span className="ar">→</span>
                </a>
                <a className="contact-row" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                  <span className="ck">Phone</span>
                  <span className="cv">{site.phone}</span>
                  <span className="ar">→</span>
                </a>
                <a className="contact-row" href="#top">
                  <span className="ck">Location</span>
                  <span className="cv">{site.location} · Remote worldwide</span>
                  <span className="ar">→</span>
                </a>
              </div>
              <div className="socials reveal" data-d="3">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <form className="form-card reveal" data-d="2" onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name" type="text" placeholder="Your name" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email" type="email" placeholder="you@email.com" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="projectType">Project Type</label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                >
                  <option>Video Editing</option>
                  <option>Motion Graphics</option>
                  <option>Color Grading</option>
                  <option>Content Creation</option>
                  <option>Social Media Reels</option>
                  <option>Graphic Design</option>
                  <option>Full Production</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message" placeholder="Tell me about the project, timeline and goals…" required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button className="btn-send" type="submit" disabled={formState === 'sending' || formState === 'sent'}>
                <span className="live-dot" style={{ background: '#0a0c00', boxShadow: 'none', animation: 'none' }}></span>
                {formState === 'sending' ? 'Sending…' : formState === 'sent' ? 'Message Sent ✓' : 'Send Message'}
              </button>
              {formState === 'sent' && (
                <div className="form-success">Message received! I&apos;ll reply within 24 hours.</div>
              )}
              {formState === 'error' && (
                <div className="form-note" style={{ color: '#ff6b6b' }}>
                  Something went wrong. Email me directly at {site.email}
                </div>
              )}
              {formState === 'idle' && (
                <div className="form-note">Or email directly — {site.email}</div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand reveal">
              <span className="green">{site.nameFirst}</span>{' '}
              <span className="outline">{site.nameLast}</span>
            </div>
            <div className="foot-cta reveal" data-d="1">
              <span className="mono-tag">Currently booking</span>
              <a href="#contact" className="btn-hire">
                <span className="live-dot" aria-hidden="true"></span>Start a project
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <span className="mono-tag">
              © {site.year} {site.nameFirst} {site.nameLast} — {site.profession}
            </span>
            <div className="foot-links">
              <a href="#top">Top</a>
              <a href="#work">Work</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ Film grain ══ */}
      <div className="grain" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </>
  )
}

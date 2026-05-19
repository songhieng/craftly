'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AssetUploader, assetUploaderCss, type UploadedAsset } from './AssetUploader';

type BriefState = {
  businessName: string;
  contactName: string;
  telegram: string;
  email: string;
  industry: string;
  campaignName: string;
  goal: string;
  audience: string;
  offer: string;
  style: string[];
  references: string;
};

const initialBrief: BriefState = {
  businessName: '',
  contactName: '',
  telegram: '',
  email: '',
  industry: 'Cafe / restaurant',
  campaignName: '',
  goal: 'Sell a product or offer',
  audience: '',
  offer: '',
  style: ['Fresh'],
  references: '',
};

const styleOptions = ['Fresh', 'Editorial', 'Premium', 'Playful', 'Warm', 'Minimal'];

function toggle(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function BriefForm() {
  const [brief, setBrief] = useState<BriefState>(initialBrief);
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const completion = useMemo(() => {
    const required = [
      brief.businessName,
      brief.contactName,
      brief.telegram || brief.email,
      brief.campaignName,
      brief.audience,
      brief.offer,
    ];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [brief]);

  function update<Key extends keyof BriefState>(key: Key, value: BriefState[Key]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedAt = new Date().toISOString();
    localStorage.setItem(
      'ai-creative-cambodia-brief',
      JSON.stringify({ ...brief, submittedAt }),
    );
    // Save asset metadata + thumbnails separately (strip the objectUrl since it's session-only)
    const persistedAssets = uploadedAssets.map(({ id, name, type, size, isImage, thumbnail }) => ({
      id, name, type, size, isImage, thumbnail,
    }));
    localStorage.setItem(
      'ai-creative-cambodia-assets',
      JSON.stringify(persistedAssets),
    );
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="brief-page">
      <style>{css}</style>
      <style>{assetUploaderCss}</style>

      <div className="brief-strip">
        <a href="/" className="back">AI Creative Cambodia</a>
        <span>Creative brief intake</span>
        <a href="/signin" className="admin-link">My account</a>
      </div>

      <header className="brief-hero">
        <div>
          <div className="kicker"><span />New request</div>
          <h1>
            Tell us what to make.
            <em> We will shape the visual direction.</em>
            <span>ប្រាប់យើងពីយុទ្ធនាការរបស់លោកអ្នក</span>
          </h1>
        </div>
        <aside className="hero-note">
          <strong>Khmer-safe workflow</strong>
          AI drafts the scene. Human designers set Khmer copy as an overlay, review every glyph, and prepare platform-ready exports.
        </aside>
      </header>

      {submitted ? (
        <section className="success-panel">
          <p className="eyebrow">Brief received</p>
          <h2>{brief.businessName || 'Your campaign'} is in the queue.</h2>
          <p>
            We saved your request and{' '}
            {uploadedAssets.length > 0
              ? `${uploadedAssets.length} uploaded file${uploadedAssets.length !== 1 ? 's' : ''}`
              : 'any provided assets'}{' '}
            locally for this prototype. The studio team will review the files, prepare creative directions,
            and move the job into the Sprint Board.
          </p>
          <div className="success-actions">
            <a href="/admin" className="primary">Open Sprint Board</a>
            <button type="button" onClick={() => setSubmitted(false)}>Edit brief</button>
          </div>
        </section>
      ) : (
        <form className="brief-layout" onSubmit={handleSubmit}>
          <div className="form-stack">
            <section className="form-section">
              <div className="section-num">01</div>
              <div className="section-copy">
                <h2>Business</h2>
                <p>Who is the campaign for, and how should we reach you?</p>
              </div>
              <div className="fields two">
                <label>
                  Business name
                  <input required value={brief.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="Bopha Cafe" />
                </label>
                <label>
                  Industry
                  <select value={brief.industry} onChange={(e) => update('industry', e.target.value)}>
                    <option>Cafe / restaurant</option>
                    <option>Beauty / skincare</option>
                    <option>Fashion / retail</option>
                    <option>Clinic / wellness</option>
                    <option>Real estate</option>
                    <option>Other SME</option>
                  </select>
                </label>
                <label>
                  Contact name
                  <input required value={brief.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Sophea Ch." />
                </label>
                <label>
                  Telegram or phone
                  <input value={brief.telegram} onChange={(e) => update('telegram', e.target.value)} placeholder="+855 ..." />
                </label>
                <label className="wide">
                  Email
                  <input type="email" value={brief.email} onChange={(e) => update('email', e.target.value)} placeholder="hello@example.com" />
                </label>
              </div>
            </section>

            <section className="form-section">
              <div className="section-num">02</div>
              <div className="section-copy">
                <h2>Campaign</h2>
                <p>Give us the commercial intent, not perfect design language.</p>
              </div>
              <div className="fields">
                <label>
                  Campaign name
                  <input required value={brief.campaignName} onChange={(e) => update('campaignName', e.target.value)} placeholder="Summer drink promo" />
                </label>
                <label>
                  Main goal
                  <select value={brief.goal} onChange={(e) => update('goal', e.target.value)}>
                    <option>Sell a product or offer</option>
                    <option>Launch a new product</option>
                    <option>Promote an event</option>
                    <option>Refresh brand visuals</option>
                    <option>Build trust / awareness</option>
                  </select>
                </label>
                <label>
                  Target audience
                  <textarea required value={brief.audience} onChange={(e) => update('audience', e.target.value)} placeholder="Young office workers near BKK1, mostly mobile-first buyers..." />
                </label>
                <label>
                  Offer or key message
                  <textarea required value={brief.offer} onChange={(e) => update('offer', e.target.value)} placeholder="Buy 2 drinks, get 1 free this weekend. Need Khmer headline." />
                </label>
              </div>
            </section>

            <section className="form-section">
              <div className="section-num">03</div>
              <div className="section-copy">
                <h2>Direction</h2>
                <p>References, inspiration, and the feel you want.</p>
              </div>
              <div className="fields">
                <div>
                  <span className="field-title">Style signals</span>
                  <div className="chips">
                    {styleOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={brief.style.includes(option) ? 'chip active' : 'chip'}
                        onClick={() => update('style', toggle(brief.style, option))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  Reference links or inspiration
                  <textarea value={brief.references} onChange={(e) => update('references', e.target.value)} placeholder="Paste Instagram, Pinterest, competitor posts, or describe a look you like." />
                </label>
                <div>
                  <span className="field-title">Upload your assets</span>
                  <p className="field-hint">Logo, product photos, references, packaging, PDFs, SVGs — drag &amp; drop or click to browse.</p>
                  <AssetUploader assets={uploadedAssets} onChange={setUploadedAssets} />
                </div>
              </div>
            </section>

          </div>

          <aside className="summary">
            <div className="progress">
              <span>{completion}%</span>
              <div><i style={{ width: `${completion}%` }} /></div>
            </div>
            <h3>Brief summary</h3>
            <dl>
              <div><dt>Business</dt><dd>{brief.businessName || '—'}</dd></div>
              <div><dt>Campaign</dt><dd>{brief.campaignName || '—'}</dd></div>
              <div><dt>Industry</dt><dd>{brief.industry}</dd></div>
            </dl>
            <div className="policy-card">
              <strong>Khmer copy policy</strong>
              <p>Khmer text is not generated inside the image. We place it as editable overlay type after review.</p>
            </div>
            <button type="submit" className="submit">Send brief</button>
            <p className="fine">No payment on this form. We confirm scope and files first.</p>
          </aside>
        </form>
      )}
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Noto+Serif+Khmer:wght@400;500;700&display=swap');

:root {
  --cream:#F2EAD3; --paper:#FBF6E7; --ink:#15201A; --forest:#1B3F2A;
  --signal:#DD4A14; --mute:#6F6B5C; --line:rgba(21,32,26,.2);
  --serif:'Instrument Serif',serif; --news:'Newsreader',serif; --sans:'Geist',system-ui,sans-serif; --mono:'Geist Mono',monospace; --km:'Noto Serif Khmer',serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink)}
.brief-page{min-height:100vh;background:var(--cream);font-family:var(--sans);position:relative}
.brief-page:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");opacity:.45;mix-blend-mode:multiply}
.brief-strip{position:relative;z-index:1;border-bottom:1px solid rgba(21,32,26,.5);padding:9px 28px;display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.brief-strip a{color:inherit;text-decoration:none}.back{color:var(--forest)!important}.admin-link:hover,.back:hover{color:var(--signal)!important}
.brief-hero{position:relative;z-index:1;padding:46px 28px 54px;border-bottom:1px solid rgba(21,32,26,.5);display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:42px;align-items:end}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);display:flex;gap:12px;align-items:center;margin-bottom:18px}.kicker span{width:42px;height:1px;background:rgba(21,32,26,.5)}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(54px,8vw,132px);line-height:.9;letter-spacing:-.035em;color:var(--forest);margin:0;max-width:980px}
h1 em{color:var(--signal);font-style:italic} h1 span{display:block;font-family:var(--km);font-size:.23em;line-height:1.3;letter-spacing:0;color:var(--ink);margin-top:16px}
.hero-note{border:1px solid rgba(21,32,26,.5);background:var(--paper);padding:18px 18px 20px;border-radius:14px;font-family:var(--news);font-size:17px;line-height:1.35;box-shadow:0 16px 30px -24px rgba(0,0,0,.4)}
.hero-note strong{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--signal);margin-bottom:10px}
.brief-layout{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:28px;padding:28px;align-items:start}
.form-stack{display:grid;gap:18px}
.form-section{background:rgba(251,246,231,.55);border-top:1px solid rgba(21,32,26,.5);display:grid;grid-template-columns:90px 240px minmax(0,1fr);gap:24px;padding:28px 0 34px}
.section-num{font-family:var(--serif);font-style:italic;font-size:54px;line-height:.9;color:var(--signal)}
.section-copy h2{font-family:var(--serif);font-size:38px;font-weight:400;line-height:1;margin:0 0 10px;color:var(--forest);letter-spacing:-.02em}
.section-copy p{margin:0;color:var(--mute);font-size:13.5px;line-height:1.55}
.fields{display:grid;gap:16px}.fields.two{grid-template-columns:1fr 1fr}.fields.two .wide{grid-column:1/-1}.fields.compact{gap:12px}
label,.field-title{display:grid;gap:7px;font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
input,select,textarea{width:100%;border:1px solid rgba(21,32,26,.28);border-radius:8px;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:14.5px;letter-spacing:0;text-transform:none;padding:13px 13px;outline:none}
textarea{min-height:112px;resize:vertical;line-height:1.5} input:focus,select:focus,textarea:focus{border-color:var(--signal);box-shadow:0 0 0 3px rgba(221,74,20,.12)}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{border:1px solid rgba(21,32,26,.3);background:transparent;border-radius:999px;padding:9px 13px;color:var(--ink);font-family:var(--sans);font-size:13px;cursor:pointer}.chip.active{background:var(--forest);border-color:var(--forest);color:var(--cream)}
.summary{position:sticky;top:18px;background:var(--forest);color:var(--cream);border-radius:8px;padding:22px;border:1px solid rgba(21,32,26,.45);box-shadow:0 24px 50px -34px rgba(0,0,0,.6)}
.progress{display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;color:rgba(242,234,211,.7)}.progress div{height:5px;flex:1;background:rgba(242,234,211,.16);border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;background:var(--signal)}
.summary h3{font-family:var(--serif);font-weight:400;font-size:34px;line-height:1;margin:24px 0 20px}.summary dl{margin:0;display:grid;gap:13px}.summary dl div{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid rgba(242,234,211,.14);padding-bottom:12px}.summary dt{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,234,211,.55)}.summary dd{margin:0;text-align:right;font-size:13px}
.policy-card{background:rgba(242,234,211,.08);border:1px solid rgba(242,234,211,.18);border-radius:8px;padding:14px;margin:20px 0}.policy-card strong{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--signal)}.policy-card p{margin:8px 0 0;font-size:13px;line-height:1.45;color:rgba(242,234,211,.72)}
.submit,.primary,.success-actions button{width:100%;border:0;border-radius:999px;padding:14px 18px;background:var(--signal);color:var(--cream);font-family:var(--sans);font-size:14px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none}.submit:hover,.primary:hover{background:#B53A0E}.fine{font-size:12px;line-height:1.4;color:rgba(242,234,211,.55);text-align:center}
.field-hint{margin:4px 0 12px;font-family:var(--sans);font-size:12.5px;color:var(--mute);line-height:1.5;letter-spacing:0;text-transform:none}
.success-panel{position:relative;z-index:1;margin:34px auto 80px;max-width:820px;border-top:1px solid rgba(21,32,26,.5);border-bottom:1px solid rgba(21,32,26,.5);padding:58px 0;text-align:center}.success-panel .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--signal)}.success-panel h2{font-family:var(--serif);font-size:clamp(42px,6vw,76px);font-weight:400;color:var(--forest);line-height:.96;margin:12px 0}.success-panel>p{font-family:var(--news);font-size:19px;line-height:1.45;color:var(--mute);max-width:560px;margin:0 auto 28px}.success-actions{display:flex;gap:12px;justify-content:center}.success-actions .primary,.success-actions button{width:auto;padding-left:24px;padding-right:24px}.success-actions button{background:transparent;color:var(--ink);border:1px solid rgba(21,32,26,.5)}
@media (max-width:980px){.brief-hero,.brief-layout{grid-template-columns:1fr}.hero-note,.summary{position:static}.form-section{grid-template-columns:1fr}.fields.two,.package-grid{grid-template-columns:1fr 1fr}.brief-strip{padding:9px 16px}.brief-hero,.brief-layout{padding-left:16px;padding-right:16px}}
@media (max-width:600px){
  .brief-strip{gap:6px;font-size:10px;flex-wrap:wrap}
  .brief-hero{padding:28px 14px 36px}
  .brief-layout{padding:14px}
  .form-section{padding:22px 0 28px}
  .section-num{font-size:36px}
  .section-copy h2{font-size:26px;margin-bottom:6px}
  .fields.two{grid-template-columns:1fr}
  .package-grid{grid-template-columns:1fr 1fr 1fr}
  .package strong{font-size:22px}
  .summary h3{font-size:26px;margin:16px 0 14px}
  .success-panel{padding:40px 0}
  .success-actions{flex-direction:column;align-items:center}
  .success-actions .primary,.success-actions button{width:100%;max-width:320px;padding-left:0;padding-right:0}
}
`;

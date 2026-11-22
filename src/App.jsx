import React, { useState, useRef } from 'react';

const PRODUCTS = [
  {
    id: 'granite',
    category: 'stone',
    categoryLabel: 'Natural Stone',
    badge: 'Standard Spec',
    title: 'Pitched Black Granite',
    description: 'Deep rustic cleft finish with light-absorbing natural facets. High load tolerance.',
    specs: [
      { label: 'Dimensions:', value: '300 × 150 mm', mono: true },
      { label: 'Thickness:', value: '20 - 30 mm', mono: true },
      { label: 'Finish:', value: 'Surface Pitched' },
      { label: 'Installation:', value: 'Adhesive / Mechanical' },
    ],
    rate: 240,
    unit: '/ sq.ft (Mat.)',
  },
  {
    id: 'wirecut',
    category: 'brick',
    categoryLabel: 'Clay Ceramic',
    badge: 'Best Seller',
    title: 'Wirecut Terracotta Tile',
    description: 'Kiln-fired natural clay bricks with defined sharp edges and uniform thermal resistance.',
    specs: [
      { label: 'Dimensions:', value: '230 × 75 mm (9×3")', mono: true },
      { label: 'Thickness:', value: '18 mm Nominal', mono: true },
      { label: 'Finish:', value: 'Natural Raw Matt' },
      { label: 'Installation:', value: 'Polymer Modified Mortar' },
    ],
    rate: 85,
    unit: '/ sq.ft (Mat.)',
  },
  {
    id: 'sandstone',
    category: 'stone',
    categoryLabel: 'Natural Stone',
    badge: 'Exterior Accent',
    title: 'Split-Face Sandstone',
    description: 'Earthy stratified rock texture. Ideal for compound walls, boundary pillars, and feature facades.',
    specs: [
      { label: 'Dimensions:', value: '600 × 150 mm', mono: true },
      { label: 'Thickness:', value: '20 - 25 mm', mono: true },
      { label: 'Finish:', value: 'Chiseled Split Face' },
      { label: 'Installation:', value: 'Wet Clad with Pins' },
    ],
    rate: 125,
    unit: '/ sq.ft (Mat.)',
  },
  {
    id: 'louvers',
    category: 'dryclad',
    categoryLabel: 'Ventilated Dry-Clad',
    badge: 'Architectural Grade',
    title: 'Terracotta Louver Baguettes',
    description: 'Sun-shading and solar heat gain dissipation. Hollow core extruded terracotta with internal steel core.',
    specs: [
      { label: 'Profile:', value: '50 × 50 / 60 × 60 mm', mono: true },
      { label: 'Length:', value: 'Up to 1200 mm', mono: true },
      { label: 'Finish:', value: 'Terracotta Natural Red' },
      { label: 'System:', value: 'Dry Clad (SS304 Brackets)' },
    ],
    rate: 320,
    unit: '/ Rft (System)',
  },
];

const CALCULATOR_OPTIONS = [
  { rate: 240, installRate: 110, name: 'Pitched Black Granite Cladding', label: 'Natural Black Granite Cladding (₹240/sq.ft)' },
  { rate: 85, installRate: 75, name: 'Wirecut Terracotta Brick Tiles', label: 'Wirecut Terracotta Brick Tiles (₹85/sq.ft)' },
  { rate: 125, installRate: 95, name: 'Split-Face Sandstone Wall Tiles', label: 'Split-Face Sandstone Wall Cladding (₹125/sq.ft)' },
  { rate: 160, installRate: 65, name: 'Flamed Granite Outdoor Pavers', label: 'Flamed Granite Outdoor Pavers (₹160/sq.ft)' },
  { rate: 320, installRate: 140, name: 'Terracotta Dry-Clad Louvers', label: 'Terracotta Dry-Clad Architectural Louvers (₹320/sq.ft)' },
];

const formatINR = (num) => '₹ ' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export default function App() {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Material Filter State
  const [activeFilter, setActiveFilter] = useState('all');

  // Cost Calculator State
  const [selectedCalcIdx, setSelectedCalcIdx] = useState(0);
  const [area, setArea] = useState(1400);
  const [scope, setScope] = useState('turnkey');

  // Contact / Quote Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project_city: '',
    material: 'Natural Stone Cladding (Black Granite / Sandstone)',
    estimated_area_sq_ft: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  const calculatorRef = useRef(null);
  const contactRef = useRef(null);

  // Derived Calculator Totals
  const selectedMaterial = CALCULATOR_OPTIONS[selectedCalcIdx];
  const isTurnkey = scope === 'turnkey';
  const materialTotal = selectedMaterial.rate * area;
  const packingTotal = Math.max(3500, Math.round(area * 7.5));
  const installTotal = isTurnkey ? selectedMaterial.installRate * area : 0;
  const grandTotal = materialTotal + packingTotal + installTotal;

  const filteredProducts =
    activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter((item) => item.category === activeFilter);

  const handlePrefillEstimate = (rate) => {
    const foundIdx = CALCULATOR_OPTIONS.findIndex((opt) => opt.rate === rate);
    if (foundIdx !== -1) {
      setSelectedCalcIdx(foundIdx);
    }
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTriggerInquiryWithEstimate = () => {
    setFormData((prev) => ({
      ...prev,
      estimated_area_sq_ft: String(area),
      message: `Auto-Quote Ref: Interested in ${selectedMaterial.name} for approx ${area} sq.ft (${
        isTurnkey ? 'Turnkey Supply + Execution' : 'Material Supply Only'
      }). Estimated budget: ${formatINR(grandTotal)}`,
    }));
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = new FormData();
      payload.append('access_key', '5c3990e9-2b89-4210-ba03-27c90c5318ba');
      Object.entries(formData).forEach(([key, val]) => payload.append(key, val));

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'The form could not be submitted. Please try again.');
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        project_city: '',
        material: 'Natural Stone Cladding (Black Granite / Sandstone)',
        estimated_area_sq_ft: '',
        message: '',
      });
      setSubmitStatus({
        type: 'success',
        message: 'Inquiry recorded! Our technical estimation team will reach out with BOQ parameters within 24 hours.',
      });
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 7000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Unable to send your inquiry. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-stonecharcoal-950 text-slate-200 font-sans antialiased selection:bg-terracotta-500 selection:text-white min-h-screen">
      {/* Top Announcement Bar */}
      <div className="bg-stonecharcoal-900 border-b border-white/5 py-2 px-4 text-xs tracking-wider uppercase text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Commercial Tier Material Sourcing &amp; Turnkey On-Site Execution</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:inline">
              <i className="fa-solid fa-location-dot text-terracotta-500 mr-1.5"></i>Trivandrum &amp; Pan-Kerala Supply
            </span>
            <a href="tel:+919746133395" className="hover:text-terracotta-500 transition-colors">
              <i className="fa-solid fa-phone mr-1.5"></i>+91 97461 33395
            </a>
            <a href="mailto:gm@derziegel.co.in" className="hover:text-terracotta-500 transition-colors hidden sm:inline">
              <i className="fa-solid fa-envelope mr-1.5"></i>gm@derziegel.co.in
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/logo.jpeg"
              alt="Ladrillo logo"
              className="w-10 h-10 rounded object-cover shadow-lg shadow-terracotta-500/25 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-white block leading-tight">LADRILLO</span>
              <span className="text-[10px] tracking-[0.25em] text-slate-400 font-medium block uppercase">Structural Supply</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-10 lg:ml-10 text-sm font-medium text-slate-300">
            <a href="#positioning" className="hover:text-white transition-colors">The Advantages</a>
            <a href="#materials" className="hover:text-white transition-colors">Material Systems</a>
            <a href="#calculator" className="hover:text-white transition-colors">Project Estimator</a>
            <a href="#process" className="hover:text-white transition-colors">Execution Workflow</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact &amp; BOQ</a>
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#calculator"
              className="text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded border border-white/20 hover:border-terracotta-500 text-slate-300 hover:text-white transition-colors"
            >
              Calculate Cost
            </a>
            <a
              href="#contact"
              className="accent-gradient hover:opacity-95 text-white text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded shadow-md shadow-terracotta-500/20 transition-all transform active:scale-95"
            >
              Request Quote
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden text-slate-400 hover:text-white p-2"
            aria-label="Toggle Navigation"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-stonecharcoal-900 border-b border-white/10 px-6 py-6 space-y-4">
            <a href="#positioning" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium py-1">
              The Advantages
            </a>
            <a href="#materials" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium py-1">
              Material Systems
            </a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium py-1">
              Project Estimator
            </a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium py-1">
              Execution Workflow
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white font-medium py-1">
              Contact &amp; BOQ
            </a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 border border-white/20 text-slate-300 rounded font-semibold text-xs tracking-wider uppercase"
              >
                Calculate Cost
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-terracotta-500 text-white rounded font-semibold text-xs tracking-wider uppercase"
              >
                Request Quote
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative hero-pattern pt-16 pb-24 md:pt-28 md:pb-36 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-stonecharcoal-950 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terracotta-500/30 bg-terracotta-500/10 text-terracotta-100 text-xs tracking-wider uppercase font-semibold">
                  <i className="fa-solid fa-shapes text-terracotta-500"></i> Turnkey Supply &amp; Precision Execution Partner
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  End-to-End <span className="text-terracotta-500">Facade Engineering</span> &amp; Structural Supply.
                </h1>

                <p className="text-base sm:text-lg text-slate-400 font-light max-w-2xl leading-relaxed">
                  We bridge leading manufacturing quarries and architects. Procure curated natural stone, wirecut facing bricks, and ventilated facade systems at volume rates—fully backed by our master on-site anchoring, dry-cladding, and craftsmanship.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 pb-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-terracotta-500 text-sm"></i>
                    <span>Zero-Transit Loss Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-compass-drafting text-terracotta-500 text-sm"></i>
                    <span>Dry &amp; Wet Clad Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-cubes-stacked text-terracotta-500 text-sm"></i>
                    <span>Quarry-Direct Cost Advantage</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#materials"
                    className="accent-gradient text-white px-7 py-3.5 rounded font-semibold text-sm uppercase tracking-wider shadow-lg shadow-terracotta-500/30 hover:scale-[1.02] transition-transform"
                  >
                    Explore Material Systems
                  </a>
                  <a
                    href="#calculator"
                    className="bg-stonecharcoal-900 border border-white/20 hover:border-slate-400 text-white px-7 py-3.5 rounded font-semibold text-sm uppercase tracking-wider transition-all"
                  >
                    Cost Estimator <i className="fa-solid fa-calculator ml-2 text-terracotta-500"></i>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-terracotta-500 to-amber-700 opacity-20 blur-xl"></div>
                  <div className="relative glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Enterprise Profile</p>
                        <h3 className="text-lg font-bold text-white">Ladrillo Supply &amp; Fit Spec</h3>
                      </div>
                      <span className="px-2.5 py-1 text-[11px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        PAN-KERALA READY
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3.5 rounded-lg bg-stonecharcoal-900/80 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Surface Pitch Black Granite</p>
                          <p className="text-[11px] text-slate-400">Hand-chiseled • 20–30mm Calibration</p>
                        </div>
                        <span className="text-xs font-mono text-terracotta-500 font-bold">100% In-House Fit</span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-stonecharcoal-900/80 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Wirecut Facing &amp; Paver Bricks</p>
                          <p className="text-[11px] text-slate-400">High compressive load • Chamfered edge</p>
                        </div>
                        <span className="text-xs font-mono text-terracotta-500 font-bold">Factory Sourced</span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-stonecharcoal-900/80 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Ventilated Terracotta Cladding</p>
                          <p className="text-[11px] text-slate-400">Aluminum substructure • SS 304 clips</p>
                        </div>
                        <span className="text-xs font-mono text-terracotta-500 font-bold">Engineered Dry-Fix</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                      <div>
                        <p className="text-xl font-bold text-white">50k+</p>
                        <p className="text-[10px] text-slate-400 uppercase">Sq.Ft Executed</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">100%</p>
                        <p className="text-[10px] text-slate-400 uppercase">Batch Matched</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">Zero</p>
                        <p className="text-[10px] text-slate-400 uppercase">Client Breakage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POSITIONING: THE LADRILLO ADVANTAGE */}
        <section id="positioning" className="py-24 bg-stonecharcoal-900 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-terracotta-500 tracking-widest uppercase">The Hybrid Turnkey Model</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Why Architects &amp; Developers Partner With Us</h2>
              <p className="text-sm sm:text-base text-slate-400">
                Buying materials directly from quarries creates logistics chaos and quality discrepancies; hiring independent masons risks poor facade alignment. Ladrillo consolidates both into a single accountable partnership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-stonecharcoal-950 border border-white/10 hover:border-terracotta-500/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-terracotta-500/10 flex items-center justify-center text-terracotta-500 text-xl mb-6 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-network-wired"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Direct-Tier Sourcing</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We leverage bulk commercial purchasing relationships with granite quarries, clay brick factories, and tile plants. You receive wholesale rates without dealing with manufacturer minimum order barriers or freight complexities.
                </p>
              </div>

              <div className="p-8 rounded-xl bg-stonecharcoal-950 border border-white/10 hover:border-terracotta-500/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-terracotta-500/10 flex items-center justify-center text-terracotta-500 text-xl mb-6 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-helmet-safety"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Certified Installation Crews</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We do not simply dump stones at your site. Our specialized installation division executes the work using chemical adhesives, mechanical stainless-steel cramps, expansion joints, and laser levels for perfect alignment.
                </p>
              </div>

              <div className="p-8 rounded-xl bg-stonecharcoal-950 border border-white/10 hover:border-terracotta-500/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-terracotta-500/10 flex items-center justify-center text-terracotta-500 text-xl mb-6 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-file-contract"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Single-Point Accountability</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  No pointing fingers between material vendors and installation labor. From crate inspection and moisture testing to post-installation silicon sealant and protective coats, we own the finish 100%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MATERIAL CATALOGUE & SYSTEMS */}
        <section id="materials" className="py-24 bg-stonecharcoal-950 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-bold text-terracotta-500 tracking-widest uppercase">System Specifications</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">Curated Materials &amp; Cladding Systems</h2>
                <p className="text-sm text-slate-400 mt-2">Every surface profile is calibrated for thickness, structural stability, and weather endurance.</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {[
                  { key: 'all', label: 'All Systems' },
                  { key: 'stone', label: 'Natural Stone' },
                  { key: 'brick', label: 'Clay & Facing Bricks' },
                  { key: 'dryclad', label: 'Dry-Clad & Substructure' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={
                      activeFilter === key
                        ? 'px-4 py-2 rounded bg-terracotta-500 text-white'
                        : 'px-4 py-2 rounded bg-stonecharcoal-900 border border-white/10 text-slate-300 hover:text-white'
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl bg-stonecharcoal-900 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {product.categoryLabel}
                      </span>
                      <span className="text-xs text-terracotta-500 font-bold">{product.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{product.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{product.description}</p>

                    <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                      {product.specs.map((spec) => (
                        <div key={spec.label} className="flex justify-between">
                          <span className="text-slate-400">{spec.label}</span>
                          <span className={`text-slate-200 ${spec.mono ? 'font-mono' : ''}`}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-stonecharcoal-950/80 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      ₹{product.rate} <span className="text-[10px] font-normal text-slate-400">{product.unit}</span>
                    </span>
                    <button
                      onClick={() => handlePrefillEstimate(product.rate)}
                      className="text-xs text-terracotta-500 hover:text-terracotta-100 font-semibold flex items-center gap-1"
                    >
                      Estimate <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE COST & PROJECT ESTIMATION CALCULATOR */}
        <section id="calculator" ref={calculatorRef} className="py-24 bg-stonecharcoal-900 border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-terracotta-500 tracking-widest uppercase">Project Cost Estimation Engine</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Estimate Supply &amp; Turnkey Installation</h2>
              <p className="text-sm text-slate-400 mt-2">
                Get an immediate approximate commercial breakdown for planning tender values or client budgets.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Controls */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Material Application
                    </label>
                    <select
                      value={selectedCalcIdx}
                      onChange={(e) => setSelectedCalcIdx(Number(e.target.value))}
                      className="w-full bg-stonecharcoal-950 border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-terracotta-500"
                    >
                      {CALCULATOR_OPTIONS.map((opt, idx) => (
                        <option key={opt.name} value={idx}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Estimated Surface Area (Sq.Ft)
                      </label>
                      <span className="text-sm font-mono text-terracotta-500 font-bold">
                        {area.toLocaleString('en-IN')} Sq.Ft
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="50"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full h-2 bg-stonecharcoal-800 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>100 Sq.Ft</span>
                      <span>5,000 Sq.Ft</span>
                      <span>10,000+ Sq.Ft</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Scope of Work</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer border border-white/10 rounded-lg p-3.5 bg-stonecharcoal-950 flex items-center justify-between has-[:checked]:border-terracotta-500 has-[:checked]:bg-terracotta-500/10">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="scopeToggle"
                            value="supply"
                            checked={scope === 'supply'}
                            onChange={() => setScope('supply')}
                            className="accent-terracotta-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">Supply Only</p>
                            <p className="text-[10px] text-slate-400">Material + Packing + Ex-factory</p>
                          </div>
                        </div>
                      </label>

                      <label className="cursor-pointer border border-white/10 rounded-lg p-3.5 bg-stonecharcoal-950 flex items-center justify-between has-[:checked]:border-terracotta-500 has-[:checked]:bg-terracotta-500/10">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="scopeToggle"
                            value="turnkey"
                            checked={scope === 'turnkey'}
                            onChange={() => setScope('turnkey')}
                            className="accent-terracotta-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">Turnkey (Recommended)</p>
                            <p className="text-[10px] text-slate-400">Material + Installation + Site Ops</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Output */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-stonecharcoal-950 rounded-xl p-6 border border-white/10">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4 border-b border-white/10 pb-2">
                      Estimated Budget Breakdown
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Selected System:</span>
                        <span className="text-slate-200 font-medium text-right max-w-[160px] truncate">{selectedMaterial.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Material Cost:</span>
                        <span className="text-slate-200 font-mono">{formatINR(materialTotal)}</span>
                      </div>
                      {isTurnkey && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Turnkey Installation &amp; Labor:</span>
                          <span className="text-slate-200 font-mono">{formatINR(installTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Wooden Crating:</span>
                        <span className="text-slate-200 font-mono">{formatINR(packingTotal)}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2 text-slate-300">
                        <span>Approximate Subtotal:</span>
                        <span className="font-mono">{formatINR(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-slate-400 uppercase tracking-widest">Estimated Value</span>
                      <span className="text-2xl font-bold text-white font-mono">{formatINR(grandTotal)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4">
                      *Exclusive of GST &amp; freight at actuals. Final rate subject to site elevation and location review.
                    </p>
                    <button
                      onClick={handleTriggerInquiryWithEstimate}
                      className="w-full accent-gradient text-white py-3 rounded text-xs uppercase tracking-wider font-semibold shadow hover:opacity-95"
                    >
                      Lock This Estimate &amp; Consult
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP EXECUTION PROCESS */}
        <section id="process" className="py-24 bg-stonecharcoal-950 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-terracotta-500 tracking-widest uppercase">Field Craftsmanship</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-1">The 4-Step Turnkey Execution Flow</h2>
              <p className="text-sm text-slate-400 mt-2">How we eliminate material damage, misalignments, and contractor delays.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                {
                  step: '01',
                  title: 'Quarry & Factory Curation',
                  desc: 'Our team visits the source factory, conducts dry-batch checks for color tone continuity, and verifies thickness tolerances before crate packing.',
                },
                {
                  step: '02',
                  title: 'Substructure & Surface Prep',
                  desc: 'Laser leveling the substrate masonry. We install stainless steel mechanical clamps, expansion slots, or structural framing needed for wind loads.',
                },
                {
                  step: '03',
                  title: 'Precision Installation',
                  desc: 'Laying by certified stone/brick masons. Consistent spacers, adhesive cavity elimination, and continuous vertical plumb line monitoring across the entire facade height.',
                },
                {
                  step: '04',
                  title: 'Grouting, Sealant & Handover',
                  desc: 'Application of UV-resistant silicone movement joints, hydrophobic water-repellent silane sealers to prevent efflorescence, and final joint punch listing.',
                },
              ].map((item) => (
                <div key={item.step} className="relative p-6 rounded-xl bg-stonecharcoal-900 border border-white/10 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stonecharcoal-800 border border-terracotta-500/40 flex items-center justify-center font-mono font-bold text-terracotta-500">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT & ARCHITECT REQUEST FORM */}
        <section id="contact" ref={contactRef} className="py-24 bg-stonecharcoal-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold text-terracotta-500 tracking-widest uppercase">Direct Engagement</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Partner With Ladrillo on Your Next Elevation</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Whether you need a full turnkey quotation, physical material sample boxes delivered to your architecture studio, or BOQ rate estimation, our technical sales team will assist you within 24 hours.
                </p>

                <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-stonecharcoal-900 border border-white/10 flex items-center justify-center text-terracotta-500 shrink-0">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">Operations Base</p>
                      <p className="text-slate-400">Thiruvallam, Trivandrum P.O 695027</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-stonecharcoal-900 border border-white/10 flex items-center justify-center text-terracotta-500 shrink-0">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">Direct Technical Line</p>
                      <p className="text-slate-400">+91 97461 33395</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-stonecharcoal-900 border border-white/10 flex items-center justify-center text-terracotta-500 shrink-0">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">Commercial Inquiries</p>
                      <p className="text-slate-400">gm@derziegel.co.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-stonecharcoal-900 border border-white/10 flex items-center justify-center text-terracotta-500 shrink-0">
                      <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">Tax &amp; Registration Compliance</p>
                      <p className="text-slate-400">GSTIN: 32DJGPN0972J1Z3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">Request Technical Quotation / Sample</h3>
                  <p className="text-xs text-slate-400 mb-6">Attach your approximate drawings or BOQ requirement.</p>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name / Firm</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ar. Rajesh Menon / Menon Associates"
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98400 00000"
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="contact@studio.in"
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Project Site City</label>
                        <input
                          type="text"
                          name="project_city"
                          required
                          value={formData.project_city}
                          onChange={handleInputChange}
                          placeholder="Trivandrum / Kochi / Kollam"
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Material of Interest</label>
                        <select
                          name="material"
                          value={formData.material}
                          onChange={handleInputChange}
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        >
                          <option>Natural Stone Cladding (Black Granite / Sandstone)</option>
                          <option>Wirecut Terracotta Brick Tiles</option>
                          <option>Dry-Clad Terracotta Facade Louvers</option>
                          <option>Stone Pavers &amp; Outdoor Landscaping</option>
                          <option>Full Turnkey Package (Supply + Installation)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Area (Sq.Ft)</label>
                        <input
                          type="number"
                          name="estimated_area_sq_ft"
                          value={formData.estimated_area_sq_ft}
                          onChange={handleInputChange}
                          placeholder="e.g. 1500"
                          className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Project Specifics or Elevation Details
                      </label>
                      <textarea
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mention elevation height, surface condition, or request a sample box to be couriered..."
                        className="w-full bg-stonecharcoal-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-terracotta-500"
                      ></textarea>
                    </div>

                    {submitStatus.type === 'success' && (
                      <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                        <i className="fa-solid fa-check-circle mr-1"></i> {submitStatus.message}
                      </div>
                    )}
                    {submitStatus.type === 'error' && (
                      <div role="alert" className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        {submitStatus.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full accent-gradient text-white py-3.5 rounded text-xs uppercase tracking-wider font-semibold shadow-lg shadow-terracotta-500/20 hover:opacity-95 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Commercial Request'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-stonecharcoal-950 border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="Ladrillo logo" className="w-8 h-8 rounded object-cover" />
                <span className="font-display font-bold text-lg tracking-wider text-white">LADRILLO</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pr-6">
                Ladrillo Structural Supply is an architectural supply and precision turnkey execution partner. We manage quarry-direct procurement, fumigated crating, logistical movement, and on-site facade engineering.
              </p>
              <div className="flex gap-4 text-slate-400 text-sm pt-2">
                <a href="https://instagram.com/ladrillostructuralsupply" className="hover:text-terracotta-500 transition-colors">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-terracotta-500 transition-colors">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://wa.me/+919746133395" className="hover:text-terracotta-500 transition-colors">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Material Specialties</p>
              <ul className="space-y-2">
                <li><a href="#materials" className="hover:text-white transition-colors">Surface Pitched Black Granite</a></li>
                <li><a href="#materials" className="hover:text-white transition-colors">Wirecut Terracotta Brick Tiles</a></li>
                <li><a href="#materials" className="hover:text-white transition-colors">Split-Face Natural Sandstone</a></li>
                <li><a href="#materials" className="hover:text-white transition-colors">Dry-Clad Louvers &amp; Substructures</a></li>
                <li><a href="#materials" className="hover:text-white transition-colors">Hydrophobic Stone Sealants</a></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Turnkey Solutions</p>
              <ul className="space-y-2">
                <li><a href="#process" className="hover:text-white transition-colors">Mechanical Stainless Pin Anchoring</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Architectural Mockup Displays</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Moisture Testing &amp; Dry Lays</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Transit Insurance Handling</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">BOQ Tender Estimation</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Business Verification</p>
              <div className="bg-stonecharcoal-900 p-3 rounded border border-white/5 space-y-1 font-mono text-[11px]">
                <p className="text-slate-300">GST: 32DJGPN0972J1Z3</p>
                <p className="text-slate-400">State: Kerala (32)</p>
                <p className="text-emerald-400 mt-2 flex items-center gap-1">
                  <i className="fa-solid fa-circle-check text-[10px]"></i> Active Entity
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
            <p>&copy; 2026 Ladrillo Structural Supply. All rights reserved.</p>
            <p className="text-slate-400">Trivandrum</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
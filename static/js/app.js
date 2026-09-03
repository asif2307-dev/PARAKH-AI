/**
 * PARAKH AI - Single Page Application Core
 * Smart India Hackathon 2026 (SIH26100) - Team Butter Chicken
 */

class ParakhApp {
  constructor() {
    this.currentView = 'dashboard';
    this.currentBidId = 'BID-2026-003';
    this.currentBid = null;
    this.bids = [];
    this.stats = null;
    this.auditLogs = [];
    this.connectors = [];
    this.filterStatus = 'All';
    this.filterRisk = 'All';
    this.searchQuery = '';
    this.isAnalyzing = false;
    this.activeChart1 = null;
    this.activeChart2 = null;

    this.currentUser = {
      name: "Rajesh Kumar",
      designation: "Senior Procurement Officer",
      department: "GeM Technical Evaluation Committee",
      role: "officer"
    };

    window.addEventListener('DOMContentLoaded', () => this.init());
  }

  async init() {
    try {
      await this.loadInitialData();
      const isLoggedIn = sessionStorage.getItem('parakh_logged_in') === 'true';
      if (isLoggedIn) {
        this.navigate('dashboard');
      } else {
        this.navigate('login');
      }
    } catch (err) {
      console.error('Initialization error:', err);
      this.showToast('Failed to initialize application', 'error');
    }
  }

  async loadInitialData() {
    try {
      const [statsData, bidsData] = await Promise.all([
        api.getDashboardStats(),
        api.getBids()
      ]);
      this.stats = statsData;
      this.bids = bidsData;
      
      const countEl = document.getElementById('sidebar-bids-count');
      if (countEl) countEl.innerText = this.bids.length;
    } catch (e) {
      console.error(e);
    }
  }

  // Navigation controller
  async navigate(view, params = {}) {
    this.currentView = view;
    this.updateNavUI(view);

    const main = document.getElementById('main-view');
    const sidebar = document.querySelector('aside');
    if (!main) return;

    if (view === 'login' || view === 'landing') {
      if (sidebar) sidebar.style.display = 'none';
      await this.renderLandingPage(main);
    } else {
      if (sidebar) sidebar.style.display = '';
      if (view === 'dashboard') {
        await this.renderDashboard(main);
      } else if (view === 'bids') {
        await this.renderBidsList(main);
      } else if (view === 'bid-detail') {
        const bidId = params.bidId || this.currentBidId;
        await this.renderBidDetail(main, bidId);
      } else if (view === 'evidence') {
        const bidId = params.bidId || this.currentBidId;
        await this.renderEvidenceMapping(main, bidId);
      } else if (view === 'verification') {
        await this.renderVerificationPanel(main);
      } else if (view === 'audit') {
        await this.renderAuditTrail(main, params.bidId);
      } else if (view === 'connectors') {
        await this.renderConnectors(main);
      }
    }
  }

  updateNavUI(activeView) {
    const navItems = ['dashboard', 'bids', 'evidence', 'verification', 'audit', 'connectors', 'login'];
    navItems.forEach(item => {
      const el = document.getElementById(`nav-${item}`);
      if (el) {
        if (item === activeView) {
          el.className = 'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition bg-gov-blue text-white shadow-xs';
          const icon = el.querySelector('i');
          if (icon) icon.className = icon.className.replace(/text-[a-z]+-[0-9]+/, 'text-white');
        } else {
          el.className = 'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition text-slate-700 hover:bg-slate-100';
        }
      }
    });
  }

  openHeroBid() {
    this.navigate('bid-detail', { bidId: 'BID-2026-003' });
  }

  // ==========================================
  // VIEW: LANDING PAGE & LOGIN
  // ==========================================
  async renderLandingPage(container) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto py-8 space-y-8 animate-fadeIn">
        <!-- Hero Header -->
        <div class="text-center space-y-3">
          <div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-trophy text-amber-500"></i>
            <span>Smart India Hackathon 2026 • SIH26100</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-gov-dark tracking-tight">
            PARAKH <span class="text-gov-accent">AI</span>
          </h1>
          <p class="text-base sm:text-lg font-bold text-slate-700">
            AI-Assisted Tender Verification & Compliance Intelligence
          </p>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            "Verify evidence. Detect contradictions. Make procurement decisions with confidence."
          </p>
          <div class="flex items-center justify-center space-x-3 text-xs pt-1">
            <span class="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">Category: Software</span>
            <span class="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">Theme: Smart Automation</span>
            <span class="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">Team: BUTTER CHICKEN</span>
          </div>
        </div>

        <!-- Login Card -->
        <div class="bg-white max-w-md mx-auto p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-5">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-sm font-bold text-slate-900 flex items-center">
              <i class="fa-solid fa-id-card text-gov-blue mr-2"></i> Official Procurement Portal Access
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">Enter demo credentials or use 1-click login below.</p>
          </div>

          <!-- Role Toggle -->
          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs font-bold text-center">
            <button type="button" id="role-tab-officer" onclick="app.switchLoginRole('officer')" class="py-1.5 rounded-md bg-white text-gov-blue shadow-xs">
              Procurement Officer
            </button>
            <button type="button" id="role-tab-admin" onclick="app.switchLoginRole('admin')" class="py-1.5 rounded-md text-slate-600 hover:text-slate-900">
              System Admin
            </button>
          </div>

          <form onsubmit="event.preventDefault(); app.handleLogin();" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">User Identifier</label>
              <div class="relative">
                <i class="fa-solid fa-user absolute left-3 top-3 text-slate-400"></i>
                <input type="text" id="login-username" value="officer" class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue/20" required />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Passcode</label>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3 top-3 text-slate-400"></i>
                <input type="password" id="login-password" value="demo123" class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue/20" required />
              </div>
            </div>

            <div class="pt-2 space-y-2">
              <button type="submit" class="w-full py-2.5 bg-gov-blue hover:bg-blue-800 text-white font-bold rounded-lg shadow transition flex items-center justify-center space-x-2">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                <span id="login-btn-text">Login as Procurement Officer</span>
              </button>
              
              <button type="button" onclick="app.bypassToDashboard()" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 transition flex items-center justify-center space-x-2">
                <span>Open Procurement Dashboard →</span>
              </button>
            </div>
          </form>

          <div class="pt-2 border-t border-slate-100 text-[11px] text-center text-slate-400">
            Simulated Sandbox Environment • No live GeM credentials required
          </div>
        </div>

        <!-- 3 Core USP Modules (From PPT Slide 2) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-gov-blue flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-link"></i>
            </div>
            <h3 class="font-bold text-xs text-slate-900">Evidence Mapping (BidDoc)</h3>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Requirement ↔ Evidence: Automatically connects tender clauses with supporting bidder documents and OCR extracts.
            </p>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-shield-check"></i>
            </div>
            <h3 class="font-bold text-xs text-slate-900">Multi-Source Verification (Verify+)</h3>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Claim ↔ Trusted Source: Cross-verifies critical bidder information against MCA21, GSTN, Udyam, and Debarment registries.
            </p>
          </div>

          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <h3 class="font-bold text-xs text-slate-900">Risk-Based SmartBid</h3>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Compliance ↔ Risk ↔ Priority: Deterministic rules prioritize high-risk bids for immediate human officer review.
            </p>
          </div>
        </div>

        <!-- Scale Footer Metrics (From PPT Slide 5) -->
        <div class="bg-gov-dark text-white p-4 rounded-xl flex flex-wrap items-center justify-around text-center gap-4 text-xs">
          <div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Buyer Reach</div>
            <div class="text-base font-black text-amber-400">1.6 Lakh+</div>
            <div class="text-[9px] text-slate-400">Govt Buyer Orgs</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Scale Secured</div>
            <div class="text-base font-black text-amber-400">₹5.43L Cr+</div>
            <div class="text-[9px] text-slate-400">GeM Platform GMV</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Review Efficiency</div>
            <div class="text-base font-black text-emerald-400">14 hrs → 2 hrs</div>
            <div class="text-[9px] text-slate-400">85.7% Time Saved</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Governance</div>
            <div class="text-base font-black text-blue-300">Officer-Led</div>
            <div class="text-[9px] text-slate-400">Final Human Sign-Off</div>
          </div>
        </div>
      </div>
    `;
  }

  switchLoginRole(role) {
    this.loginRole = role;
    const tabOfficer = document.getElementById('role-tab-officer');
    const tabAdmin = document.getElementById('role-tab-admin');
    const userInp = document.getElementById('login-username');
    const btnText = document.getElementById('login-btn-text');

    if (role === 'officer') {
      if (tabOfficer) tabOfficer.className = 'py-1.5 rounded-md bg-white text-gov-blue shadow-xs font-bold';
      if (tabAdmin) tabAdmin.className = 'py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-normal';
      if (userInp) userInp.value = 'officer';
      if (btnText) btnText.innerText = 'Login as Procurement Officer';
    } else {
      if (tabAdmin) tabAdmin.className = 'py-1.5 rounded-md bg-white text-gov-blue shadow-xs font-bold';
      if (tabOfficer) tabOfficer.className = 'py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-normal';
      if (userInp) userInp.value = 'admin';
      if (btnText) btnText.innerText = 'Login as System Administrator';
    }
  }

  async handleLogin() {
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const username = userInp ? userInp.value.trim() : 'officer';
    const password = passInp ? passInp.value.trim() : 'demo123';
    const role = this.loginRole || 'officer';

    try {
      const res = await api.login(username, password, role);
      if (res.success) {
        this.currentUser = res.user;
        sessionStorage.setItem('parakh_logged_in', 'true');
        sessionStorage.setItem('parakh_user', JSON.stringify(res.user));
        this.showToast(`Logged in as ${res.user.name} (${res.user.designation})`, 'success');
        this.navigate('dashboard');
      }
    } catch (e) {
      this.showToast('Login failed', 'error');
    }
  }

  bypassToDashboard() {
    sessionStorage.setItem('parakh_logged_in', 'true');
    this.showToast('Entered Procurement Intelligence Dashboard', 'info');
    this.navigate('dashboard');
  }

  logout() {
    sessionStorage.removeItem('parakh_logged_in');
    this.showToast('Logged out successfully', 'info');
    this.navigate('login');
  }

  // ==========================================
  // VIEW: DASHBOARD
  // ==========================================
  async renderDashboard(container) {
    this.stats = await api.getDashboardStats();
    const recentBids = await api.getBids();

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- Top Title & Quick Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight">Procurement Compliance Intelligence Dashboard</h1>
              <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">Live AI System</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">GeM National Procurement Portal • AI-Powered Bid Verification (SIH26100)</p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="app.openHeroBid()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center space-x-2">
              <i class="fa-solid fa-play"></i>
              <span>Launch Hero Demo Bid (BID-2026-003)</span>
            </button>
            <button onclick="app.navigate('bids')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-2.5 rounded-lg border border-slate-300 transition">
              <i class="fa-solid fa-list mr-1"></i> View All Bids
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Bids -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bids Evaluated</div>
              <div class="text-2xl font-black text-slate-900 mt-1">${this.stats.total_bids}</div>
              <div class="text-[11px] text-slate-500 mt-1 flex items-center text-emerald-600 font-medium">
                <i class="fa-solid fa-arrow-trend-up mr-1"></i> +14% from last month
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center text-xl">
              <i class="fa-solid fa-folder-closed"></i>
            </div>
          </div>

          <!-- Pending Reviews -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Officer Reviews</div>
              <div class="text-2xl font-black text-amber-600 mt-1">${this.stats.pending_reviews}</div>
              <div class="text-[11px] text-slate-500 mt-1 flex items-center font-medium">
                <span class="pulse-dot bg-amber-500 mr-1.5"></span> Requires officer determination
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <i class="fa-solid fa-hourglass-half"></i>
            </div>
          </div>

          <!-- High Risk Bids -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High Risk / Contradictions</div>
              <div class="text-2xl font-black text-rose-600 mt-1">${this.stats.high_risk_bids}</div>
              <div class="text-[11px] text-rose-600 mt-1 flex items-center font-semibold">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i> Discrepancies detected
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
              <i class="fa-solid fa-circle-exclamation"></i>
            </div>
          </div>

          <!-- Compliance Rate -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compliance Rate</div>
              <div class="text-2xl font-black text-emerald-700 mt-1">${this.stats.compliance_rate}%</div>
              <div class="text-[11px] text-slate-500 mt-1">Rule Engine validated</div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i class="fa-solid fa-circle-check"></i>
            </div>
          </div>
        </div>

        <!-- SIH PPT Innovation & Benchmarks Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Review Time Benchmark Card (Matching PPT Slide 5) -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">Review Time per Vendor</span>
                <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Prototype Target</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-1">Comparing manual bid compliance review vs PARAKH AI automated extraction.</p>
              <div class="h-44 mt-4">
                <canvas id="benchmarkChart"></canvas>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
              <span>Time Reduction: <strong class="text-emerald-600">85.7% Saved</strong></span>
              <span>Manual: <strong>14 hrs</strong> → AI: <strong>2 hrs</strong></span>
            </div>
          </div>

          <!-- Sample Batch Outcome (Matching PPT Slide 5) -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">Sample Batch Outcome (%)</span>
                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Prototype Batch</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-1">Distribution across compliance qualification brackets.</p>
              <div class="h-44 mt-4 flex items-center justify-center">
                <canvas id="outcomeChart"></canvas>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
              <div>
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                <span class="text-slate-600">Pass: <strong>70%</strong></span>
              </div>
              <div>
                <span class="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                <span class="text-slate-600">Review: <strong>18%</strong></span>
              </div>
              <div>
                <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1"></span>
                <span class="text-slate-600">Fail: <strong>12%</strong></span>
              </div>
            </div>
          </div>

          <!-- Innovation & Principle Card (PPT Slide 2 & 5) -->
          <div class="bg-gradient-to-br from-gov-dark to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div class="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Core Innovation & USP</span>
              </div>
              <h3 class="text-base font-bold mt-2 text-white">Deterministic Rule Engine</h3>
              <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                "AI extracts, rules validate." LLM and OCR parse complex tender documents and map evidence, while deterministic logic guarantees verifiable, explainable compliance decisions.
              </p>
              
              <div class="mt-4 space-y-2 text-xs">
                <div class="flex items-start space-x-2">
                  <i class="fa-solid fa-check text-emerald-400 mt-0.5"></i>
                  <span class="text-slate-200"><strong>Evidence Mapping (BidDoc):</strong> Requirement ↔ Evidence linkage.</span>
                </div>
                <div class="flex items-start space-x-2">
                  <i class="fa-solid fa-check text-emerald-400 mt-0.5"></i>
                  <span class="text-slate-200"><strong>Multi-Source Verification (Verify+):</strong> Cross-verifies with MCA21, GSTN, Udyam.</span>
                </div>
                <div class="flex items-start space-x-2">
                  <i class="fa-solid fa-check text-emerald-400 mt-0.5"></i>
                  <span class="text-slate-200"><strong>Officer-Led Governance:</strong> Decision support only; final sign-off is human.</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
              <span>GeM GMV Secured: <strong class="text-amber-300">₹5.43L Cr+</strong></span>
              <button onclick="app.navigate('verification')" class="text-blue-400 hover:text-blue-300 font-semibold underline">Explore Connectors →</button>
            </div>
          </div>
        </div>

        <!-- Recent Bids Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-slate-800">Recent Bid Submissions (GeM Procurement Queue)</h2>
              <p class="text-xs text-slate-500 mt-0.5">Click any bid to inspect requirements, evidence mapping, and contradictions.</p>
            </div>
            <button onclick="app.navigate('bids')" class="text-xs font-bold text-gov-blue hover:underline">
              View All ${recentBids.length} Bids →
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">Bid ID</th>
                  <th class="py-3 px-4">Tender Title</th>
                  <th class="py-3 px-4">Vendor</th>
                  <th class="py-3 px-4">Compliance</th>
                  <th class="py-3 px-4">Risk</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${recentBids.map(b => this.renderBidRow(b)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Render Charts
    this.renderDashboardCharts();
  }

  renderBidRow(b) {
    const isHero = b.id === 'BID-2026-003';
    return `
      <tr class="hover:bg-slate-50/80 transition cursor-pointer ${isHero ? 'bg-amber-50/40 font-medium' : ''}" onclick="app.navigate('bid-detail', { bidId: '${b.id}' })">
        <td class="py-3 px-4 whitespace-nowrap">
          <div class="font-bold text-gov-blue flex items-center space-x-1.5">
            <span>${b.id}</span>
            ${isHero ? '<span class="bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">DEMO HERO</span>' : ''}
          </div>
          <div class="text-[10px] text-slate-400">${b.submission_date}</div>
        </td>
        <td class="py-3 px-4 max-w-xs truncate">
          <div class="font-medium text-slate-800">${b.tender_title}</div>
          <div class="text-[10px] text-slate-400">${b.tender_id} • ${b.department}</div>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <div class="font-semibold text-slate-800">${b.vendor_name}</div>
          <div class="text-[10px] text-slate-400">GSTIN: ${b.vendor_gstin}</div>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${b.is_analyzed || b.compliance_score > 0 ? `
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div class="h-2 rounded-full ${b.compliance_score >= 85 ? 'bg-emerald-600' : b.compliance_score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}" style="width: ${b.compliance_score}%"></div>
              </div>
              <span class="font-bold ${b.compliance_score >= 85 ? 'text-emerald-700' : b.compliance_score >= 60 ? 'text-amber-700' : 'text-rose-700'}">${b.compliance_score}%</span>
            </div>
          ` : '<span class="text-slate-400 italic">Not Analyzed</span>'}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${this.getRiskBadge(b.risk_level)}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          ${this.getStatusBadge(b.status)}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <button onclick="event.stopPropagation(); app.navigate('bid-detail', { bidId: '${b.id}' })" class="px-3 py-1 bg-gov-blue hover:bg-blue-800 text-white font-semibold rounded text-xs transition">
            ${b.is_analyzed ? 'View Analysis' : 'Open & Analyze'}
          </button>
        </td>
      </tr>
    `;
  }

  renderDashboardCharts() {
    // 1. Benchmark Chart (14h manual vs 2h with PARAKH AI)
    const ctx1 = document.getElementById('benchmarkChart');
    if (ctx1) {
      if (this.activeChart1) this.activeChart1.destroy();
      this.activeChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Manual Review', 'With PARAKH AI'],
          datasets: [{
            label: 'Hours per Vendor',
            data: [14, 2],
            backgroundColor: ['#f87171', '#0284c7'],
            borderRadius: 6,
            barThickness: 38
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 16, ticks: { stepSize: 4 } }
          }
        }
      });
    }

    // 2. Outcome Chart (70% Compliant, 18% Needs Review, 12% Non-Compliant)
    const ctx2 = document.getElementById('outcomeChart');
    if (ctx2) {
      if (this.activeChart2) this.activeChart2.destroy();
      this.activeChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Compliant (70%)', 'Needs Review (18%)', 'Non-Compliant (12%)'],
          datasets: [{
            data: [70, 18, 12],
            backgroundColor: ['#059669', '#d97706', '#dc2626'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '72%'
        }
      });
    }
  }

  // ==========================================
  // VIEW: BIDS MANAGEMENT
  // ==========================================
  async renderBidsList(container) {
    this.bids = await api.getBids({
      status: this.filterStatus,
      risk: this.filterRisk,
      search: this.searchQuery
    });

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- Header -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight">GeM Bids Management</h1>
            <p class="text-xs text-slate-500 mt-0.5">Filter, search, and initiate AI compliance analysis on tender bids.</p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="app.openHeroBid()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition flex items-center space-x-1.5">
              <i class="fa-solid fa-play"></i>
              <span>Launch Hero Bid (BID-2026-003)</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-1 min-w-[240px]">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search by Bid ID, Vendor, or Tender Title..." 
              value="${this.searchQuery}"
              oninput="app.onSearchInput(this.value)"
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue"
            />
          </div>

          <!-- Status Filter -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-slate-500 font-semibold">Status:</span>
            <select onchange="app.onFilterStatus(this.value)" class="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gov-blue/20">
              <option ${this.filterStatus === 'All' ? 'selected' : ''}>All</option>
              <option ${this.filterStatus === 'Compliant' ? 'selected' : ''}>Compliant</option>
              <option ${this.filterStatus === 'Needs Review' ? 'selected' : ''}>Needs Review</option>
              <option ${this.filterStatus === 'Non-Compliant' ? 'selected' : ''}>Non-Compliant</option>
              <option ${this.filterStatus === 'Under Analysis' ? 'selected' : ''}>Under Analysis</option>
            </select>
          </div>

          <!-- Risk Filter -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-slate-500 font-semibold">Risk:</span>
            <select onchange="app.onFilterRisk(this.value)" class="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gov-blue/20">
              <option ${this.filterRisk === 'All' ? 'selected' : ''}>All</option>
              <option ${this.filterRisk === 'Low' ? 'selected' : ''}>Low</option>
              <option ${this.filterRisk === 'Medium' ? 'selected' : ''}>Medium</option>
              <option ${this.filterRisk === 'High' ? 'selected' : ''}>High</option>
            </select>
          </div>
        </div>

        <!-- Bids Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">Bid ID</th>
                  <th class="py-3 px-4">Tender Details</th>
                  <th class="py-3 px-4">Vendor Organization</th>
                  <th class="py-3 px-4">Compliance</th>
                  <th class="py-3 px-4">Risk Level</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.bids.length === 0 ? `
                  <tr>
                    <td colspan="7" class="py-12 text-center text-slate-400">
                      <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
                      <p>No bids match the specified filters.</p>
                    </td>
                  </tr>
                ` : this.bids.map(b => this.renderBidRow(b)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  onSearchInput(val) {
    this.searchQuery = val;
    this.renderBidsList(document.getElementById('main-view'));
  }

  onFilterStatus(val) {
    this.filterStatus = val;
    this.renderBidsList(document.getElementById('main-view'));
  }

  onFilterRisk(val) {
    this.filterRisk = val;
    this.renderBidsList(document.getElementById('main-view'));
  }

  // ==========================================
  // VIEW: BID DETAIL / ANALYSIS (Hero Screen)
  // ==========================================
  async renderBidDetail(container, bidId) {
    this.currentBidId = bidId;
    this.currentBid = await api.getBidDetail(bidId);
    const b = this.currentBid;

    const hasContradictions = b.contradictions && b.contradictions.length > 0;
    const isAnalyzed = b.is_analyzed || b.status !== 'Under Analysis';

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        
        <!-- Breadcrumb & Top Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div class="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <a href="#" onclick="app.navigate('bids')" class="hover:underline">Bids Queue</a>
              <span>/</span>
              <span class="font-bold text-slate-700">${b.id}</span>
              ${b.id === 'BID-2026-003' ? '<span class="bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">MAIN DEMO BID</span>' : ''}
            </div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight">${b.vendor_name}</h1>
            <p class="text-xs text-slate-500 mt-0.5">${b.tender_title} (${b.tender_id})</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            ${!isAnalyzed ? `
              <button onclick="app.runAnalysis('${b.id}')" class="bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center space-x-2">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                <span>Start AI Compliance Analysis</span>
              </button>
            ` : `
              <button onclick="app.runAnalysis('${b.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 transition flex items-center space-x-1.5">
                <i class="fa-solid fa-arrows-rotate"></i>
                <span>Re-Analyze</span>
              </button>
              <button onclick="app.verifyBid('${b.id}')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs px-3 py-2 rounded-lg border border-emerald-300 transition flex items-center space-x-1.5">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Re-Verify Connectors</span>
              </button>
              <button onclick="app.openDecisionModal('${b.id}')" class="bg-gov-dark hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center space-x-2">
                <i class="fa-solid fa-signature text-amber-400"></i>
                <span>Record Officer Decision</span>
              </button>
            `}
            <button onclick="app.resetBidState('${b.id}')" class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition" title="Reset this bid to initial state">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          </div>
        </div>

        <!-- Analysis Live Stage Progress Bar (Animated during analysis) -->
        <div id="analysis-progress-container" class="${this.isAnalyzing ? 'block' : 'hidden'} bg-white p-5 rounded-2xl border-2 border-blue-500 shadow-md">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="pulse-dot bg-blue-600"></span>
              <span class="font-bold text-xs text-gov-blue uppercase tracking-wider">AI Verification Pipeline in Progress...</span>
            </div>
            <span class="text-xs text-slate-500" id="analysis-step-timer">Running PaddleOCR & Rule Engine</span>
          </div>
          <div class="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
            <div id="prog-step-1" class="p-2 rounded bg-blue-100 text-blue-900 border border-blue-200">1. Clause Extraction</div>
            <div id="prog-step-2" class="p-2 rounded bg-slate-100 text-slate-500 border border-slate-200">2. PaddleOCR Read</div>
            <div id="prog-step-3" class="p-2 rounded bg-slate-100 text-slate-500 border border-slate-200">3. BidDoc Mapping</div>
            <div id="prog-step-4" class="p-2 rounded bg-slate-100 text-slate-500 border border-slate-200">4. Verify+ Connectors</div>
            <div id="prog-step-5" class="p-2 rounded bg-slate-100 text-slate-500 border border-slate-200">5. Contradiction Flag</div>
          </div>
        </div>

        <!-- HERO CONTRADICTION BANNER (When Discrepancies are Detected) -->
        ${hasContradictions ? this.renderHeroContradictionBanner(b) : ''}

        <!-- KPI Summary Cards for this Bid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Compliance Score -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compliance Score</div>
            <div class="flex items-baseline space-x-2 mt-1">
              <span class="text-3xl font-black ${b.compliance_score >= 85 ? 'text-emerald-600' : b.compliance_score >= 60 ? 'text-amber-600' : 'text-rose-600'}">
                ${b.compliance_score}%
              </span>
              <span class="text-xs text-slate-400">/ 100%</span>
            </div>
            <div class="text-[10px] text-slate-500 mt-1">
              Deterministic rule engine validated
            </div>
          </div>

          <!-- Risk Level -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assessed Risk Level</div>
            <div class="mt-1 flex items-center space-x-2">
              ${this.getRiskBadge(b.risk_level)}
            </div>
            <div class="text-[10px] text-slate-500 mt-2">
              ${b.risk_level === 'High' ? 'Flagged due to conflicting external records' : 'Low variance across registries'}
            </div>
          </div>

          <!-- Requirements Breakdown -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Requirements Verification</div>
            <div class="mt-1 flex items-center space-x-3 text-xs">
              <span class="text-emerald-700 font-bold"><i class="fa-solid fa-check mr-1"></i>${b.passed_requirements} Pass</span>
              <span class="text-amber-700 font-bold"><i class="fa-solid fa-circle-question mr-1"></i>${b.review_requirements} Review</span>
              <span class="text-rose-700 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i>${b.failed_requirements} Flag</span>
            </div>
            <div class="text-[10px] text-slate-500 mt-2">
              Total ${b.requirements ? b.requirements.length : 0} clauses evaluated
            </div>
          </div>

          <!-- Officer Decision Status -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Officer Sign-Off Status</div>
            <div class="mt-1">
              ${this.getStatusBadge(b.status)}
            </div>
            <div class="text-[10px] text-slate-500 mt-2">
              ${b.officer_decision ? `Signed by ${b.officer_decision.officer_name}` : 'Awaiting officer determination'}
            </div>
          </div>
        </div>

        <!-- Officer Decision Banner if already submitted -->
        ${b.officer_decision ? this.renderOfficerDecisionSummary(b.officer_decision) : ''}

        <!-- Requirements & Evidence Mapping Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center space-x-2">
                <h2 class="text-sm font-bold text-slate-800">Tender Requirements & Evidence Mapping (BidDoc)</h2>
                <span class="sim-ribbon">Deterministic Evaluation</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Every requirement is linked to its extracted claim, source document page, and verified registry record.</p>
            </div>
            <div class="flex items-center space-x-2 text-xs">
              <button onclick="app.navigate('evidence', { bidId: '${b.id}' })" class="text-gov-blue hover:underline font-semibold">
                Open Interactive Graph View →
              </button>
            </div>
          </div>

          <div class="divide-y divide-slate-100">
            ${b.requirements && b.requirements.length > 0 ? b.requirements.map((req, idx) => this.renderRequirementRow(req, idx, b)).join('') : `
              <div class="p-8 text-center text-slate-400 text-xs">
                No requirement clauses mapped yet. Click "Start AI Compliance Analysis" to extract.
              </div>
            `}
          </div>
        </div>

        <!-- Submitted Documents Gallery -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-800">Submitted Bidder Documents (${b.documents ? b.documents.length : 0})</h3>
              <p class="text-xs text-slate-500">Processed by PaddleOCR engine for structured data extraction.</p>
            </div>
            <span class="text-xs text-slate-400 font-medium">All OCR coordinates preserved</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${b.documents ? b.documents.map(doc => `
              <div class="p-3.5 rounded-xl border border-slate-200 hover:border-gov-blue/50 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div class="flex items-start space-x-2.5">
                    <i class="fa-solid fa-file-pdf text-rose-600 text-xl mt-0.5"></i>
                    <div class="min-w-0 flex-1">
                      <div class="font-bold text-xs text-slate-800 truncate" title="${doc.name}">${doc.name}</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">${doc.type} • ${doc.pages} Pages • ${doc.size}</div>
                    </div>
                  </div>
                  <div class="mt-3 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 italic line-clamp-2">
                    "${doc.snippet || 'Extracted document text snippet...'}"
                  </div>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span class="text-[10px] text-emerald-700 font-semibold"><i class="fa-solid fa-check mr-1"></i>OCR Parsed</span>
                  <button onclick="app.previewDocument('${doc.name}', 1, 'Extracted Document', 'N/A', '${encodeURIComponent(doc.snippet || '')}')" class="text-gov-blue hover:text-blue-800 font-bold text-[11px]">
                    Preview & Highlight →
                  </button>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // HERO FEATURE: CONTRADICTION BANNER
  // ==========================================
  renderHeroContradictionBanner(bid) {
    return `
      <div class="contradiction-badge p-5 rounded-2xl border border-rose-300 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2.5">
            <span class="pulse-dot-red"></span>
            <div>
              <span class="text-xs font-black tracking-wider uppercase text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded border border-rose-300">
                ⚠ HERO FEATURE: CONTRADICTION DETECTED
              </span>
              <h2 class="text-base font-black text-rose-950 mt-1">Multi-Source Verification Inconsistencies Found (${bid.contradictions.length})</h2>
            </div>
          </div>
          <span class="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
            Risk: HIGH
          </span>
        </div>

        <p class="text-xs text-rose-900 leading-relaxed font-medium">
          The automated cross-verification engine (Verify+) compared bidder claims with independent regulatory databases. Discrepancies have been identified between submitted documentation and statutory registries. The procurement officer must review the evidence below before making a sign-off determination.
        </p>

        <!-- Contradictions Comparison Cards -->
        <div class="grid grid-cols-1 gap-3">
          ${bid.contradictions.map(ct => `
            <div class="bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-rose-200 shadow-xs space-y-3">
              <div class="flex items-center justify-between border-b border-rose-100 pb-2">
                <div class="flex items-center space-x-2">
                  <span class="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-rose-200">
                    ${ct.category}
                  </span>
                  <span class="font-bold text-xs text-slate-800">${ct.clause_title}</span>
                </div>
                <span class="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Severity: ${ct.severity}
                </span>
              </div>

              <!-- 3-Way Comparison: Tender vs Bidder vs Registry -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <!-- Tender Requirement -->
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">1. Tender Requirement</div>
                  <div class="font-semibold text-slate-800 mt-1">${ct.tender_specification}</div>
                </div>

                <!-- Bidder Claim -->
                <div class="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200">
                  <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wide">2. Bidder Document Claim</div>
                  <div class="font-bold text-amber-950 mt-1">${ct.bidder_claimed_value}</div>
                  <div class="text-[10px] text-amber-800 mt-0.5">
                    Source: <a href="#" onclick="app.previewDocument('${ct.evidence_document}', ${ct.evidence_page}, '${ct.clause_title}', '${ct.bidder_claimed_value}')" class="underline font-bold">${ct.evidence_document} (Page ${ct.evidence_page})</a>
                  </div>
                </div>

                <!-- External Registry Record -->
                <div class="p-2.5 bg-rose-50 rounded-lg border border-rose-200">
                  <div class="text-[10px] font-bold text-rose-700 uppercase tracking-wide">3. Verified External Source</div>
                  <div class="font-bold text-rose-950 mt-1">${ct.verified_external_value}</div>
                  <div class="text-[10px] text-rose-800 mt-0.5">
                    Source: <strong>${ct.verification_source}</strong>
                  </div>
                </div>
              </div>

              <!-- Neutral Government Explanation -->
              <div class="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-700 flex items-start space-x-2">
                <i class="fa-solid fa-circle-info text-rose-600 mt-0.5"></i>
                <div class="leading-relaxed">
                  <strong>System Finding:</strong> ${ct.explanation}
                </div>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-slate-500 italic text-[11px]">${ct.risk_impact}</span>
                <div class="flex items-center space-x-2">
                  <button onclick="app.previewDocument('${ct.evidence_document}', ${ct.evidence_page}, '${ct.clause_title}', '${ct.bidder_claimed_value}')" class="text-xs font-bold text-gov-blue hover:text-blue-800 flex items-center space-x-1">
                    <i class="fa-solid fa-eye"></i>
                    <span>Inspect Page ${ct.evidence_page}</span>
                  </button>
                  <span class="text-slate-300">|</span>
                  <button onclick="app.openDecisionModal('${bid.id}', 'SEND_FOR_REVIEW', '${ct.explanation.replace(/'/g, "\\'")}')" class="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-1">
                    <i class="fa-solid fa-file-pen"></i>
                    <span>Address in Decision</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRequirementRow(req, idx, bid) {
    const evd = req.evidence;
    const ver = req.verification;
    const isContradiction = req.status === 'CONTRADICTION';
    const isReview = req.status === 'NEEDS_REVIEW';
    const isCompliant = req.status === 'COMPLIANT';

    return `
      <div class="p-4 sm:p-5 hover:bg-slate-50/70 transition space-y-3">
        <!-- Clause Title & Status Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="bg-slate-200 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded">${req.clause_number}</span>
            <span class="font-bold text-xs text-slate-800">${req.title}</span>
            ${req.is_mandatory ? '<span class="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">Mandatory</span>' : '<span class="bg-slate-100 text-slate-600 text-[9px] font-semibold px-1.5 py-0.2 rounded">Optional</span>'}
          </div>
          <div class="flex items-center space-x-2">
            ${this.getStatusBadge(req.status)}
            ${this.getRiskBadge(req.risk_level)}
          </div>
        </div>

        <p class="text-xs text-slate-600">${req.description}</p>

        <!-- Requirement vs Evidence vs Verification Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          
          <!-- Extracted Claim -->
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Submitted Claim</span>
              ${evd ? `<span class="text-emerald-700 font-semibold">OCR ${evd.ocr_confidence}%</span>` : ''}
            </div>
            ${evd ? `
              <div class="font-bold text-slate-900 mt-1">${evd.extracted_value}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">
                Doc: <button onclick="app.previewDocument('${evd.document_name}', ${evd.page_number}, '${req.title}', '${evd.extracted_value}', '${encodeURIComponent(evd.extracted_text)}')" class="text-gov-blue hover:underline font-semibold">${evd.document_name} (P.${evd.page_number})</button>
              </div>
            ` : '<div class="text-slate-400 italic mt-1">No claim document provided</div>'}
          </div>

          <!-- Verified Registry Record -->
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Verified External Source</span>
              <span class="sim-ribbon">Simulated</span>
            </div>
            ${ver ? `
              <div class="font-bold ${isContradiction ? 'text-rose-700' : 'text-slate-900'} mt-1">
                ${ver.verified_value}
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">${ver.source_name}</div>
            ` : '<div class="text-slate-400 italic mt-1">Verification pending</div>'}
          </div>

          <!-- System Finding & Confidence -->
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              AI Evaluation
            </div>
            <div class="text-xs font-semibold ${isContradiction ? 'text-rose-700' : isCompliant ? 'text-emerald-700' : 'text-amber-700'} mt-1">
              ${req.finding_summary}
            </div>
            <div class="mt-1 flex items-center justify-between">
              <span class="text-[10px] text-slate-400">Confidence: ${req.match_confidence}%</span>
              ${evd ? `
                <button onclick="app.previewDocument('${evd.document_name}', ${evd.page_number}, '${req.title}', '${evd.extracted_value}', '${encodeURIComponent(evd.extracted_text)}')" class="text-[11px] font-bold text-gov-blue hover:underline">
                  <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>View Evidence
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderOfficerDecisionSummary(dec) {
    const isApprove = dec.decision === 'APPROVE';
    const isReject = dec.decision === 'REJECT';

    return `
      <div class="bg-white p-5 rounded-2xl border-2 ${isApprove ? 'border-emerald-400 bg-emerald-50/20' : isReject ? 'border-rose-400 bg-rose-50/20' : 'border-amber-400 bg-amber-50/20'} shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-stamp text-xl ${isApprove ? 'text-emerald-600' : isReject ? 'text-rose-600' : 'text-amber-600'}"></i>
            <div>
              <span class="text-xs text-slate-500 font-semibold uppercase">Procurement Officer Official Determination:</span>
              <div class="text-sm font-black text-slate-900">${dec.decision} — Status: ${dec.new_status}</div>
            </div>
          </div>
          <span class="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
            ${dec.digital_signature || 'DSIG-RECORDED'}
          </span>
        </div>
        <div class="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic">
          "${dec.reason}"
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Signed by: <strong>${dec.officer_name}</strong> (${dec.officer_designation})</span>
          <span>Timestamp: <strong>${dec.timestamp}</strong></span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: EVIDENCE MAPPING (BidDoc Graph)
  // ==========================================
  async renderEvidenceMapping(container, bidId) {
    this.currentBidId = bidId || 'BID-2026-003';
    const data = await api.getEvidenceMapping(this.currentBidId);

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight">Requirement–Evidence Mapping (BidDoc)</h1>
              <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">USP Module</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${data.vendor_name} • ${data.bid_id} (${data.mapped_clauses_count} Mapped Clauses)</p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="app.navigate('bid-detail', { bidId: '${data.bid_id}' })" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 transition">
              ← Return to Bid Detail
            </button>
          </div>
        </div>

        <!-- Explanation Card -->
        <div class="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
          <i class="fa-solid fa-circle-nodes text-indigo-600 text-base mt-0.5"></i>
          <div>
            <strong>Automated Clause-to-Evidence Linkage:</strong> Every tender eligibility requirement is semantically mapped to the exact page, table, and line of the submitted bidder documents, cross-referenced against external registries. No score is generated without full audit proof.
          </div>
        </div>

        <!-- Mapping Cards Flow -->
        <div class="space-y-4">
          ${data.nodes.map(node => `
            <div class="bg-white p-5 rounded-2xl border ${node.overall_status === 'CONTRADICTION' ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'} shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded">${node.clause_number}</span>
                  <h3 class="font-bold text-xs text-slate-800">${node.clause_title}</h3>
                </div>
                <div class="flex items-center space-x-2">
                  ${this.getStatusBadge(node.overall_status)}
                  ${this.getRiskBadge(node.risk_level)}
                </div>
              </div>

              <!-- Visual 4-Stage Horizontal Pipeline -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                <!-- Stage 1: Tender Specification -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">1. Tender Clause</span>
                  <div class="font-semibold text-slate-800 text-[11px]">${node.tender_requirement}</div>
                </div>

                <!-- Stage 2: Extracted Bidder Evidence -->
                <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-200 relative">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-bold text-blue-700 uppercase tracking-wider">2. Extracted Claim</span>
                    <span class="text-[9px] font-bold text-emerald-700">OCR ${node.ocr_confidence}%</span>
                  </div>
                  <div class="font-bold text-slate-900 text-[11px]">${node.extracted_claim}</div>
                  <div class="text-[10px] text-blue-800 mt-1">
                    <button onclick="app.previewDocument('${node.supporting_document}', ${node.page_number}, '${node.clause_title}', '${node.extracted_claim}', '${encodeURIComponent(node.document_snippet)}')" class="hover:underline font-bold">
                      ${node.supporting_document} (Page ${node.page_number}) →
                    </button>
                  </div>
                </div>

                <!-- Stage 3: External Registry Cross-Check -->
                <div class="p-3 ${node.overall_status === 'CONTRADICTION' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'} rounded-xl border relative">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">3. External Registry</span>
                    <span class="sim-ribbon">Verify+</span>
                  </div>
                  <div class="font-bold ${node.overall_status === 'CONTRADICTION' ? 'text-rose-700' : 'text-slate-900'} text-[11px]">${node.verified_value}</div>
                  <div class="text-[10px] text-slate-500 mt-1">${node.verification_source}</div>
                </div>

                <!-- Stage 4: Result -->
                <div class="p-3 ${node.overall_status === 'CONTRADICTION' ? 'bg-rose-100/70 border-rose-300' : 'bg-emerald-50 border-emerald-200'} rounded-xl border flex flex-col justify-between">
                  <div>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">4. Finding</span>
                    <div class="font-black text-xs ${node.overall_status === 'CONTRADICTION' ? 'text-rose-900' : 'text-emerald-900'}">
                      ${node.overall_status}
                    </div>
                  </div>
                  <div class="text-[10px] text-slate-600 mt-2">
                    ${node.overall_status === 'CONTRADICTION' ? 'Conflicting turnover/date identified' : 'Verified match against record'}
                  </div>
                </div>
              </div>

              <!-- Document Snippet -->
              <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono">
                <span class="text-slate-400 select-none">Evidence Snippet: </span>"${node.document_snippet}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: MULTI-SOURCE VERIFICATION (Verify+)
  // ==========================================
  async renderVerificationPanel(container) {
    const data = await api.getConnectors();
    const connectors = data.connectors || [];

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight">Multi-Source Verification (Verify+)</h1>
              <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">Simulated Connectors</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Independent government registries used to cross-verify claims without manual human lookup.</p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="app.testAllConnectors()" class="bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5">
              <i class="fa-solid fa-network-wired"></i>
              <span>Ping All Connectors</span>
            </button>
          </div>
        </div>

        <!-- Transparent Demo Mode Notice -->
        <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
          <i class="fa-solid fa-shield-halved text-amber-600 text-base mt-0.5"></i>
          <div>
            <strong>Simulation Sandbox Notice:</strong> In accordance with SIH prototype guidelines, all external government connectors are executed via high-fidelity simulated endpoints returning deterministic ROC, GSTN, Udyam, and Debarment data. No unauthorized live API calls are transmitted to production servers.
          </div>
        </div>

        <!-- Connectors Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${connectors.map(c => `
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${c.type}</span>
                    <h3 class="font-bold text-sm text-slate-900 mt-0.5">${c.name}</h3>
                  </div>
                  <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                    <span class="pulse-dot bg-emerald-500 mr-1.5"></span> ${c.status}
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">${c.description}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div class="flex items-center space-x-3">
                  <span>Latency: <strong class="text-slate-800">${c.latency_ms} ms</strong></span>
                  <span>•</span>
                  <span>Scope: <strong class="text-slate-800">${c.records_count}</strong></span>
                </div>
                <button onclick="app.testConnector('${c.id}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs transition">
                  Test Query →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: AUDIT TRAIL
  // ==========================================
  async renderAuditTrail(container, filterBidId = null) {
    const data = await api.getAuditTrail(filterBidId);
    const logs = data.logs || [];

    container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight">System & Officer Audit Trail</h1>
              <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">Tamper-Evident</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Chronological, cryptographically signed ledger of all extractions, contradiction flags, and officer determinations.</p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="app.navigate('audit')" class="text-xs text-gov-blue hover:underline font-semibold">
              Refresh Ledger (${logs.length} Entries)
            </button>
          </div>
        </div>

        <!-- Audit Timeline Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">Timestamp</th>
                  <th class="py-3 px-4">Action Type</th>
                  <th class="py-3 px-4">Actor</th>
                  <th class="py-3 px-4">Bid ID</th>
                  <th class="py-3 px-4">Event Details</th>
                  <th class="py-3 px-4">Verification Hash</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${logs.map(log => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                      ${log.timestamp}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="font-bold text-[10px] px-2 py-0.5 rounded ${
                        log.action_type === 'CONTRADICTION_FLAGGED' ? 'bg-rose-100 text-rose-800' :
                        log.action_type === 'OFFICER_DECISION' ? 'bg-gov-dark text-white' :
                        log.action_type === 'CONNECTOR_VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }">
                        ${log.action_type}
                      </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap font-semibold text-slate-800">
                      ${log.actor}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap font-bold text-gov-blue">
                      ${log.bid_id || 'SYSTEM'}
                    </td>
                    <td class="py-3 px-4 max-w-md text-slate-700 leading-relaxed">
                      ${log.details}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap font-mono text-[10px] text-slate-400">
                      ${log.hash_signature.slice(0, 18)}...
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW: CONNECTORS & SYSTEM
  // ==========================================
  async renderConnectors(container) {
    return this.renderVerificationPanel(container);
  }

  // ==========================================
  // ACTIONS & INTERACTIONS
  // ==========================================
  async runAnalysis(bidId) {
    this.isAnalyzing = true;
    const progressEl = document.getElementById('analysis-progress-container');
    if (progressEl) progressEl.classList.remove('hidden');

    const steps = [
      { id: 'prog-step-1', text: '1. Clause Extraction: Complete (6 clauses)' },
      { id: 'prog-step-2', text: '2. PaddleOCR Read: 6 PDF documents parsed' },
      { id: 'prog-step-3', text: '3. BidDoc Mapping: Linking evidence pages' },
      { id: 'prog-step-4', text: '4. Verify+ Connectors: Querying MCA21 & GSTN' },
      { id: 'prog-step-5', text: '5. Contradiction Flag: Discrepancies detected' }
    ];

    // Believable animated progression
    for (let i = 0; i < steps.length; i++) {
      const stepEl = document.getElementById(steps[i].id);
      if (stepEl) {
        stepEl.className = 'p-2 rounded bg-blue-600 text-white font-bold animate-pulse';
      }
      await new Promise(r => setTimeout(r, 450));
      if (stepEl) {
        stepEl.className = 'p-2 rounded bg-emerald-600 text-white font-bold';
      }
    }

    try {
      const res = await api.analyzeBid(bidId);
      this.isAnalyzing = false;
      this.showToast(`Bid ${bidId} analyzed successfully!`, 'success');
      await this.renderBidDetail(document.getElementById('main-view'), bidId);
    } catch (err) {
      this.isAnalyzing = false;
      this.showToast('Analysis error occurred', 'error');
    }
  }

  async verifyBid(bidId) {
    try {
      await api.verifyBid(bidId);
      this.showToast('Multi-Source connectors re-queried successfully.', 'success');
      await this.renderBidDetail(document.getElementById('main-view'), bidId);
    } catch (e) {
      this.showToast('Verification failed', 'error');
    }
  }

  async resetBidState(bidId) {
    try {
      await api.resetBid(bidId);
      this.showToast(`Bid ${bidId} reset to initial pre-analyzed state.`, 'info');
      await this.renderBidDetail(document.getElementById('main-view'), bidId);
    } catch (e) {
      this.showToast('Failed to reset bid', 'error');
    }
  }

  async resetDemoState() {
    try {
      await api.resetDemo();
      await this.loadInitialData();
      this.showToast('Demo dataset restored to initial state.', 'info');
      this.navigate(this.currentView);
    } catch (e) {
      this.showToast('Reset failed', 'error');
    }
  }

  // Document Evidence Modal
  previewDocument(docName, page, title, claimedVal, snippet = '') {
    const modal = document.getElementById('document-modal');
    const titleEl = document.getElementById('doc-modal-title');
    const pageEl = document.getElementById('doc-modal-page');
    const bodyEl = document.getElementById('doc-modal-body');

    const decodedSnippet = snippet ? decodeURIComponent(snippet) : '';

    if (titleEl) titleEl.innerText = docName;
    if (pageEl) pageEl.innerText = `Page ${page || 1}`;

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="space-y-4">
          <!-- Document Header Simulator -->
          <div class="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span class="font-bold text-slate-800">${title}</span>
              <div class="text-slate-500 mt-0.5">Claimed Value: <strong class="text-slate-900">${claimedVal}</strong></div>
            </div>
            <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">PaddleOCR Verified</span>
          </div>

          <!-- Simulated PDF Page Container -->
          <div class="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-inner relative font-serif text-xs leading-relaxed text-slate-800 space-y-4 min-h-[360px]">
            <div class="text-center border-b pb-4">
              <h2 class="font-bold text-sm tracking-wide uppercase text-slate-900">BHARAT INDUSTRIAL SYSTEMS PRIVATE LIMITED</h2>
              <p class="text-[10px] text-slate-500 font-sans mt-0.5">CIN: U29100MH2015PTC261942 • Registered Office: Andheri East, Mumbai</p>
              <p class="text-[10px] font-sans font-bold text-slate-700 mt-1 uppercase tracking-widest">${docName.replace('.pdf', '').replace(/_/g, ' ')}</p>
            </div>

            <p>12.1 Significant Accounting Policies and Explanatory Notes forming part of the Financial Statements for the year ended 31st March 2025.</p>
            <p>12.2 Revenue Recognition: Revenue from sale of high-pressure industrial valves and equipment is recognized on delivery to customer sites.</p>
            
            <!-- HIGHLIGHTED EVIDENCE BOX -->
            <div class="doc-highlight-box p-3 my-3">
              <div class="text-[10px] font-sans font-black text-amber-900 uppercase tracking-wide mb-1">
                <i class="fa-solid fa-highlighter mr-1"></i> Extracted Evidentiary Snippet (OCR Confidence: 96.4%)
              </div>
              <p class="font-mono text-xs font-bold text-slate-900">
                ${decodedSnippet || `Clause 12.3: The consolidated annual turnover of the company for the financial year 2024-25 stands at ${claimedVal} (Audited by Statutory Auditors).`}
              </p>
            </div>

            <p>12.4 The management certifies that there are no pending contingent liabilities or litigation in any court of competent jurisdiction affecting the continuity of operations.</p>
            <p>12.5 Signed for and on behalf of the Board of Directors on 14th June 2025.</p>

            <div class="pt-6 flex justify-between items-end border-t border-dashed border-slate-300 font-sans text-[10px] text-slate-500">
              <div>Digitally Signed: <strong>Director (Operations)</strong></div>
              <div>Auditor Stamp: <strong>M/s R.K. Mehta & Co., Chartered Accountants</strong></div>
            </div>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
  }

  closeDocumentModal() {
    const modal = document.getElementById('document-modal');
    if (modal) modal.classList.add('hidden');
  }

  // Officer Decision Modal
  openDecisionModal(bidId, preselectDecision = 'SEND_FOR_REVIEW', presetReason = '') {
    const modal = document.getElementById('decision-modal');
    const content = document.getElementById('decision-modal-content');
    const bid = this.currentBid || { id: bidId, vendor_name: 'Bharat Industrial Systems' };

    content.innerHTML = `
      <div class="space-y-4">
        <div>
          <div class="text-xs text-slate-500">Reviewing Bid: <strong class="text-slate-800">${bid.id}</strong></div>
          <h4 class="text-sm font-bold text-slate-900">${bid.vendor_name}</h4>
        </div>

        <!-- Decision Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Select Official Determination</label>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <button type="button" onclick="app.selectDecision('APPROVE')" id="btn-decision-approve" class="p-3 rounded-xl border-2 font-bold text-center transition ${preselectDecision === 'APPROVE' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}">
              <i class="fa-solid fa-circle-check text-emerald-600 block text-base mb-1"></i>
              APPROVE BID
            </button>
            <button type="button" onclick="app.selectDecision('SEND_FOR_REVIEW')" id="btn-decision-review" class="p-3 rounded-xl border-2 font-bold text-center transition ${preselectDecision === 'SEND_FOR_REVIEW' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}">
              <i class="fa-solid fa-hourglass-half text-amber-600 block text-base mb-1"></i>
              SEND FOR REVIEW
              <span class="text-[9px] font-normal block text-amber-700">(Clarification)</span>
            </button>
            <button type="button" onclick="app.selectDecision('REJECT')" id="btn-decision-reject" class="p-3 rounded-xl border-2 font-bold text-center transition ${preselectDecision === 'REJECT' ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}">
              <i class="fa-solid fa-ban text-rose-600 block text-base mb-1"></i>
              REJECT BID
            </button>
          </div>
        </div>

        <!-- Preset Remark Quick Chips -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quick Remark Templates (Click to insert):</label>
          <div class="flex flex-wrap gap-1.5 text-[11px]">
            <button type="button" onclick="app.insertPresetReason('Turnover information differs between submitted financial statement (₹8.2 Cr) and verification source (₹3.9 Cr). Clarification required.')" class="px-2 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border border-slate-200 transition">
              + Turnover Discrepancy
            </button>
            <button type="button" onclick="app.insertPresetReason('Submitted ISO 9001:2015 certificate expired on 15-Nov-2025. Valid renewal copy required.')" class="px-2 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border border-slate-200 transition">
              + Expired ISO Certificate
            </button>
            <button type="button" onclick="app.insertPresetReason('All 6 eligibility and statutory criteria verified successfully against independent registries. Risk score Low.')" class="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 rounded border border-slate-200 transition">
              + All Criteria Compliant
            </button>
          </div>
        </div>

        <!-- Mandatory Reason Input -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Officer Reason / Determination Remark <span class="text-rose-600">*</span></label>
          <textarea id="officer-reason-input" rows="3" class="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue/20" placeholder="Enter mandatory procurement officer justification for audit trail...">${presetReason || (preselectDecision === 'SEND_FOR_REVIEW' ? 'Turnover information differs between submitted financial statement (₹8.2 Cr) and verification source (₹3.9 Cr). Seeking formal vendor clarification.' : '')}</textarea>
        </div>

        <!-- Officer Credentials -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span class="text-slate-400">Signing Officer:</span>
            <strong class="text-slate-800 ml-1">${this.currentUser.name}</strong> (${this.currentUser.designation})
          </div>
          <span class="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">GeM-Proc-104</span>
        </div>

        <!-- Submission Buttons -->
        <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
          <button type="button" onclick="app.closeDecisionModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition">
            Cancel
          </button>
          <button type="button" onclick="app.submitDecision('${bidId}')" class="px-5 py-2 bg-gov-blue hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center space-x-2">
            <i class="fa-solid fa-stamp"></i>
            <span>Submit Official Decision & Sign</span>
          </button>
        </div>
      </div>
    `;

    this.selectedDecision = preselectDecision;
    if (modal) modal.classList.remove('hidden');
  }

  selectDecision(decision) {
    this.selectedDecision = decision;
    const btnApprove = document.getElementById('btn-decision-approve');
    const btnReview = document.getElementById('btn-decision-review');
    const btnReject = document.getElementById('btn-decision-reject');

    if (btnApprove) btnApprove.className = decision === 'APPROVE' ? 'p-3 rounded-xl border-2 font-bold text-center transition border-emerald-600 bg-emerald-50 text-emerald-800' : 'p-3 rounded-xl border-2 font-bold text-center transition border-slate-200 text-slate-700 hover:bg-slate-50';
    if (btnReview) btnReview.className = decision === 'SEND_FOR_REVIEW' ? 'p-3 rounded-xl border-2 font-bold text-center transition border-amber-600 bg-amber-50 text-amber-800' : 'p-3 rounded-xl border-2 font-bold text-center transition border-slate-200 text-slate-700 hover:bg-slate-50';
    if (btnReject) btnReject.className = decision === 'REJECT' ? 'p-3 rounded-xl border-2 font-bold text-center transition border-rose-600 bg-rose-50 text-rose-800' : 'p-3 rounded-xl border-2 font-bold text-center transition border-slate-200 text-slate-700 hover:bg-slate-50';
  }

  insertPresetReason(text) {
    const el = document.getElementById('officer-reason-input');
    if (el) el.value = text;
  }

  async submitDecision(bidId) {
    const reasonEl = document.getElementById('officer-reason-input');
    const reason = reasonEl ? reasonEl.value.trim() : '';
    const decision = this.selectedDecision || 'SEND_FOR_REVIEW';

    if (!reason || reason.length < 5) {
      alert('A valid reason is required before submitting an officer determination.');
      return;
    }

    try {
      const res = await api.submitOfficerDecision(bidId, {
        decision: decision,
        officer_name: this.currentUser.name,
        officer_designation: this.currentUser.designation,
        reason: reason
      });

      this.closeDecisionModal();
      this.showToast(`Officer Decision [${decision}] successfully recorded.`, 'success');
      await this.renderBidDetail(document.getElementById('main-view'), bidId);
    } catch (e) {
      alert(e.message || 'Failed to submit officer decision');
    }
  }

  closeDecisionModal() {
    const modal = document.getElementById('decision-modal');
    if (modal) modal.classList.add('hidden');
  }

  // Simulated Connector Test
  async testConnector(connectorId) {
    try {
      const res = await api.testConnector(connectorId);
      alert(`[${connectorId} Connector Simulation Response]\n\nStatus: ${res.status}\nSource: ${res.source}\nData: ${JSON.stringify(res.data || res.message, null, 2)}`);
    } catch (e) {
      alert(`Connector ping failed: ${e.message}`);
    }
  }

  async testAllConnectors() {
    this.showToast('Pinging all 8 simulated government connectors...', 'info');
    setTimeout(() => {
      this.showToast('All connectors online (Avg latency: 112ms).', 'success');
    }, 800);
  }

  toggleDemoGuide() {
    const drawer = document.getElementById('demo-guide-drawer');
    if (drawer) {
      drawer.classList.toggle('hidden');
    }
  }

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-800 text-white' :
                    type === 'error' ? 'bg-rose-800 text-white' :
                    type === 'alert' ? 'bg-amber-700 text-white' : 'bg-slate-800 text-white';

    toast.className = `${bgColor} px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center space-x-2 transition-all transform duration-300 pointer-events-auto`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Utility Badges
  getStatusBadge(status) {
    if (status === 'Compliant' || status === 'Approved') {
      return '<span class="badge-compliant text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center"><i class="fa-solid fa-check mr-1"></i>' + status + '</span>';
    } else if (status === 'Needs Review' || status === 'Sent for Clarification') {
      return '<span class="badge-review text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center"><i class="fa-solid fa-clock mr-1"></i>' + status + '</span>';
    } else if (status === 'CONTRADICTION' || status === 'Non-Compliant' || status === 'Rejected') {
      return '<span class="badge-contradiction text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center"><i class="fa-solid fa-triangle-exclamation mr-1"></i>' + status + '</span>';
    } else {
      return '<span class="badge-pending text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center"><i class="fa-solid fa-spinner mr-1"></i>' + (status || 'Pending') + '</span>';
    }
  }

  getRiskBadge(risk) {
    const r = (risk || 'Low').toLowerCase();
    if (r === 'high') {
      return '<span class="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-rose-300 uppercase tracking-wider inline-flex items-center"><span class="pulse-dot-red mr-1"></span>High Risk</span>';
    } else if (r === 'medium') {
      return '<span class="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-300 uppercase tracking-wider">Medium Risk</span>';
    } else if (r === 'under analysis') {
      return '<span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">Under Analysis</span>';
    } else {
      return '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-300 uppercase tracking-wider">Low Risk</span>';
    }
  }
}

// Global App Singleton
const app = new ParakhApp();
window.app = app;

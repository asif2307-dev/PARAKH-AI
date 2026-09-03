/**
 * ==============================================================================
 * PARAKH AI — Ministry of Petroleum & Natural Gas, Government of India
 * Hydrocarbon Telemetry & Statutory Compliance Scrutiny System
 * Frontend Architecture (Vanilla JavaScript, 2012–2018 Enterprise Portal Standard)
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- Initial Seed Database: Ministry of Petroleum & Natural Gas Datasets ---
  const MOPNG_SEED_RECORDS = [
    {
      id: "REC-2026-8841",
      category: "Natural Gas Grid",
      psu: "GAIL",
      facility: "HVJ Trunk Pipeline Sector 4B (Hazira-Vijaipur)",
      dataSource: "SCADA Mass-Flow & Pressure Sensor Matrix",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Flow Mismatch (4.8% divergence vs 1.2% limit)",
      date: "2026-09-03 21:40 IST",
      telemetry: {
        inflow: "14.22 MMSCMD",
        outflow: "13.54 MMSCMD",
        pressureDrop: "4.2 bar (Expected: 2.1 bar)",
        sulphurContent: "0.8 ppm (Safe)",
        valveStation: "VS-14 to VS-16",
        anomaliesDetected: 2,
        sensorIntegrity: "Verified (SCADA-RTU-09)"
      },
      indicators: [
        "Inlet telemetry at Hazira compressor station deviates from downstream Jagdishpur terminal meter by 4.8% (statutory PNGRB limit <= 1.2%).",
        "SCADA pressure curve exhibits localized depression between Valve Station VS-14 and VS-16 without off-take logged in daily manifest.",
        "Gas chromatograph density sample indicates minor thermal variance compared to Hazira refinery quality certificate."
      ],
      recommendation: "Immediate physical ultrasonic valve inspection at Valve Station VS-14 recommended before subsequent transmission batch."
    },
    {
      id: "REC-2026-9022",
      category: "Crude Refining",
      psu: "IOCL",
      facility: "Paradip Refinery Terminal B (BS-VI Diesel Despatch)",
      dataSource: "Refinery Lab Cert & Custody Transfer Manifest",
      status: "Flagged",
      riskLevel: "High",
      aiResult: "Sulphur Spec Margin Exceeded (11.4 ppm vs 10.0 ppm max)",
      date: "2026-09-03 19:15 IST",
      telemetry: {
        batchNo: "PDR-BSVI-2026-B88",
        volume: "42,000 Kilolitres",
        sulphurMeasured: "11.4 ppm",
        statutoryLimit: "10.0 ppm (BIS IS 1460)",
        flashPoint: "38.5 deg C",
        cetaneNumber: "51.8",
        anomaliesDetected: 1,
        sensorIntegrity: "ASTM D2622 XRF Verified"
      },
      indicators: [
        "Despatch batch sulphur content recorded at 11.4 ppm, exceeding mandatory BS-VI ceiling of 10.0 ppm under Environment Protection Rules.",
        "Refinery primary hydrocracker sensor log showed brief catalyst bed temperature dip 4 hours prior to blending batch sign-off.",
        "Terminal custody transfer valve released 6,200 KL into coastal pipeline before automated containment cutoff triggered."
      ],
      recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream Cuttack depot for mandatory re-hydrotreating and lab re-certification."
    },
    {
      id: "REC-2026-9140",
      category: "LPG Allocation",
      psu: "IOCL",
      facility: "Subsidized LPG Bottling Plant - Kanpur Rural",
      dataSource: "DBTL Pahal Allocation Ledger & Weighbridge Telemetry",
      status: "Flagged",
      riskLevel: "High",
      aiResult: "Subsidy Diversion Pattern Flagged (1,420 cylinders unaccounted)",
      date: "2026-09-03 17:30 IST",
      telemetry: {
        bottledCount: "28,400 cylinders",
        dispatchedCount: "26,980 cylinders",
        divergenceCount: "1,420 cylinders",
        subsidyValueExposed: "INR 5,68,000",
        distributorCount: "14 Agencies",
        anomaliesDetected: 3,
        sensorIntegrity: "Weighbridge Tare Automated Log"
      },
      indicators: [
        "1,420 subsidized domestic LPG cylinders dispatched without corresponding Aadhaar authentication tokens in PMUY database.",
        "Geographic clustering of repeat bookings within 48 hours detected across three commercial highway distributors.",
        "Weighbridge automated RFID log records truck exit timestamps inconsistent with security bay manifest."
      ],
      recommendation: "Issue immediate statutory show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance inspection team."
    },
    {
      id: "REC-2026-9255",
      category: "Offshore Extraction",
      psu: "ONGC",
      facility: "Mumbai High Offshore Platform B-17",
      dataSource: "Subsea Wellhead Multi-Phase Flow Telemetry",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Telemetry Reconciled (99.4% cross-source match)",
      date: "2026-09-03 15:10 IST",
      telemetry: {
        crudeProduction: "38,200 BBL/day",
        associatedGas: "2.14 MMSCMD",
        wellheadPressure: "184 bar",
        separatorTemp: "62 deg C",
        waterCut: "14.2%",
        anomaliesDetected: 0,
        sensorIntegrity: "Dual Rosemount Coriolis calibrated 28-Aug"
      },
      indicators: [
        "Wellhead multi-phase flow rates align within 0.6% tolerance against Uran coastal terminal receipt meters.",
        "Subsea choke valve pressure differential exhibits stable laminar profile over continuous 72-hour operational cycle.",
        "Zero environmental methane venting detected by coastal satellite aperture radar."
      ],
      recommendation: "Routine scheduled telemetry monitoring; next statutory underwater sensor calibration scheduled 15-Oct-2026."
    },
    {
      id: "REC-2026-9310",
      category: "Crude Refining",
      psu: "BPCL",
      facility: "Kochi Refinery Aviation Turbine Fuel (ATF) Terminal",
      dataSource: "DGCA Statutory Quality Test Certificate",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Aviation Fuel Spec Verified (DefStan 91-091 & IS 1571)",
      date: "2026-09-03 13:45 IST",
      telemetry: {
        batchNo: "KCH-ATF-26-90",
        volume: "18,500 KL",
        flashPoint: "41.2 deg C (Min 38.0)",
        freezePoint: "-49.0 deg C (Max -47.0)",
        smokePoint: "24.5 mm (Min 18.0)",
        anomaliesDetected: 0,
        sensorIntegrity: "NABL Accredited Lab Automated Telemetry"
      },
      indicators: [
        "All critical aviation parameters comply strictly with DGCA and MoPNG mandatory safety regulations.",
        "Pipeline custody transfer filtration delta-P within normal limits (0.42 bar).",
        "Digital signature validated against BPCL Quality Assurance Directorate."
      ],
      recommendation: "Approved for unrestricted commercial airport pipeline distribution (Cochin & Trivandrum airports)."
    },
    {
      id: "REC-2026-9420",
      category: "City Gas Distribution",
      psu: "GAIL",
      facility: "Ahmedabad City Gas Distribution (CGD) Steel Network",
      dataSource: "Pressure Regulating Skid (PRS) SCADA Stream",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Off-Peak Transient Pressure Surge (19.4 bar vs 16.0 bar max)",
      date: "2026-09-03 11:20 IST",
      telemetry: {
        networkZone: "Zone 3 - Vatva Industrial Area",
        inletPressure: "26.0 bar",
        regulatedOutlet: "19.4 bar (Ceiling: 16.0 bar)",
        peakFlow: "18,400 SCMH",
        reliefValveAction: "1 actuation recorded (03:14 IST)",
        anomaliesDetected: 1,
        sensorIntegrity: "PRS Telemetry Stream Online"
      },
      indicators: [
        "Secondary pressure reduction slam-shut valve operated 2 times during midnight low-consumption window.",
        "Pilot diaphragm response latency delayed by 4.2 seconds beyond manufacturer safety limits.",
        "Industrial off-take customer meter logged pressure pulse spike."
      ],
      recommendation: "Dispatch emergency CGD field engineer to replace pilot regulator diaphragm at PRS-Vatva-02."
    },
    {
      id: "REC-2026-9505",
      category: "Crude Refining",
      psu: "HPCL",
      facility: "Visakhapatnam Refinery Naphtha Cracker Storage",
      dataSource: "Terminal Automated Tank Gauging (ATG) Radar",
      status: "Verified",
      riskLevel: "Low",
      aiResult: "Mass Balance Reconciled (0.3% margin)",
      date: "2026-09-03 09:50 IST",
      telemetry: {
        tankNo: "TK-402A & TK-402B",
        inventory: "45,800 MT",
        temperature: "29.4 deg C",
        vaporPressure: "0.62 bar",
        anomaliesDetected: 0,
        sensorIntegrity: "Enraf Radar Gauge Calibrated"
      },
      indicators: [
        "Tank inventory mass balance reconciled with marine tanker offloading manifest.",
        "No vapor recovery system alarm or volatile organic emission detected."
      ],
      recommendation: "Record verified and archived in MoPNG Monthly Hydrocarbon Ledger."
    },
    {
      id: "REC-2026-9630",
      category: "Strategic Reserves",
      psu: "ISPRL",
      facility: "Padur Underground Crude Cavern Storage",
      dataSource: "Subsurface Hydrostatic & Inflow Sensor Network",
      status: "Verified",
      riskLevel: "Low",
      aiResult: "Cavern Containment & Hydrostatic Integrity Normal",
      date: "2026-09-02 22:15 IST",
      telemetry: {
        storedCrude: "2.50 Million Metric Tonnes",
        cavernWaterCurtainPressure: "9.2 bar",
        seepageRate: "0.4 L/min (Permissible: <= 2.5 L/min)",
        dissolvedGasLevel: "Stable",
        anomaliesDetected: 0,
        sensorIntegrity: "Triple Redundant Piezometer Sensors"
      },
      indicators: [
        "Underground rock cavern water curtain containment curtain holding at designated hydrostatic gradient.",
        "Piezometric water table levels surrounding Padur facility verified within statutory parameters."
      ],
      recommendation: "Approved. Routine quarterly status report transmitted to National Security Council Secretariat."
    },
    {
      id: "REC-2026-9715",
      category: "Natural Gas Grid",
      psu: "GAIL",
      facility: "Jagdishpur-Haldia-Bokaro-Dhamra Pipeline (JHBDPL)",
      dataSource: "SCADA Pipeline Telemetry & Valve Supervisory Log",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Throughput Reconciled (99.1% match)",
      date: "2026-09-02 18:30 IST",
      telemetry: {
        throughput: "11.2 MMSCMD",
        operatingPressure: "74 bar",
        dewPoint: "-14 deg C",
        anomaliesDetected: 0,
        sensorIntegrity: "SCADA Node JH-08 Online"
      },
      indicators: [
        "Mass balance verified across fertilizer plant off-take terminals at Gorakhpur and Sindri.",
        "All telemetry verified against dispatch schedule."
      ],
      recommendation: "Normal operations. Statutory transmission clearance granted."
    },
    {
      id: "REC-2026-9840",
      category: "Crude Refining",
      psu: "IOCL",
      facility: "Mathura Refinery Main Pipeline Offtake",
      dataSource: "Pipeline Ultrasonic In-Line Inspection (ILI) Pigging Log",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Pipe Wall Thinning Anomaly Detected (KM 42.8)",
      date: "2026-09-02 14:00 IST",
      telemetry: {
        inspectionTool: "Magnetic Flux Leakage (MFL) In-Line Pig",
        milepost: "KM 42.8 near Bharatpur section",
        anomalyDepth: "22% wall thickness loss (O&M Alert threshold 20%)",
        internalPressure: "58 bar",
        anomaliesDetected: 1,
        sensorIntegrity: "Rosen MFL Calibrated Run"
      },
      indicators: [
        "In-line pigging telemetry recorded 22% localized wall loss at KM 42.8.",
        "Operating pressure lowered temporarily by 10 bar pending technical verification."
      ],
      recommendation: "Perform visual and ultrasonic direct examination within 14 business days pursuant to ASME B31.8S standard."
    }
  ];

  // Initial Reports Repository
  const MOPNG_SEED_REPORTS = [
    {
      title: "Quarterly Hydrocarbon Pipeline Mass Balance Scrutiny Brief (Q2-2026)",
      code: "MOPNG/REP/2026/Q2-PIPE",
      category: "Pipeline Integrity",
      date: "2026-08-31",
      status: "Officially Signed",
      createdBy: "Shri Rajesh K. Sharma, Director",
      classification: "OFFICIAL SECRET / RESTRICTED",
      downloadUrl: "#"
    },
    {
      title: "National City Gas Distribution (CGD) Allocation Discrepancy Scrutiny",
      code: "MOPNG/REP/2026/CGD-ALLOC",
      category: "Subsidy Scrutiny",
      date: "2026-08-25",
      status: "Published to Ministry",
      createdBy: "Technical Audit Cell",
      classification: "CONFIDENTIAL",
      downloadUrl: "#"
    },
    {
      title: "Strategic Petroleum Reserves (ISPRL) Padur Cavern Hydrostatic Audit",
      code: "MOPNG/REP/2026/ISPRL-AUD",
      category: "Storage Audits",
      date: "2026-08-18",
      status: "Officially Signed",
      createdBy: "Joint Director (Safety & Security)",
      classification: "SECRET",
      downloadUrl: "#"
    },
    {
      title: "IOCL Mathura & Paradip Refinery Sulphur Spec Compliance Verification",
      code: "MOPNG/REP/2026/SULPHUR-BSVI",
      category: "Environmental Specs",
      date: "2026-08-10",
      status: "Action Pending",
      createdBy: "Environmental Monitoring Directorate",
      classification: "OFFICIAL / INTERNAL",
      downloadUrl: "#"
    },
    {
      title: "GAIL HVJ Trunk Pipeline Pressure Variance Technical Evaluation",
      code: "MOPNG/REP/2026/HVJ-TECH-04",
      category: "Pipeline Integrity",
      date: "2026-08-04",
      status: "Officially Signed",
      createdBy: "Shri Rajesh K. Sharma, Director",
      classification: "RESTRICTED",
      downloadUrl: "#"
    }
  ];

  // Initial Operational Alerts
  const MOPNG_SEED_ALERTS = [
    {
      id: "ALT-2026-01",
      severity: "CRITICAL",
      facility: "IOCL Paradip Refinery",
      title: "BS-VI Diesel Sulphur Specification Violation (11.4 ppm)",
      description: "Batch PDR-BSVI-2026-B88 exceeds BIS IS 1460 ceiling of 10.0 ppm. Risk of environmental non-compliance and vehicular emissions.",
      timestamp: "03-Sep-2026 19:15 IST",
      acknowledged: false,
      refId: "REC-2026-9022"
    },
    {
      id: "ALT-2026-02",
      severity: "CRITICAL",
      facility: "IOCL LPG Bottling Kanpur",
      title: "Subsidized Domestic LPG Allocation Divergence (1,420 Cylinders)",
      description: "Unauthenticated batch dispatch logged without biometric Pahal tokens. Potential diversion to commercial un-metered consumers.",
      timestamp: "03-Sep-2026 17:30 IST",
      acknowledged: false,
      refId: "REC-2026-9140"
    },
    {
      id: "ALT-2026-03",
      severity: "CRITICAL",
      facility: "GAIL HVJ Trunk Sector 4B",
      title: "Mass Balance Inflow-Outflow Discrepancy > 4.5%",
      description: "Hazira vs Jagdishpur telemetry divergence exceeds PNGRB statutory tolerance of 1.2%. Pressure drop localized to VS-14.",
      timestamp: "03-Sep-2026 21:40 IST",
      acknowledged: false,
      refId: "REC-2026-8841"
    },
    {
      id: "ALT-2026-04",
      severity: "HIGH",
      facility: "GAIL Ahmedabad CGD",
      title: "Vatva Industrial PRS Slam-Shut Valve Operating Anomaly",
      description: "Pressure reached 19.4 bar during midnight off-peak hours. Regulating pilot diaphragm response latency noted.",
      timestamp: "03-Sep-2026 11:20 IST",
      acknowledged: false,
      refId: "REC-2026-9420"
    },
    {
      id: "ALT-2026-05",
      severity: "HIGH",
      facility: "IOCL Mathura Pipeline",
      title: "Pipe Wall Loss Anomaly at KM 42.8 (22% Depth)",
      description: "ILI Magnetic Flux Leakage pig recorded localized corrosion exceeding standard O&M 20% threshold.",
      timestamp: "02-Sep-2026 14:00 IST",
      acknowledged: false,
      refId: "REC-2026-9840"
    },
    {
      id: "ALT-2026-06",
      severity: "HIGH",
      facility: "BPCL Bina Refinery",
      title: "Delayed Reconciliation for Crude Feed Despatch Manifest",
      description: "Statutory monthly feed reconciliation ledger overdue by 48 hours pursuant to Petroleum Rules.",
      timestamp: "02-Sep-2026 10:15 IST",
      acknowledged: true,
      refId: "REC-2026-9100"
    },
    {
      id: "ALT-2026-07",
      severity: "MEDIUM",
      facility: "ONGC Uran Terminal",
      title: "Secondary Flow Meter Density Calibration Variance",
      description: "Ultrasonic density reading delta of 0.8% against fiscal custody transfer Coriolis meter.",
      timestamp: "01-Sep-2026 16:40 IST",
      acknowledged: true,
      refId: "REC-2026-9210"
    },
    {
      id: "ALT-2026-08",
      severity: "MEDIUM",
      facility: "HPCL Mumbai Terminal",
      title: "Vapor Recovery System (VRU) Scheduled Maintenance Due",
      description: "Compressor run-hours exceeded 4,000 hours. Scheduled preventative overhaul flagged.",
      timestamp: "01-Sep-2026 12:05 IST",
      acknowledged: true,
      refId: "REC-2026-9050"
    },
    {
      id: "ALT-2026-09",
      severity: "INFORMATIONAL",
      facility: "ISPRL Mangalore Cavern",
      title: "Periodic Cavern Water Curtain Pressure Sensor Re-Zeroing",
      description: "Automated hydrostatic pressure diagnostic executed normally. All piezometer readings nominal.",
      timestamp: "01-Sep-2026 08:00 IST",
      acknowledged: true,
      refId: "REC-2026-9630"
    }
  ];

  // Initial Immutable NIC Audit Trail
  const MOPNG_SEED_AUDIT = [
    {
      timestamp: "03-Sep-2026 21:42:15 IST",
      ref: "AUD-8841-A",
      actor: "PARAKH AI Rule Engine v3.2",
      type: "ANOMALY_FLAGGED",
      facility: "GAIL HVJ Sector 4B",
      description: "Deterministic scrutiny detected 4.8% flow discrepancy between Hazira and Jagdishpur SCADA meters.",
      hash: "SHA256:7e8a91c2...09b4",
      status: "ALERT"
    },
    {
      timestamp: "03-Sep-2026 19:20:04 IST",
      ref: "AUD-9022-B",
      actor: "NABL Lab Ingestion Service",
      type: "SPEC_VIOLATION",
      facility: "IOCL Paradip Terminal",
      description: "Sulphur certificate extracted from PDF: 11.4 ppm. Flagged as exceeding BS-VI 10 ppm ceiling.",
      hash: "SHA256:4b11f8e2...a12c",
      status: "CRITICAL"
    },
    {
      timestamp: "03-Sep-2026 17:35:12 IST",
      ref: "AUD-9140-C",
      actor: "DBTL Pahal Cross-Verify Connector",
      type: "SUBSIDY_AUDIT",
      facility: "IOCL LPG Kanpur",
      description: "1,420 domestic subsidized cylinders failed biometric Aadhaar validation check.",
      hash: "SHA256:92cb5830...3d71",
      status: "CRITICAL"
    },
    {
      timestamp: "03-Sep-2026 15:15:00 IST",
      ref: "AUD-9255-D",
      actor: "Shri Rajesh K. Sharma (Director)",
      type: "OFFICER_SIGNOFF",
      facility: "ONGC Mumbai High B-17",
      description: "Officer signed off on monthly offshore telemetry reconciliation dossier with digital token.",
      hash: "DSIG-MOPNG-9255-88A1FF",
      status: "SUCCESS"
    },
    {
      timestamp: "03-Sep-2026 11:30:22 IST",
      ref: "AUD-9420-E",
      actor: "SCADA Telemetry Daemon",
      type: "TELEMETRY_INGEST",
      facility: "GAIL Ahmedabad CGD",
      description: "Ingested 14,400 raw pressure samples from Vatva PRS. Auto-integrity checksum confirmed.",
      hash: "SHA256:1a82d004...bb72",
      status: "SUCCESS"
    }
  ];

  // --- Main Application State ---
  class ParakhApplication {
    constructor() {
      this.currentView = 'dashboard';
      this.records = [...MOPNG_SEED_RECORDS];
      this.filteredRecords = [...MOPNG_SEED_RECORDS];
      this.reports = [...MOPNG_SEED_REPORTS];
      this.alerts = [...MOPNG_SEED_ALERTS];
      this.auditTrail = [...MOPNG_SEED_AUDIT];
      
      this.recordsCurrentPage = 1;
      this.recordsPerPage = 10;
      this.sortField = 'id';
      this.sortOrder = 'asc';

      this.isLoggedIn = true;
      this.currentUser = {
        name: "Shri Rajesh K. Sharma",
        role: "Senior Audit Officer",
        designation: "Director (Pipeline Audit & Allocation)",
        badgeId: "MoPNG-AUD-8842",
        token: "NIC-SHA256-TOKEN-2026"
      };

      this.currentSelectedRecord = null;
      this.currentAnalysisCase = 'CASE-8841';
      this.isPipelineRunning = false;
      this.activeAlertFilter = 'ALL';
      this.currentLang = 'en';

      this.init();
    }

    init() {
      this.startLiveClock();
      this.renderDashboard();
      this.renderRecordsTable();
      this.renderReportsTable();
      this.renderAlerts();
      this.renderAuditHistory();
      this.renderComplianceChart();
      this.renderStructuredAiInsights();
      this.loadAnalysisCase('CASE-8841');
      this.refreshCaptcha();
    }

    // --- Clock and Header Utilities ---
    startLiveClock() {
      const update = () => {
        const now = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const str = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} IST`;
        
        const clockEl = document.getElementById('liveClockDisplay');
        if (clockEl) clockEl.textContent = str;
      };
      update();
      setInterval(update, 1000);
    }

    adjustFontSize(size) {
      document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
      if (size === 'sm') document.body.classList.add('font-size-sm');
      else if (size === 'lg') document.body.classList.add('font-size-lg');
      else document.body.classList.add('font-size-md');
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
      const ticker = document.getElementById('tickerContent');
      if (this.currentLang === 'hi') {
        if (ticker) ticker.textContent = "पीएनजीआरबी तकनीकी मानकों एवं विनियमों 2026 के अंतर्गत हाइड्रोकार्बन पाइपलाइन एवं आवंटन संवीक्षा सक्रिय। आगामी सांविधिक समाधान समयसीमा: 15-सितम्बर-2026।";
      } else {
        if (ticker) ticker.textContent = "Mandatory Hydrocarbon Pipeline & Allocation Scrutiny Active under PNGRB Technical Standards & Regulations 2026. Next statutory reconciliation deadline: 15-Sep-2026.";
      }
    }

    // --- Navigation & View Switching ---
    switchView(viewName) {
      // If user is logged out and tries to access portal view, keep on login
      if (!this.isLoggedIn && viewName !== 'login') {
        this.showLoginScreen();
        return;
      }

      this.currentView = viewName;

      // Hide all view sections
      const sections = document.querySelectorAll('.view-section');
      sections.forEach(sec => sec.style.display = 'none');

      // Show selected section
      const targetSec = document.getElementById(`view-${viewName}`);
      if (targetSec) {
        targetSec.style.display = 'block';
      }

      // Hide login screen
      const loginSection = document.getElementById('institutionalLoginSection');
      const portalContainer = document.getElementById('portalContainer');
      const noticeTicker = document.getElementById('noticeTicker');

      if (viewName === 'login') {
        if (loginSection) loginSection.style.display = 'block';
        if (portalContainer) portalContainer.style.display = 'none';
        if (noticeTicker) noticeTicker.style.display = 'none';
      } else {
        if (loginSection) loginSection.style.display = 'none';
        if (portalContainer) portalContainer.style.display = 'flex';
        if (noticeTicker) noticeTicker.style.display = 'block';
      }

      // Update active nav items in horizontal bar
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update sidebar active buttons
      const sidebarBtns = document.querySelectorAll('.sidebar-link-btn');
      sidebarBtns.forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Breadcrumbs
      this.updateBreadcrumbs(viewName);

      // Re-render views if needed
      if (viewName === 'dashboard') {
        this.renderComplianceChart();
      } else if (viewName === 'records') {
        this.renderRecordsTable();
      } else if (viewName === 'alerts') {
        this.renderAlerts();
      } else if (viewName === 'history') {
        this.renderAuditHistory();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateBreadcrumbs(viewName) {
      const parentEl = document.getElementById('breadcrumbParent');
      const currentEl = document.getElementById('breadcrumbCurrent');
      const timeEl = document.getElementById('breadcrumbTime');

      const viewLabels = {
        'dashboard': { parent: 'Operational Portal', current: 'Dashboard Overview' },
        'records': { parent: 'Data Management', current: 'Production & Despatch Records' },
        'upload': { parent: 'Data Management', current: 'Statutory Data Ingestion' },
        'ai-analysis': { parent: 'Analysis & Insights', current: 'AI Compliance Scrutiny' },
        'ai-insights': { parent: 'Analysis & Insights', current: 'Structured AI Insights' },
        'reports': { parent: 'Reports & Audits', current: 'Statutory Reports' },
        'alerts': { parent: 'Monitoring & Control', current: 'Operational Alerts' },
        'history': { parent: 'Monitoring & Control', current: 'NIC Audit History' },
        'administration': { parent: 'System Administration', current: 'Portal Settings' },
        'login': { parent: 'Access Control', current: 'Officer Sign-In' }
      };

      const info = viewLabels[viewName] || { parent: 'Portal', current: viewName };
      if (parentEl) parentEl.innerHTML = `<a href="javascript:void(0)">${info.parent}</a>`;
      if (currentEl) currentEl.textContent = info.current;
      if (timeEl) timeEl.textContent = 'Refreshed: ' + new Date().toLocaleTimeString('en-GB') + ' IST';
    }

    // --- Authentication & Portal Lock ---
    showLoginScreen() {
      this.switchView('login');
      const authBtnText = document.getElementById('authToggleText');
      if (authBtnText) authBtnText.textContent = 'Sign In';
    }

    handleLogoutToggle() {
      if (this.isLoggedIn) {
        if (confirm("Are you sure you wish to lock this terminal and log out of the MoPNG Operational Portal?")) {
          this.isLoggedIn = false;
          this.showLoginScreen();
        }
      } else {
        this.showLoginScreen();
      }
    }

    handleLogin(e) {
      if (e) e.preventDefault();
      const user = document.getElementById('loginUsername').value;
      const roleSelect = document.getElementById('loginRole');
      const roleText = roleSelect.options[roleSelect.selectedIndex].text;

      this.isLoggedIn = true;
      this.currentUser.name = user === 'admin' ? 'Shri K. V. Ramanathan' : 'Shri Rajesh K. Sharma';
      this.currentUser.designation = roleText;

      const nameEl = document.getElementById('userDisplayName');
      const roleEl = document.getElementById('userDisplayRole');
      const authBtnText = document.getElementById('authToggleText');

      if (nameEl) nameEl.textContent = this.currentUser.name;
      if (roleEl) roleEl.textContent = this.currentUser.designation;
      if (authBtnText) authBtnText.textContent = 'Log Out';

      this.addAuditEntry('OFFICER_LOGIN', 'Portal Access', `Successful authentication via NIC National Node by ${this.currentUser.name}`, 'INFO');
      this.switchView('dashboard');
    }

    fillDemoCredentials() {
      document.getElementById('loginUsername').value = 'officer';
      document.getElementById('loginPassword').value = 'demo123';
      document.getElementById('loginCaptcha').value = document.getElementById('captchaValue').textContent.replace(/\s+/g, '');
    }

    refreshCaptcha() {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let res = '';
      for (let i = 0; i < 5; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
      }
      const el = document.getElementById('captchaValue');
      if (el) el.textContent = res.trim();
    }

    // --- Dashboard Rendering ---
    renderDashboard() {
      // Render recent table
      const tbody = document.getElementById('dashboardRecentTbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      const recentSlice = this.records.slice(0, 5);

      recentSlice.forEach(rec => {
        const tr = document.createElement('tr');

        let badgeCls = 'badge-info';
        if (rec.status === 'Compliant' || rec.status === 'Verified') badgeCls = 'badge-success';
        else if (rec.status === 'Flagged') badgeCls = 'badge-critical';
        else if (rec.status === 'Under Scrutiny') badgeCls = 'badge-high';

        let riskCls = 'badge-info';
        if (rec.riskLevel === 'High') riskCls = 'badge-critical';
        else if (rec.riskLevel === 'Medium') riskCls = 'badge-high';
        else if (rec.riskLevel === 'Low') riskCls = 'badge-success';

        tr.innerHTML = `
          <td><strong>${rec.id}</strong></td>
          <td>${rec.category}</td>
          <td><strong>${rec.psu}</strong> — ${rec.facility}</td>
          <td style="font-size:11px; color:#4a5968;">${rec.dataSource}</td>
          <td><span class="badge ${badgeCls}">${rec.status}</span></td>
          <td><span class="badge ${riskCls}">${rec.riskLevel}</span></td>
          <td style="font-size:11px; color:#184534;"><strong>${rec.aiResult}</strong></td>
          <td style="font-size:11px; white-space:nowrap;">${rec.date}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${rec.id}')">View Details</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Render dashboard alerts list
      const alertsContainer = document.getElementById('dashboardAlertsList');
      if (alertsContainer) {
        alertsContainer.innerHTML = '';
        const unacked = this.alerts.filter(a => !a.acknowledged).slice(0, 4);

        unacked.forEach(alt => {
          const item = document.createElement('div');
          item.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#faf8f2; border:1px solid #ded5c2; padding:6px 10px; border-radius:3px; gap:8px;";

          let sevBadge = alt.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high';

          item.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
              <span class="badge ${sevBadge}">${alt.severity}</span>
              <div style="font-size:12px;">
                <strong>${alt.facility}:</strong> ${alt.title}
                <span style="font-size:10px; color:#687786; margin-left:6px;">[${alt.timestamp}]</span>
              </div>
            </div>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-accent btn-sm" onclick="parakhApp.openRecordModal('${alt.refId}')">Scrutinize</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.acknowledgeAlert('${alt.id}')">Acknowledge</button>
            </div>
          `;
          alertsContainer.appendChild(item);
        });
      }
    }

    // --- Traditional Canvas Chart (Restrained 2012-2018 Enterprise Style) ---
    renderComplianceChart() {
      const canvas = document.getElementById('complianceChartCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas with subtle off-white government background
      ctx.fillStyle = '#FAF9F5';
      ctx.fillRect(0, 0, w, h);

      // Data setup: 6 months of FY 2025-26
      const months = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025 (Live)'];
      const psuSelect = document.getElementById('chartPsuFilter');
      const filter = psuSelect ? psuSelect.value : 'ALL';

      // Bar data (Despatch Volume in TMT/MMSCMD equivalent index)
      let volumeData = [124, 138, 142, 135, 148, 154];
      let complianceRate = [82, 85, 87, 84, 89, 91];

      if (filter === 'GAIL') {
        volumeData = [98, 102, 105, 101, 110, 114];
        complianceRate = [88, 89, 90, 87, 92, 93];
      } else if (filter === 'IOCL') {
        volumeData = [140, 145, 150, 142, 155, 160];
        complianceRate = [79, 81, 84, 80, 86, 88];
      }

      // Chart margins
      const padLeft = 45;
      const padRight = 45;
      const padTop = 25;
      const padBottom = 35;
      const chartW = w - padLeft - padRight;
      const chartH = h - padTop - padBottom;

      // Draw Grid Lines (1px subtle beige/slate)
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E0D8C4';

      const gridSteps = 4;
      for (let i = 0; i <= gridSteps; i++) {
        const y = padTop + (chartH / gridSteps) * i;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - padRight, y);
        ctx.stroke();

        // Left axis labels (Volume)
        ctx.fillStyle = '#123B63';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        const val = Math.round(200 - (200 / gridSteps) * i);
        ctx.fillText(val.toString(), padLeft - 6, y + 3);

        // Right axis labels (Compliance %)
        ctx.fillStyle = '#397B63';
        ctx.textAlign = 'left';
        const pct = Math.round(100 - (50 / gridSteps) * i);
        ctx.fillText(pct + '%', w - padRight + 6, y + 3);
      }

      // Draw Bars (Deep Navy #123B63 with subtle 1px border)
      const numPoints = months.length;
      const slotW = chartW / numPoints;
      const barW = slotW * 0.45;

      months.forEach((m, idx) => {
        const x = padLeft + slotW * idx + (slotW - barW) / 2;
        const barH = (volumeData[idx] / 200) * chartH;
        const y = padTop + chartH - barH;

        // Solid Navy bar
        ctx.fillStyle = '#123B63';
        ctx.fillRect(x, y, barW, barH);

        // Subtle 1px darker border
        ctx.strokeStyle = '#0b2540';
        ctx.strokeRect(x, y, barW, barH);

        // X-axis label
        ctx.fillStyle = '#334155';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(m, x + barW / 2, h - padBottom + 16);
      });

      // Draw Compliance Line (Petroleum Green #397B63)
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#397B63';

      const linePoints = [];
      months.forEach((m, idx) => {
        const x = padLeft + slotW * idx + slotW / 2;
        // 50% to 100% scale
        const pct = complianceRate[idx];
        const normalized = (pct - 50) / 50;
        const y = padTop + chartH - normalized * chartH;
        linePoints.push({ x, y, val: pct });

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw line points (Rectangles / squares in authentic 2014 style)
      linePoints.forEach(pt => {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#397B63';
        ctx.lineWidth = 2;
        ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
        ctx.strokeRect(pt.x - 3, pt.y - 3, 6, 6);

        // Value text
        ctx.fillStyle = '#275E4A';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pt.val + '%', pt.x, pt.y - 6);
      });
    }

    // --- Records Table Rendering, Filtering & Pagination ---
    renderRecordsTable() {
      const tbody = document.getElementById('recordsTbody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const total = this.filteredRecords.length;
      document.getElementById('pageTotalRecords').textContent = total;

      if (total === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9">
              <div class="empty-state-box">
                <h4>No statutory hydrocarbon records match the specified filters.</h4>
                <p>Try adjusting the sector classification, entity dropdown, or date range.</p>
                <button type="button" class="btn btn-primary btn-sm" onclick="parakhApp.resetFilters()">Clear Filters</button>
              </div>
            </td>
          </tr>
        `;
        document.getElementById('pageStartRecord').textContent = '0';
        document.getElementById('pageEndRecord').textContent = '0';
        this.renderPaginationControls(0);
        return;
      }

      const startIdx = (this.recordsCurrentPage - 1) * this.recordsPerPage;
      const endIdx = Math.min(startIdx + this.recordsPerPage, total);

      document.getElementById('pageStartRecord').textContent = (startIdx + 1).toString();
      document.getElementById('pageEndRecord').textContent = endIdx.toString();

      const pageItems = this.filteredRecords.slice(startIdx, endIdx);

      pageItems.forEach(rec => {
        const tr = document.createElement('tr');

        let badgeCls = 'badge-info';
        if (rec.status === 'Compliant' || rec.status === 'Verified') badgeCls = 'badge-success';
        else if (rec.status === 'Flagged') badgeCls = 'badge-critical';
        else if (rec.status === 'Under Scrutiny') badgeCls = 'badge-high';

        let riskCls = 'badge-info';
        if (rec.riskLevel === 'High') riskCls = 'badge-critical';
        else if (rec.riskLevel === 'Medium') riskCls = 'badge-high';
        else if (rec.riskLevel === 'Low') riskCls = 'badge-success';

        tr.innerHTML = `
          <td><strong>${rec.id}</strong></td>
          <td>${rec.category}</td>
          <td><strong>${rec.psu}</strong> — ${rec.facility}</td>
          <td style="font-size:11px; color:#4a5968;">${rec.dataSource}</td>
          <td><span class="badge ${badgeCls}">${rec.status}</span></td>
          <td><span class="badge ${riskCls}">${rec.riskLevel}</span></td>
          <td style="font-size:11px; color:#184534;"><strong>${rec.aiResult}</strong></td>
          <td style="font-size:11px; white-space:nowrap;">${rec.date}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${rec.id}')">View Details</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      this.renderPaginationControls(total);
    }

    renderPaginationControls(total) {
      const container = document.getElementById('paginationControls');
      if (!container) return;

      container.innerHTML = '';
      const totalPages = Math.ceil(total / this.recordsPerPage) || 1;

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '« Prev';
      prevBtn.disabled = this.recordsCurrentPage === 1;
      prevBtn.onclick = () => {
        if (this.recordsCurrentPage > 1) {
          this.recordsCurrentPage--;
          this.renderRecordsTable();
        }
      };
      container.appendChild(prevBtn);

      // Page numbers
      for (let p = 1; p <= totalPages; p++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${p === this.recordsCurrentPage ? 'active' : ''}`;
        btn.textContent = p.toString();
        btn.onclick = () => {
          this.recordsCurrentPage = p;
          this.renderRecordsTable();
        };
        container.appendChild(btn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = 'Next »';
      nextBtn.disabled = this.recordsCurrentPage === totalPages;
      nextBtn.onclick = () => {
        if (this.recordsCurrentPage < totalPages) {
          this.recordsCurrentPage++;
          this.renderRecordsTable();
        }
      };
      container.appendChild(nextBtn);
    }

    applyFilters() {
      const search = (document.getElementById('filterSearchInput').value || '').toLowerCase().trim();
      const cat = document.getElementById('filterCategorySelect').value;
      const psu = document.getElementById('filterPsuSelect').value;
      const status = document.getElementById('filterStatusSelect').value;

      this.filteredRecords = this.records.filter(rec => {
        if (search) {
          const match = rec.id.toLowerCase().includes(search) ||
                        rec.facility.toLowerCase().includes(search) ||
                        rec.psu.toLowerCase().includes(search) ||
                        rec.aiResult.toLowerCase().includes(search);
          if (!match) return false;
        }

        if (cat !== 'ALL' && rec.category !== cat) return false;
        if (psu !== 'ALL' && rec.psu !== psu) return false;
        if (status !== 'ALL' && rec.status !== status) return false;

        return true;
      });

      this.recordsCurrentPage = 1;
      this.renderRecordsTable();
    }

    resetFilters() {
      document.getElementById('filterSearchInput').value = '';
      document.getElementById('filterCategorySelect').value = 'ALL';
      document.getElementById('filterPsuSelect').value = 'ALL';
      document.getElementById('filterStatusSelect').value = 'ALL';
      this.filteredRecords = [...this.records];
      this.recordsCurrentPage = 1;
      this.renderRecordsTable();
    }

    filterRecordsByPsu(psuName) {
      this.switchView('records');
      document.getElementById('filterPsuSelect').value = psuName;
      this.applyFilters();
    }

    sortRecords(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }

      this.filteredRecords.sort((a, b) => {
        let vA = a[field] || '';
        let vB = b[field] || '';
        if (typeof vA === 'string') vA = vA.toLowerCase();
        if (typeof vB === 'string') vB = vB.toLowerCase();

        if (vA < vB) return this.sortOrder === 'asc' ? -1 : 1;
        if (vA > vB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      this.renderRecordsTable();
    }

    exportRecordsCSV() {
      let csv = "Record ID,Category,PSU,Facility,Data Source,Status,Risk Level,AI Result,Date\n";
      this.filteredRecords.forEach(r => {
        csv += `"${r.id}","${r.category}","${r.psu}","${r.facility}","${r.dataSource}","${r.status}","${r.riskLevel}","${r.aiResult}","${r.date}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MoPNG_Hydrocarbon_Records_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // --- Record Details Modal ---
    openRecordModal(recordId) {
      const rec = this.records.find(r => r.id === recordId);
      if (!rec) return;

      this.currentSelectedRecord = rec;

      const titleEl = document.getElementById('recordModalTitle');
      const bodyEl = document.getElementById('recordModalBody');

      if (titleEl) titleEl.textContent = `Record Scrutiny Dossier: ${rec.id} — ${rec.facility}`;

      let telemetryRows = '';
      if (rec.telemetry) {
        for (const [k, v] of Object.entries(rec.telemetry)) {
          telemetryRows += `<tr><td style="font-weight:bold; width:40%; background:#f6f4ee;">${k}:</td><td>${v}</td></tr>`;
        }
      }

      let indicatorsHtml = '';
      if (rec.indicators && rec.indicators.length) {
        indicatorsHtml = `<ul style="list-style:disc; margin-left:18px; display:flex; flex-direction:column; gap:4px; font-size:12px; color:#1C2B39;">` +
          rec.indicators.map(i => `<li>${i}</li>`).join('') + `</ul>`;
      }

      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="background:#FAF8F2; border:1px solid #ded5bf; padding:10px; border-radius:3px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:14px; font-weight:bold; color:#123B63;">${rec.psu} — ${rec.facility}</span>
              <span class="badge ${rec.riskLevel === 'High' ? 'badge-critical' : rec.riskLevel === 'Medium' ? 'badge-high' : 'badge-success'}">${rec.riskLevel} RISK</span>
            </div>
            <div style="font-size:12px; color:#556877;">
              Category: <strong>${rec.category}</strong> | Data Stream: <strong>${rec.dataSource}</strong> | Ingestion: ${rec.date}
            </div>
          </div>

          <div style="border:1px solid #397B63; background:#F5F9F7; padding:10px; border-radius:3px;">
            <div style="font-size:11px; font-weight:bold; color:#275E4A; text-transform:uppercase;">Deterministic AI Assessment Result</div>
            <div style="font-size:13px; font-weight:bold; color:#123B63; margin:3px 0;">${rec.aiResult}</div>
            <div style="font-size:12px; color:#275E4A; margin-top:4px;">
              <strong>Recommendation:</strong> ${rec.recommendation || 'Continuous telemetry monitoring.'}
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:bold; color:#123B63; margin-bottom:4px; text-transform:uppercase;">Technical Telemetry & Sensor Readings</div>
            <div class="table-responsive">
              <table class="table-gov">
                <tbody>${telemetryRows}</tbody>
              </table>
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:bold; color:#123B63; margin-bottom:4px; text-transform:uppercase;">Key Discrepancy Indicators & Evidence Snippets</div>
            ${indicatorsHtml}
          </div>
        `;
      }

      const modal = document.getElementById('recordDetailsModal');
      if (modal) modal.classList.add('active');
    }

    closeRecordModal() {
      const modal = document.getElementById('recordDetailsModal');
      if (modal) modal.classList.remove('active');
    }

    // --- Officer Sign-Off Flow ---
    openOfficerSignOffFromModal() {
      if (!this.currentSelectedRecord) return;
      this.closeRecordModal();

      document.getElementById('signOffTargetTitle').textContent = `${this.currentSelectedRecord.psu} — ${this.currentSelectedRecord.facility}`;
      document.getElementById('signOffTargetId').textContent = this.currentSelectedRecord.id;
      document.getElementById('decisionRemarkInput').value = `Verified under PNGRB Rule Section 4. ${this.currentSelectedRecord.recommendation}`;

      const modal = document.getElementById('officerSignOffModal');
      if (modal) modal.classList.add('active');
    }

    closeOfficerSignOffModal() {
      const modal = document.getElementById('officerSignOffModal');
      if (modal) modal.classList.remove('active');
    }

    handleOfficerDecisionSubmit(e) {
      if (e) e.preventDefault();
      const decision = document.getElementById('decisionSelect').value;
      const remark = document.getElementById('decisionRemarkInput').value;

      if (!remark || remark.trim().length < 5) {
        alert("Please enter a valid statutory officer remark before signing off.");
        return;
      }

      if (this.currentSelectedRecord) {
        const newStatus = decision === 'APPROVE' ? 'Verified' : decision === 'REJECT' ? 'Compliant' : 'Under Scrutiny';
        this.currentSelectedRecord.status = newStatus;
        this.addAuditEntry(
          'OFFICER_DECISION',
          this.currentSelectedRecord.facility,
          `Statutory Decision [${decision}] recorded by ${this.currentUser.name}. Remark: "${remark}"`,
          decision === 'APPROVE' ? 'SUCCESS' : 'ALERT'
        );
      }

      this.closeOfficerSignOffModal();
      this.renderDashboard();
      this.renderRecordsTable();
      alert(`Officer Decision successfully registered with Ministry Digital Signature.`);
    }

    // --- Data Upload Handler ---
    handleDataUpload(e) {
      if (e) e.preventDefault();
      const psu = document.getElementById('uploadPsuSelect').value;
      const category = document.getElementById('uploadCategorySelect').value;
      const facility = document.getElementById('uploadFacilityInput').value;
      const dataStream = document.getElementById('uploadDataStream').value;
      const fileInput = document.getElementById('uploadFileInput');

      if (!fileInput.files.length) {
        alert("Please select a valid data file.");
        return;
      }

      const file = fileInput.files[0];
      const progressContainer = document.getElementById('uploadProgressContainer');
      const progressBar = document.getElementById('uploadProgressBar');
      const progressLabel = document.getElementById('uploadProgressLabel');
      const progressPercent = document.getElementById('uploadProgressPercent');
      const submitBtn = document.getElementById('uploadSubmitBtn');

      if (progressContainer) progressContainer.style.display = 'block';
      if (submitBtn) submitBtn.disabled = true;

      let pct = 10;
      const interval = setInterval(() => {
        pct += 25;
        if (pct >= 100) {
          pct = 100;
          clearInterval(interval);

          if (progressBar) progressBar.style.width = '100%';
          if (progressPercent) progressPercent.textContent = '100%';
          if (progressLabel) progressLabel.textContent = 'Ingestion complete: SHA-256 Checksum Verified (Integrity: PASSED)';

          setTimeout(() => {
            // Add new record to seed database
            const newId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const newRecord = {
              id: newId,
              category: category,
              psu: psu,
              facility: facility,
              dataSource: dataStream,
              status: "Under Scrutiny",
              riskLevel: "Medium",
              aiResult: "Ingestion Batch Validated; Telemetry awaiting baseline comparison",
              date: new Date().toISOString().slice(0,10) + " " + new Date().toLocaleTimeString('en-GB').slice(0,5) + " IST",
              telemetry: {
                fileName: file.name,
                fileSize: (file.size / 1024).toFixed(1) + " KB",
                recordsIngested: 1240,
                checksum: "SHA256:88a1c9e0" + Math.floor(1000 + Math.random() * 9000),
                ingestionNode: "MoPNG-NIC-DEL04"
              },
              indicators: [
                `File ${file.name} ingested successfully under regulatory classification ${category}.`,
                "SHA-256 cryptographic checksum matches transmission manifest.",
                "Automated rule engine triggered for boundary condition analysis."
              ],
              recommendation: "Awaiting preliminary deterministic anomaly check."
            };

            this.records.unshift(newRecord);
            this.filteredRecords = [...this.records];
            this.addAuditEntry('DATA_INGESTION', facility, `Batch file ${file.name} ingested for ${psu}. Record ${newId} created.`, 'SUCCESS');

            if (submitBtn) submitBtn.disabled = false;
            if (progressContainer) progressContainer.style.display = 'none';

            alert(`Batch Ingestion Successful!\nRecord ID: ${newId}\nCryptographic Integrity: PASSED`);
            this.switchView('records');
          }, 600);
        } else {
          if (progressBar) progressBar.style.width = pct + '%';
          if (progressPercent) progressPercent.textContent = pct + '%';
        }
      }, 300);
    }

    resetUploadForm() {
      document.getElementById('uploadDataForm').reset();
      const progressContainer = document.getElementById('uploadProgressContainer');
      if (progressContainer) progressContainer.style.display = 'none';
    }

    // --- Multi-Stage AI Analysis Scrutiny Execution ---
    onAnalysisCaseSelect() {
      const sel = document.getElementById('analysisCaseSelect');
      if (sel) {
        this.loadAnalysisCase(sel.value);
      }
    }

    loadAnalysisCase(caseId) {
      this.currentAnalysisCase = caseId;
      const sel = document.getElementById('analysisCaseSelect');
      if (sel) sel.value = caseId;

      const caseDetailsMap = {
        'CASE-8841': {
          target: "GAIL HVJ Trunk Sector 4B (Hazira-Vijaipur)",
          assessment: "Potential flow discrepancy and pressure divergence detected",
          confidence: 87,
          severity: "Medium",
          severityBadge: "badge-high",
          indicators: [
            "Input telemetry at Hazira compressor shows 4.8% divergence against downstream Jagdishpur terminal meter (statutory PNGRB limit <= 1.2%).",
            "Transient localized pressure drop recorded between Valve Station VS-14 and VS-16 without off-take logged in daily manifest.",
            "Density sensor batch test indicates subtle thermal variance compared to refinery test certification."
          ],
          recommendation: "Further verification recommended. Dispatch physical ultrasonic calibration team to Valve Station VS-14 before the next transmission cycle."
        },
        'CASE-9022': {
          target: "IOCL Paradip Refinery Terminal B (BS-VI Diesel)",
          assessment: "Sulphur specification margin exceeded (11.4 ppm vs 10.0 ppm BIS ceiling)",
          confidence: 96,
          severity: "High",
          severityBadge: "badge-critical",
          indicators: [
            "Despatch batch sulphur content recorded at 11.4 ppm, exceeding mandatory BS-VI ceiling under Environment Protection Rules.",
            "Refinery primary hydrocracker sensor log showed brief catalyst bed temperature dip 4 hours prior to blending batch sign-off.",
            "Automated containment valve triggered cutoff after 6,200 KL pipeline release."
          ],
          recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream Cuttack depot for mandatory re-hydrotreating and lab re-certification."
        },
        'CASE-9140': {
          target: "Subsidized LPG Bottling Plant - Kanpur Rural",
          assessment: "Subsidy diversion pattern flagged across commercial retail distributors",
          confidence: 91,
          severity: "High",
          severityBadge: "badge-critical",
          indicators: [
            "1,420 subsidized domestic LPG cylinders dispatched without corresponding Aadhaar authentication tokens in PMUY database.",
            "Geographic clustering of repeat bookings within 48 hours detected across three commercial highway distributors.",
            "Weighbridge automated RFID log records exit timestamps inconsistent with security bay manifest."
          ],
          recommendation: "Issue immediate statutory show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance inspection team."
        },
        'CASE-9255': {
          target: "ONGC Mumbai High Offshore Platform B-17",
          assessment: "Telemetry fully reconciled; routine flow meter calibration drift noted",
          confidence: 94,
          severity: "Low",
          severityBadge: "badge-success",
          indicators: [
            "Wellhead multi-phase flow rates align within 0.6% tolerance against Uran coastal terminal receipt meters.",
            "Subsea choke valve pressure differential exhibits stable laminar profile over continuous 72-hour operational cycle.",
            "Secondary density sensor indicates minor 0.3% calibration offset."
          ],
          recommendation: "Routine scheduled telemetry monitoring; next statutory underwater sensor calibration scheduled 15-Oct-2026."
        }
      };

      const cData = caseDetailsMap[caseId] || caseDetailsMap['CASE-8841'];
      const container = document.getElementById('analysisDetailsContainer');
      if (!container) return;

      container.innerHTML = `
        <div class="panel ai-insight-panel">
          <div class="panel-header">
            <span>AI ANALYSIS RESULT — INCIDENT REF: ${caseId}</span>
            <span class="ai-tag">${cData.target}</span>
          </div>
          <div class="panel-body">
            <div class="ai-result-block">
              <div class="ai-assessment-box">
                <div style="font-size:11px; font-weight:bold; color:#123B63; text-transform:uppercase;">AI Analysis Result</div>
                <div style="font-size:14px; font-weight:bold; color:#214c3a; margin-top:2px;">
                  Assessment: ${cData.assessment}
                </div>
              </div>

              <div class="ai-metric-row">
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Confidence</span>
                  <div class="ai-metric-value">${cData.confidence}%</div>
                  <div class="confidence-bar-wrap">
                    <div class="confidence-bar-fill" style="width: ${cData.confidence}%;"></div>
                  </div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Severity</span>
                  <div class="ai-metric-value"><span class="badge ${cData.severityBadge}">${cData.severity}</span></div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Deterministic Engine</span>
                  <div style="font-size:12px; font-weight:bold; color:#123B63;">PNGRB Rule Matrix v3.2</div>
                </div>
              </div>

              <div>
                <div style="font-size:11px; font-weight:bold; color:#123B63; margin-bottom:4px; text-transform:uppercase;">Key Indicators:</div>
                <ul class="ai-indicator-list">
                  ${cData.indicators.map(i => `<li class="ai-indicator-item">${i}</li>`).join('')}
                </ul>
              </div>

              <div class="ai-recommendation-box">
                <strong>Recommendation:</strong>
                ${cData.recommendation}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-accent btn-sm" onclick="parakhApp.endorseAiFinding('${caseId}')">
                    [ Endorse Finding & Issue Direction ]
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="parakhApp.requestReaudit('${caseId}')">
                    [ Request Sensor Re-Audit ]
                  </button>
                </div>
                <span style="font-size:11px; color:#556877;">Verification Hub: MCA21, GSTN, SCADA & PNGRB Grid</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    runAiAnalysisPipeline() {
      if (this.isPipelineRunning) return;
      this.isPipelineRunning = true;

      const btn = document.getElementById('triggerAiAnalysisBtn');
      const badge = document.getElementById('analysisPipelineStatusBadge');
      if (btn) btn.disabled = true;
      if (badge) {
        badge.className = 'badge badge-high';
        badge.textContent = 'EXECUTING DETERMINISTIC RULES...';
      }

      const stages = [
        { id: 'pipeStage1', statusId: 'pipeStage1Status', label: 'Processing Telemetry (320ms)' },
        { id: 'pipeStage2', statusId: 'pipeStage2Status', label: 'Boundary Condition Check (480ms)' },
        { id: 'pipeStage3', statusId: 'pipeStage3Status', label: 'Cross-Source Matching (590ms)' },
        { id: 'pipeStage4', statusId: 'pipeStage4Status', label: 'Deterministic Rule Engine (140ms)' },
        { id: 'pipeStage5', statusId: 'pipeStage5Status', label: 'Dossier Assembled (210ms)' }
      ];

      // Reset cards
      stages.forEach(s => {
        const el = document.getElementById(s.statusId);
        if (el) {
          el.textContent = 'Queued...';
          el.style.color = '#536270';
        }
      });

      let currentStageIdx = 0;

      const stepInterval = setInterval(() => {
        if (currentStageIdx < stages.length) {
          const s = stages[currentStageIdx];
          const el = document.getElementById(s.statusId);
          if (el) {
            el.innerHTML = '<span class="spin-loader" style="border-color:#123B63; border-top-color:transparent; margin-right:4px;"></span> ' + s.label;
            el.style.color = '#123B63';
          }

          if (currentStageIdx > 0) {
            const prev = stages[currentStageIdx - 1];
            const prevEl = document.getElementById(prev.statusId);
            if (prevEl) {
              prevEl.textContent = '✓ COMPLETED';
              prevEl.style.color = '#275E4A';
              prevEl.style.fontWeight = 'bold';
            }
          }
          currentStageIdx++;
        } else {
          clearInterval(stepInterval);
          // Complete last stage
          const last = stages[stages.length - 1];
          const lastEl = document.getElementById(last.statusId);
          if (lastEl) {
            lastEl.textContent = '✓ COMPLETED';
            lastEl.style.color = '#275E4A';
            lastEl.style.fontWeight = 'bold';
          }

          if (badge) {
            badge.className = 'badge badge-success';
            badge.textContent = 'PIPELINE VERIFIED / READY';
          }
          if (btn) btn.disabled = false;
          this.isPipelineRunning = false;

          this.addAuditEntry(
            'AI_SCRUTINY_RUN',
            this.currentAnalysisCase,
            `5-stage scrutiny pipeline completed across 14,400 sensor records. Anomaly classification confirmed.`,
            'SUCCESS'
          );

          this.loadAnalysisCase(this.currentAnalysisCase);
        }
      }, 400);
    }

    endorseAiFinding(caseId) {
      this.addAuditEntry(
        'OFFICER_ENDORSEMENT',
        caseId,
        `Finding endorsed by ${this.currentUser.name}. Formal inspection team ordered pursuant to PNGRB Gazette notice.`,
        'SUCCESS'
      );
      alert(`AI Finding for ${caseId} officially endorsed by ${this.currentUser.name}.\nStatutory inspection directive dispatched.`);
    }

    requestReaudit(caseId) {
      this.addAuditEntry(
        'RE_AUDIT_REQUEST',
        caseId,
        `Re-calibration and manual sensor check ordered by ${this.currentUser.name}.`,
        'ALERT'
      );
      alert(`Re-audit directive issued for ${caseId}.\nOperating PSU has 48 hours to submit re-calibrated sensor certificates.`);
    }

    // --- Structured AI Insights View (Prompt-specified structure) ---
    renderStructuredAiInsights() {
      const container = document.getElementById('insightsCardContainer');
      if (!container) return;

      const insightsList = [
        {
          ref: "INSIGHT-2026-PNG-01",
          target: "GAIL HVJ Trunk Pipeline Sector 4B",
          assessment: "Potential flow discrepancy and pressure divergence detected",
          confidence: 87,
          severity: "Medium",
          severityBadge: "badge-high",
          indicators: [
            "Input telemetry at Hazira compressor station deviates from downstream Jagdishpur terminal meter by 4.8% (statutory limit <= 1.2%).",
            "SCADA pressure curve exhibits localized depression between Valve Station VS-14 and VS-16 without corresponding off-take in manifest.",
            "Gas chromatograph density sample indicates minor thermal variance compared to refinery test cert."
          ],
          recommendation: "Immediate physical ultrasonic valve inspection at Valve Station VS-14 recommended before subsequent transmission batch."
        },
        {
          ref: "INSIGHT-2026-PNG-02",
          target: "IOCL Paradip Refinery (BS-VI Diesel Despatch)",
          assessment: "Sulphur specification margin exceeded (11.4 ppm vs 10.0 ppm max)",
          confidence: 96,
          severity: "High",
          severityBadge: "badge-critical",
          indicators: [
            "Despatch batch sulphur content recorded at 11.4 ppm, exceeding mandatory BS-VI ceiling of 10.0 ppm under Environment Protection Rules.",
            "Refinery hydrocracker sensor log showed brief catalyst bed temperature dip 4 hours prior to blending batch sign-off.",
            "Downstream terminal containment protocol activated."
          ],
          recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream Cuttack depot for mandatory re-hydrotreating and lab re-certification."
        },
        {
          ref: "INSIGHT-2026-PNG-03",
          target: "Subsidized LPG Bottling Plant - Kanpur Rural",
          assessment: "Subsidy diversion pattern flagged (1,420 cylinders unaccounted)",
          confidence: 91,
          severity: "High",
          severityBadge: "badge-critical",
          indicators: [
            "1,420 subsidized domestic LPG cylinders dispatched without corresponding Aadhaar authentication tokens in PMUY database.",
            "Geographic clustering of repeat bookings within 48 hours detected across three commercial highway distributors.",
            "Weighbridge RFID logs exhibit timing discrepancies with gate security register."
          ],
          recommendation: "Issue immediate statutory show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance inspection team."
        },
        {
          ref: "INSIGHT-2026-PNG-04",
          target: "ONGC Mumbai High Offshore Platform B-17",
          assessment: "Subsea wellhead flow and associated gas mass-balance verified",
          confidence: 99,
          severity: "Low",
          severityBadge: "badge-success",
          indicators: [
            "Flow rates match onshore Uran terminal receipt meters within 0.6% statutory tolerance.",
            "Subsea choke valve pressure differential exhibits stable laminar profile over continuous 72-hour operational cycle.",
            "Zero fugitive flare emission violations recorded."
          ],
          recommendation: "Routine scheduled telemetry monitoring; next statutory underwater sensor calibration scheduled 15-Oct-2026."
        }
      ];

      container.innerHTML = insightsList.map(ins => `
        <div class="panel ai-insight-panel">
          <div class="panel-header">
            <span>AI ANALYSIS RESULT — REF: ${ins.ref}</span>
            <span class="ai-tag">${ins.target}</span>
          </div>
          <div class="panel-body">
            <div class="ai-result-block">
              <div class="ai-assessment-box">
                <div style="font-size:11px; font-weight:bold; color:#123B63; text-transform:uppercase;">AI Analysis Result</div>
                <div style="font-size:13px; font-weight:bold; color:#214c3a; margin-top:2px;">
                  Assessment: ${ins.assessment}
                </div>
              </div>

              <div class="ai-metric-row">
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Confidence</span>
                  <div class="ai-metric-value">${ins.confidence}%</div>
                  <div class="confidence-bar-wrap">
                    <div class="confidence-bar-fill" style="width: ${ins.confidence}%;"></div>
                  </div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Severity</span>
                  <div class="ai-metric-value"><span class="badge ${ins.severityBadge}">${ins.severity}</span></div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Verification Target</span>
                  <div style="font-size:12px; font-weight:bold; color:#123B63;">${ins.target}</div>
                </div>
              </div>

              <div>
                <div style="font-size:11px; font-weight:bold; color:#123B63; margin-bottom:4px; text-transform:uppercase;">Key Indicators:</div>
                <ul class="ai-indicator-list">
                  ${ins.indicators.map(i => `<li class="ai-indicator-item">${i}</li>`).join('')}
                </ul>
              </div>

              <div class="ai-recommendation-box">
                <strong>Recommendation:</strong>
                ${ins.recommendation}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                <button class="btn btn-accent btn-sm" onclick="parakhApp.switchView('ai-analysis'); parakhApp.loadAnalysisCase('CASE-8841');">
                  [ View Detailed Analysis ]
                </button>
                <span style="font-size:11px; color:#556877;">Engine: Deterministic Rule Matrix v3.2</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // --- Reports Management ---
    renderReportsTable() {
      const tbody = document.getElementById('reportsTbody');
      if (!tbody) return;

      tbody.innerHTML = this.reports.map(rep => `
        <tr>
          <td><strong>${rep.title}</strong></td>
          <td style="font-family:monospace; font-size:11px;">${rep.code}</td>
          <td>${rep.category}</td>
          <td style="font-size:11px;">${rep.date}</td>
          <td><span class="badge badge-success">${rep.status}</span></td>
          <td style="font-size:11px;">${rep.createdBy}</td>
          <td><span class="badge badge-info">${rep.classification}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.downloadReportPDF('${rep.code}')">Download PDF</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.viewReportData('${rep.code}')">View Sheet</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    filterReports() {
      const search = (document.getElementById('reportSearchInput').value || '').toLowerCase();
      const cat = document.getElementById('reportCategoryFilter').value;

      const filtered = this.reports.filter(r => {
        if (search && !r.title.toLowerCase().includes(search) && !r.code.toLowerCase().includes(search)) {
          return false;
        }
        if (cat !== 'ALL' && r.category !== cat) return false;
        return true;
      });

      const tbody = document.getElementById('reportsTbody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#687786;">No statutory reports found matching criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(rep => `
        <tr>
          <td><strong>${rep.title}</strong></td>
          <td style="font-family:monospace; font-size:11px;">${rep.code}</td>
          <td>${rep.category}</td>
          <td style="font-size:11px;">${rep.date}</td>
          <td><span class="badge badge-success">${rep.status}</span></td>
          <td style="font-size:11px;">${rep.createdBy}</td>
          <td><span class="badge badge-info">${rep.classification}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.downloadReportPDF('${rep.code}')">Download PDF</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.viewReportData('${rep.code}')">View Sheet</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    openGenerateReportModal() {
      const modal = document.getElementById('generateReportModal');
      if (modal) modal.classList.add('active');
    }

    closeGenerateReportModal() {
      const modal = document.getElementById('generateReportModal');
      if (modal) modal.classList.remove('active');
    }

    handleGenerateReportSubmit(e) {
      if (e) e.preventDefault();
      const title = document.getElementById('reportParamTitle').value;
      const sector = document.getElementById('reportParamSector').value;
      const fmt = document.getElementById('reportParamFormat').value;

      const newCode = `MOPNG/REP/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      const newRep = {
        title: title,
        code: newCode,
        category: sector === 'All Sectors' ? 'Pipeline Integrity' : sector,
        date: new Date().toISOString().slice(0,10),
        status: "Officially Signed",
        createdBy: `${this.currentUser.name}`,
        classification: "RESTRICTED",
        downloadUrl: "#"
      };

      this.reports.unshift(newRep);
      this.addAuditEntry('REPORT_GENERATED', sector, `Statutory Report ${newCode} generated in ${fmt} format by ${this.currentUser.name}`, 'SUCCESS');
      this.closeGenerateReportModal();
      this.renderReportsTable();
      alert(`Report ${newCode} successfully compiled and digitally attested.\nArchived in Ministry Central Repository.`);
    }

    downloadReportPDF(code) {
      alert(`Generating official Ministry PDF document for [${code}] with Government of India digital stamp...\nDownload initiated.`);
    }

    viewReportData(code) {
      alert(`Opening raw telemetry and audit dataset for report [${code}] in spreadsheet viewer.`);
    }

    // --- Alerts Management (3-Tone Restrained Styling) ---
    renderAlerts() {
      const container = document.getElementById('alertsFullContainer');
      if (!container) return;

      const filtered = this.alerts.filter(a => {
        if (this.activeAlertFilter === 'ALL') return true;
        return a.severity === this.activeAlertFilter;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <h4>No alerts in category: ${this.activeAlertFilter}</h4>
            <p>All pipeline sensors and statutory manifests operating within designated tolerances.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(alt => {
        let badgeCls = 'badge-info';
        if (alt.severity === 'CRITICAL') badgeCls = 'badge-critical';
        else if (alt.severity === 'HIGH') badgeCls = 'badge-high';
        else if (alt.severity === 'MEDIUM') badgeCls = 'badge-medium';

        return `
          <div class="panel" style="background:#FAF9F5; border-left:4px solid ${alt.severity === 'CRITICAL' ? '#8B2019' : alt.severity === 'HIGH' ? '#8C5B11' : '#397B63'};">
            <div class="panel-header" style="background:#F2EFE6;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge ${badgeCls}">${alt.severity}</span>
                <span style="font-weight:bold; color:#123B63;">${alt.facility}</span>
                <span style="font-size:11px; color:#5c6b78;">| Ref: ${alt.id}</span>
              </div>
              <span style="font-size:11px; color:#5c6b78;">${alt.timestamp}</span>
            </div>
            <div class="panel-body">
              <div style="font-size:13px; font-weight:bold; color:#123B63; margin-bottom:4px;">${alt.title}</div>
              <p style="font-size:12px; color:#334155; margin-bottom:10px; line-height:1.4;">${alt.description}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="font-size:11px; color:#687786;">
                  Status: <strong>${alt.acknowledged ? '✓ Acknowledged by Audit Officer' : 'Pending Formal Officer Review'}</strong>
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${alt.refId}')">View Telemetry</button>
                  ${!alt.acknowledged ? `<button class="btn btn-accent btn-sm" onclick="parakhApp.acknowledgeAlert('${alt.id}')">Acknowledge</button>` : ''}
                  <button class="btn btn-primary btn-sm" onclick="parakhApp.escalateAlert('${alt.id}')">Escalate to Directorate</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    filterAlerts(filterType) {
      this.activeAlertFilter = filterType;
      this.renderAlerts();
    }

    acknowledgeAlert(alertId) {
      const alt = this.alerts.find(a => a.id === alertId);
      if (alt) {
        alt.acknowledged = true;
        this.addAuditEntry('ALERT_ACKNOWLEDGED', alt.facility, `Alert ${alt.id} acknowledged by ${this.currentUser.name}`, 'INFO');
        this.renderAlerts();
        this.renderDashboard();

        // Update badge
        const unackedCount = this.alerts.filter(a => !a.acknowledged).length;
        const countEl = document.getElementById('headerAlertCount');
        const sideEl = document.getElementById('sidebarAlertBadge');
        if (countEl) countEl.textContent = unackedCount.toString();
        if (sideEl) sideEl.textContent = unackedCount.toString();
      }
    }

    escalateAlert(alertId) {
      const alt = this.alerts.find(a => a.id === alertId);
      if (alt) {
        this.addAuditEntry('ALERT_ESCALATED', alt.facility, `Alert ${alt.id} escalated to MoPNG Joint Secretary & Technical Safety Cell`, 'ALERT');
        alert(`Alert ${alertId} escalated to the Ministry Directorate.\nStatutory summons drafted.`);
      }
    }

    // --- Audit Trail (NIC Standard) ---
    renderAuditHistory() {
      const tbody = document.getElementById('auditHistoryTbody');
      if (!tbody) return;

      tbody.innerHTML = this.auditTrail.map(entry => {
        let tagCls = 'badge-info';
        if (entry.status === 'SUCCESS') tagCls = 'badge-success';
        else if (entry.status === 'CRITICAL') tagCls = 'badge-critical';
        else if (entry.status === 'ALERT') tagCls = 'badge-high';

        return `
          <tr>
            <td style="white-space:nowrap; font-size:11px;">${entry.timestamp}</td>
            <td style="font-family:monospace; font-size:11px;">${entry.ref}</td>
            <td><strong>${entry.actor}</strong></td>
            <td style="font-size:11px;"><code>${entry.type}</code></td>
            <td>${entry.facility}</td>
            <td style="font-size:12px;">${entry.description}</td>
            <td style="font-family:monospace; font-size:10px; color:#123B63;">${entry.hash}</td>
            <td><span class="badge ${tagCls}">${entry.status}</span></td>
          </tr>
        `;
      }).join('');
    }

    addAuditEntry(type, facility, description, status) {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString('en-GB') + " IST";
      const hash = `SHA256:${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      const ref = `AUD-${Math.floor(1000 + Math.random() * 9000)}-Z`;

      this.auditTrail.unshift({
        timestamp,
        ref,
        actor: `${this.currentUser.name} (${this.currentUser.badgeId})`,
        type,
        facility,
        description,
        hash,
        status
      });

      this.renderAuditHistory();
    }
  }

  // Instantiate and bind to global window
  window.parakhApp = new ParakhApplication();

})();

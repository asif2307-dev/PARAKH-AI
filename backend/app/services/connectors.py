from typing import Dict, Any, List
import time

class ConnectorRegistry:
    """
    Simulated Government & Statutory Connectors (Verify+ Module).
    Provides realistic responses for demo purposes while transparently indicating simulation.
    Architecturally ready for live API integration via pluggable client adapters.
    """

    @staticmethod
    def query_mca21(cin: str = "", gstin: str = "", pan: str = "") -> Dict[str, Any]:
        # Simulated MCA21 ROC response
        return {
            "source": "MCA21 Corporate Registry",
            "is_simulated": True,
            "status": "SUCCESS",
            "data": {
                "entity_name": "Bharat Industrial Systems Pvt Ltd",
                "cin": cin or "U29100MH2015PTC261942",
                "incorporation_date": "14-Aug-2015",
                "roc_jurisdiction": "ROC Mumbai",
                "paid_up_capital": "₹2,50,00,000",
                "filing_status": "Active (Returns Filed)",
                "financial_year": "2024-25",
                "turnover_aoc4_reported": "₹3,90,00,000 (INR 3.90 Cr)",
                "discrepancy_note": "Filing AOC-4 shows ₹3.90 Cr vs Bid submission ₹8.20 Cr"
            }
        }

    @staticmethod
    def query_gstn(gstin: str) -> Dict[str, Any]:
        return {
            "source": "GSTN Common Portal",
            "is_simulated": True,
            "status": "SUCCESS",
            "data": {
                "gstin": gstin,
                "legal_name": "Bharat Industrial Systems",
                "taxpayer_type": "Regular",
                "registration_date": "01-Jul-2017",
                "status": "ACTIVE",
                "gstr3b_status": "FILED_UP_TO_JAN_2026",
                "aggregate_turnover_bracket": "₹1.5 Cr to ₹5 Cr"
            }
        }

    @staticmethod
    def query_udyam(udyam_reg: str) -> Dict[str, Any]:
        return {
            "source": "Udyam MSME Portal",
            "is_simulated": True,
            "status": "SUCCESS",
            "data": {
                "udyam_number": udyam_reg,
                "enterprise_name": "Bharat Industrial Systems",
                "classification": "Medium Enterprise",
                "major_activity": "Manufacturing",
                "plant_machinery_investment": "₹12.40 Crore",
                "turnover": "₹18.50 Crore (Consolidated)",
                "mse_waiver_eligible": False,
                "note": "Medium enterprises are not eligible for Micro/Small tender fee exemption."
            }
        }

    @staticmethod
    def query_debarment(pan: str, vendor_name: str) -> Dict[str, Any]:
        return {
            "source": "CVC & GeM Debarment Repository",
            "is_simulated": True,
            "status": "SUCCESS",
            "data": {
                "pan": pan,
                "vendor_name": vendor_name,
                "is_debarred": False,
                "debarment_record": "NONE",
                "incident_count": 0,
                "clearance_id": f"CLR-2026-{pan[:5]}-CLEAN"
            }
        }

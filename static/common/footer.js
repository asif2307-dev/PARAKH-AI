document.addEventListener("DOMContentLoaded", () => {
    const footerHTML = `
        <footer class="institutional-footer">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>About PARAKH AI</h3>
                    <a href="/about">Platform Overview</a>
                    <a href="/programs">Initiatives</a>
                    <a href="/resources">Publications</a>
                    <a href="/contact">Contact Us</a>
                </div>
                <div class="footer-col">
                    <h3>Services</h3>
                    <a href="/services">Compliance Scrutiny</a>
                    <a href="/services">Risk Analysis</a>
                    <a href="/services">Audit Verification</a>
                </div>
                <div class="footer-col">
                    <h3>Help & Support</h3>
                    <a href="/faq">FAQs</a>
                    <a href="/contact">Technical Support</a>
                    <a href="#">Security Guidelines</a>
                </div>
                <div class="footer-col">
                    <h3>Legal & Policies</h3>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                    <a href="#">Accessibility Statement</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Government e-Marketplace (GeM). All rights reserved.</p>
                <p>Designed for Smart India Hackathon (SIH26100) by Team Butter Chicken.</p>
            </div>
        </footer>
    `;

    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
});

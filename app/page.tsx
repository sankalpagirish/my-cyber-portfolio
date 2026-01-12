"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 relative overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4 text-sm">
          <div className="font-bold text-lg text-emerald-400">SG</div>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-emerald-400">About</a>
            <a href="#education" className="hover:text-emerald-400">Education</a>
            <a href="#certifications" className="hover:text-emerald-400">Certifications</a>
            <a href="#experience" className="hover:text-emerald-400">Experience</a>
            <a href="#skills" className="hover:text-emerald-400">Skills</a>
            <a href="#projects" className="hover:text-emerald-400">Projects</a>
            <a href="#contact" className="hover:text-emerald-400">Contact</a>
          </div>
        </div>
      </nav>

           {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32">
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 0px rgba(16,185,129,0)",
                "0 0 12px rgba(16,185,129,0.35)",
                "0 0 0px rgba(16,185,129,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Sankalpa Girish
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-400 text-lg"
        >
          Blue Team Engineer • SOC Analyst • Incident Detection & Response
        </motion.p>

      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/profileeee.jpeg"
              alt="Profile photo"
              width={320}
              height={400}
              className="rounded-xl object-cover border border-gray-800"
            />

            {/* CONTACT CARD – WHITE ICONS */}
            <div className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition space-y-4">

              {/* EMAIL */}
              <div className="flex items-center gap-4">
                <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    d="M16 12H8m8 0l-8-5m8 5l-8 5" />
                </svg>
                <a href="mailto:sankalpagirish27@email.com" className="hover:text-emerald-400">
                  sankalpagirish27@email.com
                </a>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-4">
                <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2h-1" />
                </svg>
                <a href="tel:+17732420770" className="hover:text-emerald-400">
                  +1-773-242-0770
                </a>
              </div>

              {/* LINKEDIN */}
              <div className="flex items-center gap-4">
                <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8h4.56v16H.22zM8.98 8h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.98"/>
                </svg>
                <a
                  href="https://www.linkedin.com/in/sankalpa-girish/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  linkedin.com/in/sankalpa-girish
                </a>
              </div>
                            {/* TRYHACKME */}
              <div className="w-full border border-gray-700 rounded-lg overflow-hidden hover:border-emerald-500 transition">

                {/* Badge */}
                <iframe
                  src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=5802609"
                  style={{ border: "none", width: "100%", height: "140px" }}
                  loading="lazy"
                  title="TryHackMe Badge"
                ></iframe>

                {/* Profile Link */}
                <div className="text-center py-2 text-sm">
                  <a
                    href="https://tryhackme.com/p/write2sankalpagirish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400"
                  >
                    View TryHackMe Profile →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 space-y-6 text-justify hover:border-emerald-500 transition">
                <p>
                 I am a graduate student at DePaul University pursuing a degree in
                 Cybersecurity with a concentration in Computer Security. Currently in
                 my second academic quarter, I maintain a 4.0 GPA and focus on building
                 strong foundations in security operations, threat detection, incident
                 response, and digital forensics through hands-on labs and practical
                 security projects.
                </p>

                <p>
                 I am actively working toward a career in the Blue Team domain of
                 cybersecurity, with particular interests in log analysis, SIEM-based
                 monitoring, and understanding real-world attack patterns through
                 applied learning and lab-based investigations.
                </p>

                <p>
                 Outside of cybersecurity, I enjoy reading both fiction and non-fiction
                 novels and watching crime and forensic investigation series. I
                 particularly enjoy fiction and crime thrillers by authors such as
                 Ankur Warikoo and Freida McFadden, known for her unexpected plot
                 twists. My favorite crime and investigative
                 series include <em>The Mentalist</em> and <em>Person of Interest</em>,
                 which highlight how technology is used to solve complex cases.
               </p>

               <p>
                 I am always open to connecting, whether to discuss cybersecurity topics
                 or shared interests in books and crime-focused series.
              </p>
          </div>


        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Education</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition">
            <h3 className="font-semibold text-white">MS in Cybersecurity</h3>
            <p>DePaul University</p>
            <p className="text-sm text-gray-500">GPA: 4.0 / 4.0</p>
            <p className="text-sm text-gray-500">Expected June 2027</p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition">
            <h3 className="font-semibold text-white">B.Tech in Information Science</h3>
            <p>P.E.S College of Engineering</p>
            <p className="text-sm text-gray-500">CGPA: 8.52 / 10</p>
            <p className="text-sm text-gray-500">Graduated July 2024</p>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS WITH VIEW CERTIFICATE */}
      <section id="certifications" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Professional Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "CompTIA Security+", year: "2025–2028", status: "Completed", file: "comptia-security-plus.pdf" },
            { name: "ISC² Certified in Cybersecurity (CC)", year: "2025–2028", status: "Completed", file: "isc2-cc.pdf" },
            { name: "AWS Cloud Practitioner", year: "2025–2028", status: "Completed", file: "aws-cloud-practitioner.pdf" },
            { name: "CompTIA CySA+", year: "2026", status: "In Progress" },
          ].map((cert, i) => (
            <div key={i} className="bg-[#161b22] border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition">
              <h3 className="font-semibold text-white">{cert.name}</h3>
              <p className="text-sm text-gray-500">{cert.year}</p>

              <div className="flex gap-3 mt-4">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  cert.status === "Completed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {cert.status}
                </span>

                {cert.file && (
                  <a
                    href={`/certificates/${cert.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

            {/* EXPERIENCE */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Backend Developer — Auditech Innovation Pvt. Ltd.",
              date: "Sep 2024 – Jun 2025",
              items: [
                "Supported enterprise backend services and SQL databases",
                "Performed application and system log analysis",
                "Worked with authentication and access control logic",
              ],
            },
            {
              title: "IT Intern — Auditech Innovation Pvt. Ltd.",
              date: "Feb 2024 – Apr 2024",
              items: [
                "Provided IT support for internal systems",
                "Administered user access, permissions, and security policies through Active Directory and GPO",
                "Supported routine system checks and documentation",
              ],
            },
            {
              title: "Hands-On Cybersecurity Labs — TryHackMe",
              date: "Present",
              items: [
                "Completed 132+ hands-on labs",
                "Ranked in the top 2% globally",
                "Practiced SOC operations and MITRE ATT&CK techniques",
              ],
            },
            {
              title: "IoT Intern — Cadmaxx EdTech",
              date: "Sep 2022 – Oct 2022",
              items: [
                "Worked with IoT sensors and embedded systems",
                "Developed and tested basic IoT applications",
                "Learned IoT security considerations",
              ],
            },
            {
              title: "District Health Office (DHO)",
              date: "May 2023 – Jun 2023",
              items: [
                "Generated Ayushman Bharat Health Accounts (ABHA)",
                "Performed NCD data entry",
                "Handled sensitive health information responsibly",
              ],
            },
            {
              title: "Volunteer — School Enrichment Program",
              date:  "Sep 2023 – Oct 2023",
              items: [
                "Taught Mathematics, English, and basic computer skills to school students",
                "Promoted digital awareness by teaching safe browsing and basic cyber safety practices",
              ],
            },
          ].map((exp, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-gray-800 rounded-xl p-7 hover:border-emerald-500 transition"
            >
              <h3 className="font-semibold text-white">
                {exp.title}
              </h3>

              <p className="text-xs text-gray-500 mb-4">
                {exp.date}
              </p>

              <div className="space-y-2 text-sm text-gray-400">
                {exp.items.map((item, idx) => (
                  <p
                    key={idx}
                    className="relative pl-4 leading-relaxed text-left"
                  >
                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-gray-400"></span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* TECHNICAL SKILLS – FULL ORIGINAL */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Technical Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "🔐 Cybersecurity Controls & Compliance",
              items: [
                "CIS Critical Security Controls",
                "NIST Cybersecurity Framework",
                "Security policy documentation",
                "Enterprise security standards & controls",
              ],
            },
            {
              title: "🧑‍💻 Endpoint & Identity Security",
              items: [
                "Windows endpoint security",
                "Active Directory",
                "Authentication & access control",
                "User and permission management",
                "Sysinternals Suite",
                "Sysmon",
                "Wazuh",
              ],
            },
            {
              title: "📊 Security Monitoring & Log Analysis",
              items: [
                "Splunk (basic dashboards & alerts)",
                "ELK Stack",
                "Windows Event Logs",
                "Linux authentication & system logs",
              ],
            },
            {
              title: "🌐 Networking & Traffic Analysis",
              items: [
                "TCP/IP",
                "Wireshark",
                "Zeek",
                "Brim",
                "Nmap",
                "NetworkMiner",
                "TShark",
                "tcpdump",
              ],
            },
            {
              title: "🛡️ Threat Analysis & Detection",
              items: [
                "Phishing investigation",
                "Email threat analysis",
                "IDS/IPS",
                "Snort",
                "Suricata",
              ],
            },
            {
              title: "🔍 Digital Forensics & Incident Response (DFIR)",
              items: [
                "Windows & Linux forensics",
                "Autopsy",
                "Redline",
                "KAPE",
                "Volatility",
                "Velociraptor",
                "TheHive",
              ],
            },
            {
              title: "⚙️ Scripting & Automation",
              items: ["Python", "Bash", "PowerShell", "SQL"],
            },
            {
              title: "🖥️ Operating Systems & Virtualization",
              items: ["Windows", "Linux (Ubuntu, Kali)", "VMware", "VirtualBox"],
            },
          ].map((skill, i) => (
            <div key={i} className="bg-[#161b22] border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition">
              <h3 className="font-semibold text-white mb-3">{skill.title}</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {skill.items.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* PROJECT 1 */}
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-7 hover:border-emerald-500 transition space-y-4">
            <h3 className="text-xl font-semibold text-white">
              🔐 SOC Detection & Incident Response Lab
            </h3>
            <p className="text-sm text-gray-400">
              End-to-end SOC monitoring and incident response using endpoint and network telemetry.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Built a SOC lab using Sysmon, Wazuh, Suricata, and ELK/Splunk</li>
              <li>Correlated endpoint and network logs to detect brute-force, malware execution, and reconnaissance</li>
              <li>Created SIEM dashboards and MITRE ATT&CK-mapped alerts</li>
              <li>Documented incident response findings aligned with SOC playbooks</li>
            </ul>
            <p className="text-sm">
              <span className="text-emerald-400">Tools:</span> Splunk, ELK Stack, Sysmon, Wazuh, Suricata
            </p>
          </div>

          {/* PROJECT 2 */}
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-7 hover:border-emerald-500 transition space-y-4">
            <h3 className="text-xl font-semibold text-white">
              🖥️ Active Directory Attack Detection & Hardening Lab
            </h3>
            <p className="text-sm text-gray-400">
              Enterprise identity attack detection and remediation.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Simulated Kerberoasting, pass-the-hash, and privilege escalation attacks</li>
              <li>Detected malicious behavior using Windows Security Event Logs and PowerShell</li>
              <li>Analyzed attack paths with BloodHound and assessed risks using PingCastle</li>
              <li>Implemented least-privilege and secure authentication controls</li>
            </ul>
            <p className="text-sm">
              <span className="text-emerald-400">Tools:</span> Active Directory, PowerShell, BloodHound, PingCastle
            </p>
          </div>

          {/* PROJECT 3 */}
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-7 hover:border-emerald-500 transition space-y-4">
            <h3 className="text-xl font-semibold text-white">
              🎣 OSINT-Based Financial Phishing Investigation
            </h3>
            <p className="text-sm text-gray-400">
              Threat intelligence analysis of financial phishing campaigns.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Investigated phishing infrastructure using OSINT techniques</li>
              <li>Analyzed domains, SSL certificates, and hosting patterns</li>
              <li>Clustered attacker campaigns based on shared indicators</li>
              <li>Produced executive-level threat intelligence reports</li>
            </ul>
            <p className="text-sm">
              <span className="text-emerald-400">Tools:</span> OSINT, WHOIS, SSL Analysis, VirusTotal
            </p>
          </div>

          {/* PROJECT 4 */}
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-7 hover:border-emerald-500 transition space-y-4">
            <h3 className="text-xl font-semibold text-white">
              🤖 Automated Financial Brand Abuse & Phishing Detection System
            </h3>
            <p className="text-sm text-gray-400">
              Automated detection of phishing and brand abuse domains using OSINT.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Built an automated system to detect suspicious financial phishing domains</li>
              <li>Enriched domains using registration, SSL, and keyword intelligence</li>
              <li>Implemented phishing risk scoring and validation</li>
              <li>Generated executive-ready threat intelligence reports</li>
            </ul>
            <p className="text-sm">
              <span className="text-emerald-400">Tools:</span> Python, OSINT, Domain Intelligence
            </p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="text-center py-16 text-gray-400">
        <a href="mailto:sankalpagirish27@email.com" className="hover:text-emerald-400">
          sankalpagirish27@email.com
        </a>
      </section>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,#1f2933_1px,transparent_0)] [background-size:36px_36px]" />
    </div>
  );
}

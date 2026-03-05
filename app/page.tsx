import { useState, useEffect, useRef } from "react";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const rnd = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About","Education","Certifications","Experience","Skills","Projects","SOC","MITRE","Contact"];

const ALERTS = [
  { id:"A001", sev:"CRITICAL", msg:"Lateral movement detected — 192.168.1.44", time:"00:12", tactic:"Lateral Movement" },
  { id:"A002", sev:"HIGH",     msg:"Brute-force login — admin@corp.local",       time:"00:09", tactic:"Credential Access" },
  { id:"A003", sev:"HIGH",     msg:"Kerberoasting attempt — SPN scan",           time:"00:07", tactic:"Credential Access" },
  { id:"A004", sev:"MEDIUM",   msg:"Outbound C2 beacon — port 4444",             time:"00:05", tactic:"Command & Control" },
  { id:"A005", sev:"MEDIUM",   msg:"LSASS memory dump — PID 3812",               time:"00:03", tactic:"Credential Dumping" },
  { id:"A006", sev:"LOW",      msg:"Unusual PowerShell execution — HR-PC-07",    time:"00:01", tactic:"Execution" },
  { id:"A007", sev:"INFO",     msg:"New user added to Domain Admins",            time:"00:00", tactic:"Privilege Escalation" },
];

const SEV_COLOR = {
  CRITICAL:"text-red-400 bg-red-900/30 border-red-700",
  HIGH:    "text-orange-400 bg-orange-900/30 border-orange-700",
  MEDIUM:  "text-yellow-400 bg-yellow-900/30 border-yellow-700",
  LOW:     "text-blue-400 bg-blue-900/30 border-blue-700",
  INFO:    "text-gray-400 bg-gray-800 border-gray-600",
};

const MITRE_TACTICS = [
  { tactic:"Reconnaissance",       id:"TA0043", techniques:["T1595 Active Scanning","T1592 Gather Host Info","T1589 Gather Identity Info"] },
  { tactic:"Initial Access",        id:"TA0001", techniques:["T1566 Phishing","T1190 Exploit Public App","T1133 External Remote Svcs"] },
  { tactic:"Execution",             id:"TA0002", techniques:["T1059 Command Interpreter","T1053 Scheduled Task","T1204 User Execution"] },
  { tactic:"Persistence",           id:"TA0003", techniques:["T1547 Boot Autostart","T1098 Account Manipulation","T1136 Create Account"] },
  { tactic:"Privilege Escalation",  id:"TA0004", techniques:["T1548 Abuse Elevation","T1134 Access Token Manip","T1068 Exploit for PrivEsc"] },
  { tactic:"Defense Evasion",       id:"TA0005", techniques:["T1070 Indicator Removal","T1036 Masquerading","T1027 Obfuscated Files"] },
  { tactic:"Credential Access",     id:"TA0006", techniques:["T1003 OS Credential Dump","T1558 Kerberoasting","T1110 Brute Force"] },
  { tactic:"Discovery",             id:"TA0007", techniques:["T1082 System Info Disc","T1083 File & Dir Disc","T1018 Remote Sys Disc"] },
  { tactic:"Lateral Movement",      id:"TA0008", techniques:["T1021 Remote Services","T1550 Use Alt Auth","T1080 Taint Shared Content"] },
  { tactic:"Collection",            id:"TA0009", techniques:["T1005 Data from Local Sys","T1056 Input Capture","T1113 Screen Capture"] },
  { tactic:"Command & Control",     id:"TA0011", techniques:["T1071 App Layer Protocol","T1095 Non-App Layer","T1572 Protocol Tunneling"] },
  { tactic:"Exfiltration",          id:"TA0010", techniques:["T1041 Exfil over C2","T1048 Exfil Alt Protocol","T1011 Exfil over BT"] },
];

const JOKES = [
  "Why did the hacker break up with the firewall? It kept blocking their connection. 🔥",
  "How does a SOC analyst keep their room secure? With a firewall and a bouncer. 🚪",
  "Why don't cybersecurity pros sunbathe? They don't want to get burned by a zero-day. ☀️",
  "I told my mom I work in cybersecurity. She asked if I could fix her printer. 🖨️",
  "A SQL injection walks into a bar. DROP TABLE drinks; -- 🍺",
  "Why did the packet get lost? It took the wrong route. 📦",
  "My password is '14characters' — wait, I just told you. 😅",
];

const QUIZ = [
  { q:"What does SIEM stand for?", opts:["Security Incident & Event Management","Security Information & Event Management","System Integrity & Event Monitor","Secure Intel & Event Module"], ans:1 },
  { q:"Which MITRE ATT&CK tactic involves stealing hashed credentials?", opts:["Defense Evasion","Lateral Movement","Credential Access","Exfiltration"], ans:2 },
  { q:"Port 443 is typically used for?", opts:["FTP","HTTP","HTTPS","SSH"], ans:2 },
  { q:"What tool is used to enumerate Active Directory attack paths?", opts:["Nmap","BloodHound","Wireshark","Metasploit"], ans:1 },
  { q:"T1566 in MITRE ATT&CK refers to?", opts:["Kerberoasting","Phishing","Privilege Escalation","Port Scanning"], ans:1 },
];

const CYBER_NODES = [
  { x:15, y:20, label:"Chicago" }, { x:30, y:35, label:"NYC" }, { x:55, y:30, label:"London" },
  { x:60, y:45, label:"Berlin" }, { x:75, y:35, label:"Moscow" }, { x:80, y:55, label:"Delhi" },
  { x:85, y:40, label:"Beijing" }, { x:90, y:65, label:"Singapore" }, { x:20, y:60, label:"São Paulo" },
  { x:50, y:70, label:"Lagos" }, { x:65, y:75, label:"Nairobi" }, { x:10, y:40, label:"Toronto" },
];

const ATTACK_PAIRS = [
  [6,0],[4,1],[5,2],[6,3],[7,2],[8,0],[9,3],[10,4],[11,5],
];

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ── Cyber Grid Background ─────────────────────────────────────────────────────
function CyberGrid() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth="1"/>
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.08)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="#0a0f14"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <rect width="100%" height="100%" fill="url(#glow)"/>
      </svg>
      <ScanLine/>
    </div>
  );
}

function ScanLine() {
  const [y, setY] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=> setY(p=>(p+0.3)%100), 30);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ top:`${y}%`, background:"linear-gradient(90deg,transparent,rgba(16,185,129,0.3),transparent)", boxShadow:"0 0 20px rgba(16,185,129,0.2)" }}/>
  );
}

// ── Terminal Typewriter ───────────────────────────────────────────────────────
function Terminal({ lines }) {
  const [shown, setShown] = useState([]);
  const [cursor, setCursor] = useState(true);
  useEffect(()=>{
    let i = 0;
    const id = setInterval(()=>{
      if(i < lines.length){ setShown(p=>[...p, lines[i++]]); }
      else clearInterval(id);
    }, 600);
    return ()=>clearInterval(id);
  },[]);
  useEffect(()=>{
    const id = setInterval(()=> setCursor(p=>!p), 500);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="bg-black/80 border border-emerald-500/40 rounded-xl p-5 font-mono text-sm text-emerald-400 shadow-lg shadow-emerald-900/20 w-full max-w-xl mx-auto">
      <div className="flex gap-2 mb-3">
        <span className="w-3 h-3 rounded-full bg-red-500"/>
        <span className="w-3 h-3 rounded-full bg-yellow-500"/>
        <span className="w-3 h-3 rounded-full bg-green-500"/>
        <span className="ml-2 text-gray-500 text-xs">sankalpa@soc-terminal:~$</span>
      </div>
      {shown.map((l,i)=>(
        <div key={i} className="leading-7">
          <span className="text-gray-500">$ </span>
          <span>{l}</span>
        </div>
      ))}
      <div className="leading-7">
        <span className="text-gray-500">$ </span>
        {cursor && <span className="animate-pulse">▌</span>}
      </div>
    </div>
  );
}

// ── SOC Alert Dashboard ───────────────────────────────────────────────────────
function SOCDashboard() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [count, setCount] = useState({ CRITICAL:1, HIGH:2, MEDIUM:2, LOW:1, INFO:1 });
  const [log, setLog] = useState(["[00:14] System boot — threat detection active","[00:13] SIEM connected — ingesting 4,200 EPS","[00:12] Ruleset v2.4.1 loaded — 847 active rules"]);

  useEffect(()=>{
    const newAlerts = [
      "Port scan from 10.0.0.99","DNS tunneling detected","Suspicious registry write — HKCU\\Run","Failed RDP — 10.0.2.15","Unusual LDAP query volume","Base64 PowerShell payload","WMI lateral movement","Outbound ICMP to 8.8.8.8"
    ];
    const newTactics = ["Reconnaissance","Execution","Persistence","Lateral Movement","Exfiltration","Command & Control","Defense Evasion"];
    const sevs = ["CRITICAL","HIGH","HIGH","MEDIUM","MEDIUM","LOW","INFO"];
    const id = setInterval(()=>{
      const sev = pick(sevs);
      const newA = { id:`A${String(Math.floor(rnd(100,999)))}.`, sev, msg:pick(newAlerts), time:"LIVE", tactic:pick(newTactics) };
      setAlerts(p=>[newA,...p.slice(0,9)]);
      setCount(p=>({...p,[sev]:p[sev]+1}));
      setLog(p=>[`[LIVE] ${newA.tactic} — ${newA.msg}`,...p.slice(0,12)]);
    }, 4000);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div className="space-y-6">
      {/* Stat bar */}
      <div className="grid grid-cols-5 gap-3">
        {[["CRITICAL",count.CRITICAL,"red"],["HIGH",count.HIGH,"orange"],["MEDIUM",count.MEDIUM,"yellow"],["LOW",count.LOW,"blue"],["INFO",count.INFO,"gray"]].map(([s,c,col])=>(
          <div key={s} className={`rounded-xl border p-4 text-center bg-${col}-900/20 border-${col}-700`}>
            <div className={`text-2xl font-bold text-${col}-400`}>{c}</div>
            <div className={`text-xs text-${col}-500 mt-1`}>{s}</div>
          </div>
        ))}
      </div>

      {/* Alert feed + Event log */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Live Alert Feed</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {alerts.map((a,i)=>(
              <div key={i} className={`flex items-start gap-3 p-2 rounded-lg border text-xs font-mono ${SEV_COLOR[a.sev]}`}>
                <span className="shrink-0 px-1.5 py-0.5 rounded font-bold text-[10px]">{a.sev}</span>
                <span className="flex-1">{a.msg}</span>
                <span className="shrink-0 opacity-60">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Event Log</span>
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto font-mono text-xs text-emerald-300/80">
            {log.map((l,i)=>(
              <div key={i} className="leading-6 border-b border-emerald-900/40 pb-1">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Global Cyber Attack Map ───────────────────────────────────────────────────
function CyberMap() {
  const [beams, setBeams] = useState([]);
  useEffect(()=>{
    const fire = ()=>{
      const pair = pick(ATTACK_PAIRS);
      const src = CYBER_NODES[pair[0]], dst = CYBER_NODES[pair[1]];
      const id = Date.now()+Math.random();
      setBeams(p=>[...p,{id,src,dst}]);
      setTimeout(()=> setBeams(p=>p.filter(b=>b.id!==id)), 2000);
    };
    fire();
    const interval = setInterval(fire, 1200);
    return ()=>clearInterval(interval);
  },[]);

  return (
    <div className="relative bg-black/60 border border-emerald-500/30 rounded-2xl overflow-hidden" style={{paddingBottom:"50%"}}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 55" preserveAspectRatio="none">
        {/* Simple world outline approximation */}
        <rect width="100" height="55" fill="transparent"/>
        {/* Continents simplified */}
        <ellipse cx="22" cy="32" rx="12" ry="9" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.3"/>
        <ellipse cx="55" cy="30" rx="18" ry="12" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.3"/>
        <ellipse cx="83" cy="42" rx="10" ry="8" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.3"/>
        <ellipse cx="55" cy="58" rx="8" ry="5" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.3"/>

        {/* Attack beams */}
        {beams.map(b=>(
          <g key={b.id}>
            <line x1={b.src.x} y1={b.src.y} x2={b.dst.x} y2={b.dst.y}
              stroke="rgba(239,68,68,0.7)" strokeWidth="0.4" strokeDasharray="2 1">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s"/>
            </line>
            <circle cx={b.src.x} cy={b.src.y} r="0.8" fill="#ef4444">
              <animate attributeName="opacity" from="1" to="0" dur="2s"/>
            </circle>
            <circle cx={b.dst.x} cy={b.dst.y} r="1.2" fill="none" stroke="#ef4444" strokeWidth="0.4">
              <animate attributeName="r" from="0" to="3" dur="2s"/>
              <animate attributeName="opacity" from="1" to="0" dur="2s"/>
            </circle>
          </g>
        ))}

        {/* City nodes */}
        {CYBER_NODES.map((n,i)=>(
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="0.9" fill="rgba(16,185,129,0.8)">
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${rnd(2,4).toFixed(1)}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx={n.x} cy={n.y} r="2" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="0.3">
              <animate attributeName="r" values="1;3;1" dur={`${rnd(3,5).toFixed(1)}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0;0.8" dur={`${rnd(3,5).toFixed(1)}s`} repeatCount="indefinite"/>
            </circle>
            <text x={n.x+1.5} y={n.y+0.8} fontSize="2" fill="rgba(16,185,129,0.6)" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-3 left-4 flex gap-4 text-xs font-mono">
        <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/> Node</span>
        <span className="text-red-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/> Attack</span>
      </div>
      <div className="absolute top-3 right-4 text-xs font-mono text-emerald-400 animate-pulse">⬤ LIVE</div>
    </div>
  );
}

// ── MITRE ATT&CK Matrix ───────────────────────────────────────────────────────
function MitreMatrix() {
  const [hovered, setHovered] = useState(null);
  const active = new Set(["T1566 Phishing","T1003 OS Credential Dump","T1558 Kerberoasting","T1021 Remote Services","T1059 Command Interpreter","T1082 System Info Disc"]);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-2 min-w-max">
        {MITRE_TACTICS.map(col=>(
          <div key={col.id} className="w-36">
            <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-t-lg px-2 py-2 text-center">
              <div className="text-[10px] text-emerald-300 font-mono">{col.id}</div>
              <div className="text-xs font-bold text-emerald-400 leading-tight mt-0.5">{col.tactic}</div>
            </div>
            <div className="space-y-1 mt-1">
              {col.techniques.map((t,i)=>{
                const isActive = active.has(t);
                return (
                  <div key={i}
                    onMouseEnter={()=>setHovered(t)}
                    onMouseLeave={()=>setHovered(null)}
                    className={`px-2 py-1.5 rounded text-[11px] font-mono cursor-pointer transition-all duration-200 border
                      ${isActive
                        ? "bg-red-900/50 border-red-500/60 text-red-300 shadow-sm shadow-red-900/30"
                        : "bg-[#161b22] border-gray-700 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-300"}
                      ${hovered===t ? "scale-105" : ""}
                    `}>
                    {t}
                    {isActive && <span className="block text-[9px] text-red-400 mt-0.5">⚠ Detected</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-4 text-xs font-mono">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-900/50 border border-red-500/60 inline-block"/> Detected in your env</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#161b22] border border-gray-700 inline-block"/> Not observed</span>
      </div>
    </div>
  );
}

// ── Cyber Quiz ────────────────────────────────────────────────────────────────
function CyberQuiz() {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[qi];
  const submit = (i) => {
    if(selected !== null) return;
    setSelected(i);
    if(i === q.ans) setScore(s=>s+1);
    setTimeout(()=>{
      if(qi+1 < QUIZ.length){ setQi(qi+1); setSelected(null); }
      else setDone(true);
    }, 1200);
  };

  const reset = () => { setQi(0); setSelected(null); setScore(0); setDone(false); };

  if(done) return (
    <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
      <div className="text-4xl">🏆</div>
      <div className="text-2xl font-bold text-emerald-400">{score}/{QUIZ.length} Correct</div>
      <div className="text-gray-400 font-mono text-sm">
        {score===QUIZ.length ? "Perfect score — you belong in the SOC." : score >= 3 ? "Solid analyst instincts." : "Keep training on TryHackMe! 💪"}
      </div>
      <button onClick={reset} className="mt-4 px-6 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 font-mono text-sm transition">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-6 space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-emerald-500">QUESTION {qi+1}/{QUIZ.length}</span>
        <span className="text-xs font-mono text-gray-500">Score: {score}</span>
      </div>
      <div className="text-white font-semibold text-lg leading-snug">{q.q}</div>
      <div className="space-y-2">
        {q.opts.map((opt,i)=>{
          let cls = "border-gray-700 text-gray-300 hover:border-emerald-500/60";
          if(selected !== null){
            if(i === q.ans) cls = "border-emerald-500 bg-emerald-900/30 text-emerald-300";
            else if(i === selected && selected !== q.ans) cls = "border-red-500 bg-red-900/30 text-red-300";
            else cls = "border-gray-800 text-gray-600";
          }
          return (
            <button key={i} onClick={()=>submit(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-sm transition-all ${cls}`}>
              <span className="text-gray-500 mr-2">{String.fromCharCode(65+i)}.</span>{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Joke Ticker ───────────────────────────────────────────────────────────────
function JokeTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=> setIdx(i=>(i+1)%JOKES.length), 6000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="bg-black/40 border border-emerald-900/50 rounded-xl px-5 py-3 flex items-center gap-3 font-mono text-sm text-emerald-300/80">
      <span className="text-emerald-500 shrink-0">// joke.exe</span>
      <span className="transition-all duration-500">{JOKES[idx]}</span>
    </div>
  );
}

// ── Glowing Badge ─────────────────────────────────────────────────────────────
function GlowBadge({ text, color="emerald" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border
      bg-${color}-900/30 border-${color}-500/50 text-${color}-400`}
      style={{boxShadow:`0 0 8px rgba(16,185,129,0.2)`}}>
      <span className={`w-1.5 h-1.5 rounded-full bg-${color}-400 animate-pulse`}/>
      {text}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(()=>{
    const handler = ()=>{
      const sections = NAV_LINKS.map(n=>document.getElementById(n.toLowerCase()));
      const scrollY = window.scrollY + 200;
      for(let i=sections.length-1;i>=0;i--){
        if(sections[i] && sections[i].offsetTop <= scrollY){
          setActiveNav(NAV_LINKS[i].toLowerCase()); break;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return ()=>window.removeEventListener("scroll", handler);
  },[]);

  const CERTS = [
    { name:"CompTIA Security+", year:"2025–2028", status:"Completed" },
    { name:"ISC² CC",           year:"2025–2028", status:"Completed" },
    { name:"AWS Cloud Practitioner", year:"2025–2028", status:"Completed" },
    { name:"CompTIA CySA+",     year:"2026",      status:"In Progress" },
  ];

  const SKILLS_DATA = [
    { title:"🔐 Compliance & Frameworks", items:["CIS Critical Security Controls","NIST CSF","OWASP Top 10","Security policy documentation"] },
    { title:"🧑‍💻 Endpoint & Identity", items:["Windows Endpoint Security","Active Directory","RBAC & IAM","Sysinternals / Sysmon","Wazuh"] },
    { title:"📊 SIEM & Log Analysis", items:["Splunk","ELK Stack","Windows Event Logs","Linux Auth Logs"] },
    { title:"🌐 Network & Traffic", items:["TCP/IP","Wireshark","Zeek","Brim","Nmap","TShark","tcpdump"] },
    { title:"🛡️ Threat Detection", items:["Phishing Analysis","IDS/IPS","Snort","Suricata","Email Threat Intel"] },
    { title:"🔍 DFIR", items:["Autopsy","Redline","KAPE","Volatility","Velociraptor","TheHive"] },
    { title:"⚙️ Scripting", items:["Python","Bash","PowerShell","SQL"] },
    { title:"🖥️ OS & Virtualization", items:["Windows","Linux (Ubuntu, Kali)","VMware","VirtualBox"] },
  ];

  const EXPERIENCE = [
    {
      title:"Application Security Engineer",
      org:"Auditech Innovation Pvt. Ltd.",
      date:"Sep 2024 – Jun 2025",
      badge:"AppSec",
      items:["Secured backend services for 100+ users with RBAC & least-privilege, reducing unauthorized access by 40%.","Mitigated SQL injection via input validation, parameterized queries, and strict access controls.","Applied OWASP secure-coding practices to harden application security posture.","Analyzed system logs to detect anomalies, cutting incident response time by 30%."],
    },
    {
      title:"IT Security Intern",
      org:"Auditech Innovation Pvt. Ltd.",
      date:"Feb 2024 – Apr 2024",
      badge:"IT Security",
      items:["Resolved 50+ IT incidents via ticket-based support covering access issues and network problems.","Managed IAM in Active Directory: user accounts, password resets, and group memberships.","Configured Group Policy Objects and supported patch management to reduce vulnerability exposure."],
    },
    {
      title:"Hands-On Labs",
      org:"TryHackMe",
      date:"Present",
      badge:"SOC Training",
      items:["Completed 132+ hands-on cybersecurity labs.","Ranked in the top 2% globally.","Practiced SOC operations and MITRE ATT&CK techniques."],
    },
    {
      title:"IoT Intern",
      org:"Cadmaxx EdTech",
      date:"Sep 2022 – Oct 2022",
      badge:"IoT",
      items:["Configured IoT sensor communication and validated data flows.","Performed data integrity checks on sensor outputs.","Assessed IoT security risks: unsecured endpoints, data tampering, distributed vulnerabilities."],
    },
    {
      title:"Health Data Assistant",
      org:"District Health Office (DHO)",
      date:"May 2023 – Jun 2023",
      badge:"Gov",
      items:["Generated Ayushman Bharat Health Accounts (ABHA).","Performed NCD data entry and handled sensitive health information responsibly."],
    },
    {
      title:"Volunteer Educator",
      org:"School Enrichment Program",
      date:"Sep 2023 – Oct 2023",
      badge:"Outreach",
      items:["Taught Mathematics, English, and basic computer skills to school students.","Promoted cyber safety: safe browsing habits and digital awareness."],
    },
  ];

  const PROJECTS = [
    { emoji:"🔐", title:"SOC Detection & IR Lab", desc:"End-to-end SOC monitoring using endpoint and network telemetry.", tools:"Splunk · ELK · Sysmon · Wazuh · Suricata", items:["Built SOC lab with Sysmon, Wazuh, Suricata, ELK/Splunk","Correlated logs to detect brute-force, malware, and recon","Created MITRE ATT&CK-mapped SIEM dashboards","Documented IR findings aligned with SOC playbooks"] },
    { emoji:"🖥️", title:"Active Directory Attack Detection", desc:"Enterprise identity attack detection and remediation.", tools:"AD · PowerShell · BloodHound · PingCastle", items:["Simulated Kerberoasting, pass-the-hash, privesc","Detected attacks via Windows Security Event Logs","Analyzed paths with BloodHound, assessed risks with PingCastle","Implemented least-privilege and secure auth controls"] },
    { emoji:"🎣", title:"OSINT Financial Phishing Investigation", desc:"Threat intel analysis of financial phishing campaigns.", tools:"OSINT · WHOIS · SSL Analysis · VirusTotal", items:["Investigated phishing infrastructure via OSINT","Analyzed domains, SSL certs, and hosting patterns","Clustered attacker campaigns by shared IOCs","Produced executive-level threat intelligence reports"] },
    { emoji:"🤖", title:"Automated Brand Abuse Detection", desc:"Automated phishing & brand abuse domain detection.", tools:"Python · OSINT · Domain Intelligence", items:["Built automated system to detect suspicious financial domains","Enriched domains with registration, SSL, keyword intel","Implemented phishing risk scoring and validation","Generated executive-ready threat intelligence reports"] },
    { emoji:"🌐", title:"Web Application Security Assessment", desc:"Comprehensive web app security testing — OWASP Top 10.", tools:"OWASP ZAP · Burp Suite · Secure Coding", items:["Conducted dynamic and manual testing","Identified and validated OWASP Top 10 vulnerabilities","Documented severity, impact, remediation","Remediated via input validation, parameterized queries, RBAC"] },
    { emoji:"🛠️", title:"Secure SDLC with SAST & SCA", desc:"Integrated security testing into CI/CD workflows.", tools:"SAST · SCA · CI/CD · OWASP", items:["Integrated SAST and SCA tools into CI pipelines","Mapped findings to OWASP Top 10, reduced false positives","Prioritized vulnerabilities by risk and business impact","Documented SSDLC processes and secure coding standards"] },
  ];

  return (
    <div className="min-h-screen text-gray-200 relative" style={{fontFamily:"'JetBrains Mono', 'Fira Code', monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#0a0f14; } ::-webkit-scrollbar-thumb { background:#1f4037; border-radius:3px; }
        .glow-text { text-shadow: 0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2); }
        .glow-border { box-shadow: 0 0 20px rgba(16,185,129,0.1); }
        .orbitron { font-family:'Orbitron',sans-serif; }
      `}</style>

      <CyberGrid/>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="orbitron font-black text-emerald-400 text-lg tracking-widest glow-text">SG<span className="text-gray-600">_</span><span className="text-xs text-emerald-600 font-mono normal-case">SOC.analyst</span></div>
          <div className="hidden md:flex gap-5 text-xs">
            {NAV_LINKS.map(l=>(
              <a key={l} href={`#${l.toLowerCase()}`}
                className={`transition-all hover:text-emerald-400 ${activeNav===l.toLowerCase()?"text-emerald-400 glow-text":"text-gray-400"}`}>
                {l}
              </a>
            ))}
          </div>
          <button className="md:hidden text-emerald-400" onClick={()=>setMobileMenu(m=>!m)}>☰</button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-black/90 px-6 py-4 flex flex-col gap-3 text-sm">
            {NAV_LINKS.map(l=>(
              <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMobileMenu(false)} className="text-gray-300 hover:text-emerald-400">{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-emerald-500/10 animate-ping" style={{animationDuration:"4s"}}/>
          <div className="absolute w-64 h-64 rounded-full border border-emerald-500/10 animate-ping" style={{animationDuration:"3s"}}/>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-xs font-mono text-emerald-600 tracking-[0.3em] uppercase mb-4">// Initializing Threat Analyst Profile</div>
          
          <h1 className="orbitron text-5xl md:text-7xl font-black text-white glow-text">
            Sankalpa<br/><span className="text-emerald-400">Girish</span>
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <GlowBadge text="Defensive Security"/>
            <GlowBadge text="SOC Analyst"/>
            <GlowBadge text="Incident Response"/>
            <GlowBadge text="MITRE ATT&CK"/>
          </div>

          <div className="mt-8 max-w-lg mx-auto">
            <Terminal lines={[
              "whoami → sankalpa.girish",
              "cat certifications.txt → Security+, CC, AWS-CP",
              "nmap -sV localhost → Threat detector: ONLINE",
              "tail -f /var/log/siem.log → Monitoring active...",
            ]}/>
          </div>

          <JokeTicker/>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="About Me" sub="// Personal Profile"/>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-6 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-lg">✉</div>
                <a href="mailto:sankalpagirish27@email.com" className="hover:text-emerald-400 text-sm">sankalpagirish27@email.com</a>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">📞</div>
                <a href="tel:+17732420770" className="hover:text-emerald-400 text-sm">+1-773-242-0770</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">in</div>
                <a href="https://www.linkedin.com/in/sankalpa-girish/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 text-sm">linkedin.com/in/sankalpa-girish</a>
              </div>
            </div>

            <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-5 glow-border">
              <div className="text-xs text-emerald-500 mb-3 font-mono">// TryHackMe Stats</div>
              <div className="grid grid-cols-2 gap-4">
                <StatBox label="Labs Completed" value="132+" color="emerald"/>
                <StatBox label="Global Rank" value="Top 2%" color="emerald"/>
                <StatBox label="Current Streak" value="Active" color="yellow"/>
                <StatBox label="Specialty" value="Blue Team" color="blue"/>
              </div>
            </div>
          </div>

          <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-8 space-y-5 text-sm leading-relaxed glow-border">
            <div className="text-emerald-500 font-mono text-xs mb-2">// bio.txt</div>
            <p className="text-gray-300">Graduate student at DePaul University pursuing an MS in Cybersecurity (concentration: Computer Security). Maintaining a 4.0 GPA while building deep expertise in security operations, threat detection, incident response, and digital forensics.</p>
            <p className="text-gray-300">Actively building toward a Blue Team career — with particular focus on log analysis, SIEM-based monitoring, and understanding real-world attack patterns via lab-based investigations.</p>
            <p className="text-gray-300">Off-duty, I enjoy crime thrillers by Freida McFadden, analytical shows like <em className="text-emerald-300">The Mentalist</em> and <em className="text-emerald-300">Person of Interest</em>, and fiction by Ankur Warikoo. Essentially — I enjoy puzzles, patterns, and unexpected plot twists. Very on-brand for a SOC analyst. 🕵️</p>
            <div className="pt-3 border-t border-emerald-900/50">
              <div className="text-xs text-emerald-600 font-mono">// always open to connect — cybersecurity, books, or crime series 👋</div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="Education" sub="// Academic Credentials"/>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { degree:"MS Cybersecurity", school:"DePaul University", detail:"GPA: 4.0 / 4.0", year:"Expected June 2027", icon:"🎓" },
            { degree:"B.Tech Information Science", school:"P.E.S College of Engineering", detail:"CGPA: 8.52 / 10", year:"Graduated July 2024", icon:"🏛️" },
          ].map((e,i)=>(
            <Card key={i}>
              <div className="text-3xl mb-3">{e.icon}</div>
              <div className="text-xs text-emerald-500 font-mono mb-1">{e.year}</div>
              <h3 className="text-white font-bold text-lg">{e.degree}</h3>
              <p className="text-gray-400 text-sm">{e.school}</p>
              <p className="text-emerald-400 text-sm font-mono mt-2">{e.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="Certifications" sub="// Validated Expertise"/>
        <div className="grid md:grid-cols-2 gap-8">
          {CERTS.map((c,i)=>(
            <Card key={i}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold">{c.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{c.year}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-mono ${c.status==="Completed"?"bg-emerald-900/40 text-emerald-400 border border-emerald-500/50":"bg-yellow-900/40 text-yellow-400 border border-yellow-500/50"}`}>
                  {c.status==="Completed"?"✅ Certified":"🔄 In Progress"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="Experience" sub="// Professional History"/>
        <div className="grid md:grid-cols-2 gap-8">
          {EXPERIENCE.map((exp,i)=>(
            <Card key={i}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-white font-bold text-sm leading-snug">{exp.title}</h3>
                  <p className="text-emerald-400 text-xs font-mono">{exp.org}</p>
                </div>
                <span className="shrink-0 text-xs px-2 py-0.5 rounded border border-emerald-700 text-emerald-500 font-mono">{exp.badge}</span>
              </div>
              <p className="text-xs text-gray-600 font-mono mb-3">{exp.date}</p>
              <div className="space-y-1.5">
                {exp.items.map((item,j)=>(
                  <p key={j} className="text-xs text-gray-400 pl-3 relative leading-relaxed">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-emerald-500/60"/>
                    {item}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="Technical Skills" sub="// Toolkit & Arsenal"/>
        <div className="grid md:grid-cols-2 gap-8">
          {SKILLS_DATA.map((s,i)=>(
            <Card key={i}>
              <h3 className="font-bold text-white mb-3 text-sm">{s.title}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item,j)=>(
                  <span key={j} className="text-xs px-2 py-1 rounded border border-emerald-900/60 bg-emerald-950/30 text-emerald-300 font-mono">{item}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="Projects" sub="// Lab & Research Work"/>
        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((p,i)=>(
            <Card key={i}>
              <div className="text-2xl mb-2">{p.emoji}</div>
              <h3 className="text-white font-bold mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{p.desc}</p>
              <ul className="space-y-1 mb-4">
                {p.items.map((item,j)=>(
                  <li key={j} className="text-xs text-gray-400 pl-3 relative leading-relaxed">
                    <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-emerald-500"/>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-3 border-t border-emerald-900/40">
                <span className="text-emerald-500 text-xs font-mono">// </span>
                <span className="text-xs text-gray-400 font-mono">{p.tools}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SOC DASHBOARD */}
      <section id="soc" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="SOC Alert Dashboard" sub="// Live Threat Monitoring Simulation"/>
        <SOCDashboard/>
        <div className="mt-12">
          <div className="text-xs font-mono text-emerald-600 mb-4">// Global Cyber Attack Map — Real-time Simulation</div>
          <CyberMap/>
        </div>
      </section>

      {/* MITRE */}
      <section id="mitre" className="max-w-6xl mx-auto px-6 py-24">
        <SectionHeader title="MITRE ATT&CK Matrix" sub="// Techniques Studied & Detected"/>
        <MitreMatrix/>

        {/* QUIZ */}
        <div className="mt-16">
          <SectionHeader title="Cyber Knowledge Quiz" sub="// Test Your SOC Instincts"/>
          <div className="max-w-2xl mx-auto">
            <CyberQuiz/>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 text-center">
        <SectionHeader title="Contact" sub="// Open Channel"/>
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-gray-400 text-sm">Always open to connect — cybersecurity discussions, opportunities, or shared interests in crime thrillers.</p>
          <a href="mailto:sankalpagirish27@email.com"
            className="block px-8 py-4 rounded-xl border border-emerald-500 text-emerald-400 font-mono hover:bg-emerald-500/10 transition glow-border">
            sankalpagirish27@email.com
          </a>
          <a href="https://www.linkedin.com/in/sankalpa-girish/" target="_blank" rel="noopener noreferrer"
            className="block px-8 py-4 rounded-xl border border-gray-700 text-gray-400 font-mono hover:border-emerald-500/50 hover:text-emerald-400 transition">
            LinkedIn →
          </a>
        </div>
        <div className="mt-16 text-xs font-mono text-emerald-900">
          // sankalpa.girish — securing systems, one log at a time
        </div>
      </section>
    </div>
  );
}

// ── Shared UI ──────────────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div className="text-center mb-14">
      <div className="text-xs font-mono text-emerald-600 mb-2 tracking-widest">{sub}</div>
      <h2 className="orbitron text-3xl md:text-4xl font-black text-white glow-text">{title}</h2>
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500"/>
        <div className="w-2 h-2 rounded-full bg-emerald-500"/>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500"/>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-black/60 border border-emerald-900/50 rounded-2xl p-6 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 flex flex-col">
      {children}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className={`bg-${color}-900/20 border border-${color}-800/50 rounded-xl p-3 text-center`}>
      <div className={`text-lg font-bold text-${color}-400 orbitron`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   COLOR TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  press: "#f59e0b", cover: "#a78bfa", aux: "#22d3ee",
  cb: "#60a5fa",    mid:  "#34d399", cf: "#fb923c",
  gk: "#fde68a",    atk:  "#f87171", ball: "#fff",
  bg: "#05080a",    surf: "#0c1014", border: "#1a2535",
};

/* ═══════════════════════════════════════════════════════════
   STAGE META
═══════════════════════════════════════════════════════════ */
const STAGES = [
  { id:0, tag:"Stage 1", title:"Hold Shape",       sub:"Ball in Opponent's Half", col:"#22c55e",
    desc:"Sit in a compact block. Don't chase. Conserve energy. Wait for the press trigger." },
  { id:1, tag:"Stage 2", title:"Compress & Press", sub:"Ball Enters Defending Half", col:"#f59e0b",
    desc:"Activate your roles. Drop as a unit. Press/Pressure fires on the ball carrier." },
  { id:2, tag:"Stage 3", title:"Lock the Box",     sub:"Ball Near Penalty Area", col:"#ef4444",
    desc:"Pack the box. Block runners. Cut the cutback lane. Hold your feet." },
];

/* ═══════════════════════════════════════════════════════════
   FORMATION META
═══════════════════════════════════════════════════════════ */
const FM = {
  u14_331: { name:"U14 Boys",  fmt:"8v8  ·  3-3-1", col:"#3b82f6", acc:"#93c5fd",
    note:"3 flat CBs · 3 mids (L/C/R) · 1 CF" },
  u17_231: { name:"U17 Co-Ed", fmt:"7v7  ·  2-3-1", col:"#f97316", acc:"#fdba74",
    note:"2 CBs + Holding Mid screen · 2 wide mids · 1 CF" },
  u17_321: { name:"U17 Co-Ed", fmt:"7v7  ·  3-2-1", col:"#a855f7", acc:"#d8b4fe",
    note:"3 flat CBs · 2 central mids · 1 CF" },
};

/* ═══════════════════════════════════════════════════════════
   PITCH POSITIONS
   SVG viewBox 0 0 100 138
   Halfway y=16  |  PenBox x=18 y=90 w=64 h=38  |  Goal x=40 y=128 w=20 h=5
═══════════════════════════════════════════════════════════ */
const POS = {
  u14_331: [
    { def:[
        {id:"lcb",x:22,y:80,r:"cb",  n:"CB"},
        {id:"ccb",x:50,y:77,r:"cb",  n:"CB"},
        {id:"rcb",x:78,y:80,r:"cb",  n:"CB"},
        {id:"lm", x:18,y:59,r:"mid", n:"LM"},
        {id:"cm", x:50,y:56,r:"mid", n:"CM"},
        {id:"rm", x:82,y:59,r:"mid", n:"RM"},
        {id:"cf", x:50,y:24,r:"cf",  n:"CF"},
      ],
      atk:[{x:44,y:10,n:"9"},{x:68,y:7,n:"10"},{x:26,y:9,n:"7",b:1}],
      ball:{x:26,y:9},
    },
    { def:[
        {id:"lcb",x:22,y:87,r:"press",n:"CB"},
        {id:"ccb",x:50,y:89,r:"cover",n:"CB"},
        {id:"rcb",x:78,y:87,r:"aux",  n:"CB"},
        {id:"lm", x:18,y:69,r:"mid",  n:"LM"},
        {id:"cm", x:50,y:66,r:"mid",  n:"CM"},
        {id:"rm", x:80,y:69,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:39,r:"cf",   n:"CF"},
      ],
      atk:[{x:10,y:54,n:"7",b:1},{x:36,y:51,n:"9"},{x:62,y:47,n:"10"}],
      ball:{x:10,y:54},
    },
    { def:[
        {id:"lcb",x:26,y:96,r:"press",n:"CB"},
        {id:"ccb",x:50,y:97,r:"cover",n:"CB"},
        {id:"rcb",x:74,y:96,r:"aux",  n:"CB"},
        {id:"lm", x:20,y:83,r:"mid",  n:"LM"},
        {id:"cm", x:48,y:82,r:"mid",  n:"CM"},
        {id:"rm", x:76,y:83,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:62,r:"cf",   n:"CF"},
      ],
      atk:[{x:9,y:87,n:"7",b:1},{x:36,y:91,n:"9"},{x:60,y:85,n:"10"}],
      ball:{x:9,y:87},
    },
  ],
  u17_231: [
    { def:[
        {id:"lcb",x:30,y:80,r:"cb",  n:"CB"},
        {id:"rcb",x:70,y:80,r:"cb",  n:"CB"},
        {id:"dm", x:50,y:68,r:"mid", n:"DM", dm:1},
        {id:"lm", x:16,y:57,r:"mid", n:"LM"},
        {id:"rm", x:84,y:57,r:"mid", n:"RM"},
        {id:"cf", x:50,y:24,r:"cf",  n:"CF"},
      ],
      atk:[{x:44,y:10,n:"9"},{x:68,y:7,n:"10"},{x:24,y:9,n:"7",b:1}],
      ball:{x:24,y:9},
    },
    { def:[
        {id:"lcb",x:22,y:87,r:"press",n:"CB"},
        {id:"dm", x:50,y:88,r:"cover",n:"DM", dm:1, drop:1},
        {id:"rcb",x:78,y:87,r:"aux",  n:"CB"},
        {id:"lm", x:14,y:69,r:"mid",  n:"LM"},
        {id:"rm", x:86,y:69,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:39,r:"cf",   n:"CF"},
      ],
      atk:[{x:10,y:54,n:"7",b:1},{x:35,y:51,n:"9"},{x:62,y:47,n:"10"}],
      ball:{x:10,y:54},
    },
    { def:[
        {id:"lcb",x:25,y:97,r:"press",n:"CB"},
        {id:"dm", x:50,y:98,r:"cover",n:"DM", dm:1, drop:1},
        {id:"rcb",x:75,y:97,r:"aux",  n:"CB"},
        {id:"lm", x:18,y:84,r:"mid",  n:"LM"},
        {id:"rm", x:82,y:84,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:62,r:"cf",   n:"CF"},
      ],
      atk:[{x:8,y:88,n:"7",b:1},{x:38,y:91,n:"9"},{x:62,y:86,n:"10"}],
      ball:{x:8,y:88},
    },
  ],
  u17_321: [
    { def:[
        {id:"lcb",x:22,y:80,r:"cb",  n:"CB"},
        {id:"ccb",x:50,y:77,r:"cb",  n:"CB"},
        {id:"rcb",x:78,y:80,r:"cb",  n:"CB"},
        {id:"lm", x:32,y:61,r:"mid", n:"LM"},
        {id:"rm", x:68,y:61,r:"mid", n:"RM"},
        {id:"cf", x:50,y:24,r:"cf",  n:"CF"},
      ],
      atk:[{x:44,y:10,n:"9"},{x:68,y:7,n:"10"},{x:24,y:9,n:"7",b:1}],
      ball:{x:24,y:9},
    },
    { def:[
        {id:"lcb",x:22,y:87,r:"press",n:"CB"},
        {id:"ccb",x:50,y:89,r:"cover",n:"CB"},
        {id:"rcb",x:78,y:87,r:"aux",  n:"CB"},
        {id:"lm", x:28,y:71,r:"mid",  n:"LM"},
        {id:"rm", x:72,y:71,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:39,r:"cf",   n:"CF"},
      ],
      atk:[{x:10,y:54,n:"7",b:1},{x:35,y:51,n:"9"},{x:62,y:47,n:"10"}],
      ball:{x:10,y:54},
    },
    { def:[
        {id:"lcb",x:26,y:97,r:"press",n:"CB"},
        {id:"ccb",x:50,y:98,r:"cover",n:"CB"},
        {id:"rcb",x:74,y:97,r:"aux",  n:"CB"},
        {id:"lm", x:26,y:82,r:"mid",  n:"LM"},
        {id:"rm", x:74,y:82,r:"mid",  n:"RM"},
        {id:"cf", x:50,y:62,r:"cf",   n:"CF"},
      ],
      atk:[{x:8,y:87,n:"7",b:1},{x:38,y:91,n:"9"},{x:62,y:86,n:"10"}],
      ball:{x:8,y:87},
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   COACHING CONTENT
═══════════════════════════════════════════════════════════ */
const C = {
  u14_331: [
    {
      back:{
        title:"Hold a flat defensive line — nobody steps up",
        pts:[
          "Keep a flat line ~10 yards above the penalty area. Don't chase runners forward.",
          "Call your marks out loud: 'I've got #9!' so every teammate knows who has who.",
          "If one CB steps, the other two must shift together — always move as a connected unit.",
          "Watch diagonal runs early — identify them before the attacker arrives in your zone.",
        ],
      },
      mid:{
        title:"Fill the space between the lines — deny passes through your block",
        pts:[
          "Stand in the space between the back line and halfway — this is the most dangerous corridor, so occupy it.",
          "Don't chase the ball individually — hold your shape and let attackers play into it.",
          "Wide mids: track your winger but stay connected to the central mid at all times.",
          "Screen the back line — intercept passes before they reach the CBs.",
        ],
        cue:"\"Hold your shape! Find your space! Don't chase the ball!\"",
      },
      fwd:{
        title:"You are the team's first defender — press smart, not hard",
        pts:[
          "Use your body angle to block the central passing lane — force play wide or long from the top.",
          "Move with the ball laterally — if it goes right, your press angle shifts to cover the left-central option.",
          "A half-pace press in the right direction beats a full sprint in the wrong direction every time.",
          "When the ball is far away, rest and scan — save your legs for when the trigger fires.",
          "Think of yourself as shaping where the whole attack goes, not just chasing one player.",
        ],
        cue:"\"Channel them! Smart press — use your angle, not your speed!\"",
      },
    },
    {
      back:{
        title:"Activate your roles — structure is everything now",
        pts:[
          "Press/Pressure (Closest Man): your approach angle must cut the forward pass BEFORE you fully engage.",
          "Cover (Second Man): drop 45° behind the press — your shadow cuts the most dangerous pass lane.",
          "Auxiliary Cover (Third Man): shift centrally, track crossover runs, call 'switch!' loud and early.",
          "All three: stay goal-side and ball-side — never let an attacker step between you and your goal.",
        ],
      },
      mid:{
        title:"Drop as a unit — cut every passing lane through the middle",
        pts:[
          "All three mids drop 5–8 yards toward the back line the moment the ball crosses halfway.",
          "Near-side mid: tuck inside and behind the Auxiliary Cover defender — you double the coverage.",
          "Far-side mid: hold slightly higher — you are the only outlet if we win the ball quickly.",
          "Central mid: stand in the diagonal passing lane to the attacking striker — block it with your position.",
          "Nobody chases the ball wide — hold your structure and let play come into it.",
        ],
        cue:"\"Drop! Near side tuck in! Far side hold! Cut the diagonal lane!\"",
      },
      fwd:{
        title:"Drop to the 'gate' — block the easy escape pass",
        pts:[
          "Drop toward the halfway line — you become the 'gate' that cuts off backward and square passes.",
          "Position centrally between the ball and the opponent's midfielders.",
          "Your presence forces the carrier to go sideways (slower) or play long (easier to defend).",
          "Stay central — drifting wide opens a lane straight through the middle of our block.",
          "Stay alert: the moment we win it, you must be ready to receive the outlet pass immediately.",
        ],
        cue:"\"Drop to the gate! Stay central! Cut the back pass!\"",
      },
    },
    {
      back:{
        title:"Locked box — compress, delay, stay on your feet",
        pts:[
          "Squeeze together — no more than 4–5 yards between each defender. No gaps.",
          "Stay on your feet — delay and block, never dive in recklessly inside your own box.",
          "Force everything wide — nothing goes through the center channel of the goal.",
          "On a cross: hold the line and attack the ball as a unit — GK calls 'mine!' or 'away!'",
        ],
      },
      mid:{
        title:"Pack the box edge — mark runners, block the cutback",
        pts:[
          "Both wide mids tuck to the edge of the penalty area as the ball approaches.",
          "Central mid: get into the cutback lane — the ball pulled back across goal is the highest-danger ball.",
          "One mid stays at the top of the box to win the clearance and immediately re-establish pressure.",
          "Track any attacker making a late run into the box — nobody arrives unmarked.",
        ],
        cue:"\"Box edge! Cutback lane! Top of box — second ball!\"",
      },
      fwd:{
        title:"Hold the top of the defensive third — be ready for the transition",
        pts:[
          "Stay 30–35 yards from goal, central — you are NOT defending inside the box. Stay out.",
          "Your role is the transition: the moment we win the ball, you must already be moving.",
          "Keep scanning behind you over your shoulder — anticipate the long clearance over the top.",
          "If the ball is at the side of our box, stay central (don't drift to that side).",
          "A CF who stands still in Stage 3 kills the counter-attack — constant movement, constant readiness.",
        ],
        cue:"\"Top of the third! Stay central! Scan! Be ready to go on the clearance!\"",
      },
    },
  ],

  u17_231: [
    {
      back:{
        title:"2+1 passive block — CBs hold, Holding Mid screens",
        pts:[
          "Two CBs hold a flat line ~10–12 yards above the penalty area — do not step forward.",
          "The Holding Mid (DM) sits ~10 yards in front as a floating screen — NOT yet committed to the back line.",
          "CBs: do not press out of your line. Let the DM handle anything that arrives in front of you.",
          "Communicate constantly: 'runner right!' so diagonal threats are tracked early.",
        ],
      },
      mid:{
        title:"Wide mids hold shape — channel the ball inside",
        pts:[
          "Wide mids hold their width but stay connected to the DM's central position at all times.",
          "If the ball goes wide on your side, close at half-pace — never sprint and leave a gap behind you.",
          "Your job: funnel play toward the center where the DM can screen or intercept.",
          "The central corridor must never be left unoccupied — it is the most dangerous space on the pitch.",
        ],
        cue:"\"Hold wide! Channel inside! Never open the central lane!\"",
      },
      fwd:{
        title:"In the 2-3-1, the CF carries the entire team's first line of defense",
        pts:[
          "Your press angle must remove the central pass option — force the ball wide every single time.",
          "Move with the ball laterally — as it shifts right, your shadow covers the left-central lane.",
          "Don't chase the carrier; position. A well-angled stationary press beats a wasted sprint.",
          "Watch the GK — if they play a long ball, you are the first to react and compete.",
          "Energy management matters: press smart in Stage 1 so you have fuel for Stages 2 and 3.",
        ],
        cue:"\"Cut the central lane! Position, don't chase! Move with the ball!\"",
      },
    },
    {
      back:{
        title:"DM drops — this is the defining moment of the 2-3-1 system",
        pts:[
          "DM drops between the two CBs to form a temporary 3-man back line — commit fully, no hesitation.",
          "Left CB → Press/Pressure (Closest Man): cut the forward pass with your approach angle, then engage.",
          "DM → Cover (Second Man): you are now the central cover shadow — cut the most dangerous pass.",
          "Right CB → Auxiliary Cover (Third Man): track crossover runs, call 'switch!' clearly and loudly.",
          "The two wide mids must now cover all midfield width alone — a big ask, but essential.",
        ],
      },
      mid:{
        title:"Two wide mids cover the whole midfield — demanding and essential",
        pts:[
          "With the DM dropped, you two must cover all midfield — a huge responsibility.",
          "Both mids: drop 5–6 yards as the ball enters your half, stay compact.",
          "Near-side mid: shift inside toward Aux Cover — cut the wide-to-central pass.",
          "Far-side mid: hold slightly higher and wider — you are the only fast-break outlet the team has.",
          "Critical discipline: do NOT both chase the ball. If one goes, the other holds shape.",
        ],
        cue:"\"One chases, one holds! Near side drop! Far side — stay!\"",
      },
      fwd:{
        title:"Drop and screen — become the 3rd midfielder for this phase",
        pts:[
          "With DM in the back line, you must fill the central midfield gap — drop toward halfway.",
          "Position centrally between the ball and the opponent's DM or playmaker.",
          "You are not pressing hard — you're blocking the easy escape pass with your body position.",
          "Standing in their passing lane forces the carrier to play long or wide — both are slower to develop.",
          "The moment we win the ball, pivot instantly — you're the striker again in under a second.",
        ],
        cue:"\"Screen their DM! Block the return pass! Pivot fast when we win it!\"",
      },
    },
    {
      back:{
        title:"DM locked as 3rd CB — hold until the ball is fully cleared",
        pts:[
          "DM stays in the back line until the ball is completely cleared — no exceptions, no drifting.",
          "Three-CB structure: Press/Pressure closest, Cover central, Auxiliary Cover far side.",
          "Compress: no gaps wider than 4–5 yards between any two defenders.",
          "On a cross: hold the line together, attack the ball as a unit, GK takes command.",
        ],
      },
      mid:{
        title:"Two wide mids defend the box edge — relentless, disciplined work",
        pts:[
          "Both wide mids get to the edge of the penalty area as the ball approaches.",
          "Near-side mid: get into the cutback lane — the pulled-back ball is the highest-danger moment.",
          "Far-side mid: top of the box — win the clearance, restart pressure immediately.",
          "Track any attacker running centrally into the box on the blind side of the defense.",
        ],
        cue:"\"Box edge! Cutback lane! Second ball! Track the central runner!\"",
      },
      fwd:{
        title:"Stay near halfway — be the counter-attack weapon",
        pts:[
          "Hold 25–30 yards from goal — do not enter the box unless absolutely necessary.",
          "Keep moving in small bursts — maintain passing angles for when we win possession.",
          "In the 2-3-1, a quick outlet to you is the team's best and often ONLY counter-attack option.",
          "The moment any defender wins the ball, call for it loud and start your run immediately.",
          "Watch the ball constantly — one clean line-breaking pass creates an instant 1v1 breakaway.",
        ],
        cue:"\"Stay near halfway! Keep moving! Call loud! Be ready to break!\"",
      },
    },
  ],

  u17_321: [
    {
      back:{
        title:"Three CBs hold a flat line — central CB directs",
        pts:[
          "All three CBs hold a flat line ~10–12 yards above the penalty area — nobody pushes forward.",
          "This is a holding shape, not a press. Let the play come to you.",
          "Central CB leads: call 'step!' or 'hold!' to move the line as a connected unit.",
          "Track any attacker drifting behind the midfield line — call them early before they turn.",
        ],
      },
      mid:{
        title:"Two mids guard the central corridor — the most critical space",
        pts:[
          "In the 3-2-1, two mids must protect the central corridor at all times — never leave it open.",
          "Hold a compact double pivot — don't both chase the ball, stagger your positions slightly.",
          "Screen the back line: intercept passes before they reach the CBs.",
          "If the ball goes wide, one mid can shift — but the other must stay centrally.",
        ],
        cue:"\"Central! Protect the corridor! One shifts, one holds!\"",
      },
      fwd:{
        title:"CF sits at the tip of the defensive triangle — shape the whole attack",
        pts:[
          "In 3-2-1, you sit at the very top of a compact defending triangle. Everything flows from your press angle.",
          "Cut the most dangerous pass — usually the central lane — with your body position.",
          "Move with the ball laterally — as it goes right, your shadow covers the left-central option.",
          "Never get drawn wide — if you go wide, the two mids have a huge space to cover alone.",
          "You're not stopping one player. You're deciding where the entire attack is allowed to go.",
        ],
        cue:"\"Tip of the triangle! Cut the central pass! Stay out of the wide lane!\"",
      },
    },
    {
      back:{
        title:"Activate three-CB roles — structured and automatic",
        pts:[
          "Left CB → Press/Pressure (Closest Man): cut the forward pass angle first, then fully engage.",
          "Central CB → Cover (Second Man): drop slightly to form the cover shadow behind the press.",
          "Right CB → Auxiliary Cover (Third Man): track crossover runs, call 'switch!' loud and clear.",
          "Automatic rotation: if the 1st is beaten → 2nd steps, 3rd becomes new Cover — no hesitation.",
        ],
      },
      mid:{
        title:"Drop and compact — two mids must cover a lot of ground",
        pts:[
          "Both mids drop 6–8 yards toward the back line as the press trigger fires.",
          "Near-side mid: drop lower and inside — tuck behind the Auxiliary Cover defender.",
          "Far-side mid: hold slightly higher — you are the only fast-break option if we win the ball.",
          "With only two mids, neither can afford to be out of position — hold your structure tightly.",
        ],
        cue:"\"Drop! Near side get low! Far side hold shape! Stay tight!\"",
      },
      fwd:{
        title:"Drop and create a 3-3 defensive block — screen the playmaker",
        pts:[
          "Drop toward halfway — you create a 3-3 block: 3 CBs behind + 2 mids + CF = 6 below the ball.",
          "Your central position cuts off the opponent's DM or playmaker from receiving.",
          "Stand between the ball and their most dangerous passer — you don't need to win it, just block it.",
          "A composed, angled stand screens more effectively than an all-out sprint.",
          "You're giving the team a 6-player defensive base — that's your biggest contribution in this stage.",
        ],
        cue:"\"3-3 block! Screen their playmaker! Position — don't sprint!\"",
      },
    },
    {
      back:{
        title:"Lock the box — connected, compact, no diving",
        pts:[
          "Three CBs compress across the penalty area — no gaps wider than 4–5 yards.",
          "Stay on your feet — delay and block, never dive recklessly near your own goal.",
          "Force all play wide — nothing goes through the center channel.",
          "On a cross: hold the line, attack the ball as a unit — GK takes command.",
        ],
      },
      mid:{
        title:"Two mids defend the box edge — 5-player wall",
        pts:[
          "Both mids tuck to the edge of the penalty area as the ball enters the final third.",
          "Near-side mid: get into the cutback lane — stand there, not in the shooting lane.",
          "Far-side mid: top of the box — win clearances and own the second ball.",
          "Together with the 3 CBs, you form a tight 5-player defensive wall — compact and hard to break.",
        ],
        cue:"\"Box edge! Cutback lane! 5-player wall! Own the second ball!\"",
      },
      fwd:{
        title:"Hold the transition position — be the counter-attack weapon",
        pts:[
          "Hold 25–35 yards from goal, central, slightly ball-side — stay in transition range.",
          "Keep moving in small bursts — maintain passing angles for when we win possession.",
          "In 3-2-1, a quick outlet pass to you on a turnover is the team's most dangerous weapon.",
          "Don't stand still while your team defends — players who stand sacrifice the counter-attack.",
          "On a clearance: be moving BEFORE the ball is cleared — that 1-second head start is everything.",
        ],
        cue:"\"Hold and move! Stay in range! On the clearance — go! Be the weapon!\"",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   PITCH COMPONENT
═══════════════════════════════════════════════════════════ */
function Pitch({ fid, si }) {
  const pos = POS[fid][si];
  const sm  = STAGES[si];
  const pp  = pos.def.find(p => p.r === "press");

  return (
    <svg viewBox="0 0 100 138" style={{ width:"100%", display:"block", borderRadius:12, overflow:"hidden" }}>
      {/* Grass stripes */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={0} y={i*20} width={100} height={20}
          fill={i%2===0 ? "#164a16" : "#1b5e1b"} />
      ))}
      {/* Border */}
      <rect x={2} y={2} width={96} height={134} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.55}/>
      {/* Halfway */}
      <line x1={2} y1={16} x2={98} y2={16} stroke="rgba(255,255,255,0.4)" strokeWidth={0.55}/>
      <text x={50} y={14.8} textAnchor="middle" fontSize={2.7} fill="rgba(255,255,255,0.32)" fontFamily="monospace">HALFWAY</text>
      <circle cx={50} cy={16} r={0.9} fill="rgba(255,255,255,0.28)"/>
      <path d="M 36 16 Q 50 23 64 16" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.5}/>

      {/* Zone shading */}
      {si >= 1 && <rect x={2} y={16} width={96} height={74} fill={`${sm.col}07`}/>}
      {si >= 2 && <rect x={18} y={90} width={64} height={38} fill={`${sm.col}11`}/>}

      {/* Penalty box */}
      <rect x={18} y={90} width={64} height={38} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.46)" strokeWidth={0.65}/>
      <path d="M 36 90 Q 50 82 64 90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5}/>
      <circle cx={50} cy={107} r={0.75} fill="rgba(255,255,255,0.36)"/>
      {/* 6-yard box */}
      <rect x={36} y={114} width={28} height={14} fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth={0.5}/>
      {/* Goal */}
      <rect x={40} y={128} width={20} height={5} fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.78)" strokeWidth={0.85}/>
      <line x1={40} y1={128} x2={40} y2={133} stroke="rgba(255,255,255,0.5)" strokeWidth={0.4}/>
      <line x1={60} y1={128} x2={60} y2={133} stroke="rgba(255,255,255,0.5)" strokeWidth={0.4}/>

      {/* Press arrow */}
      {si >= 1 && pp && (
        <>
          <defs>
            <marker id="ap" markerWidth={4} markerHeight={4} refX={2} refY={2} orient="auto">
              <polygon points="0 0,4 2,0 4" fill={T.press} opacity={0.85}/>
            </marker>
          </defs>
          <line
            x1={pp.x} y1={pp.y - 4.8}
            x2={pos.ball.x + (pp.x > pos.ball.x ? 3.5 : -3.5)}
            y2={pos.ball.y + (pp.y > pos.ball.y ? 4 : -4)}
            stroke={T.press} strokeWidth={0.85} strokeDasharray="3,2.2" opacity={0.72}
            markerEnd="url(#ap)"/>
        </>
      )}

      {/* Attackers */}
      {pos.atk.map((a, i) => (
        <g key={i} style={{ transform:`translate(${a.x}px,${a.y}px)`, transition:"transform 0.75s cubic-bezier(.4,0,.2,1)" }}>
          {a.b && <circle cx={-5.8} cy={0} r={2.2} fill="white" opacity={0.88}/>}
          <circle cx={0} cy={0} r={4.6} fill={T.atk} stroke="rgba(255,255,255,0.7)" strokeWidth={0.7}/>
          <text x={0} y={1.6} textAnchor="middle" fontSize={3.1} fill="white" fontWeight="bold" fontFamily="monospace">{a.n}</text>
        </g>
      ))}

      {/* Defenders + mids + CF */}
      {pos.def.map(p => {
        const rc = T[p.r] || T.cb;
        const isRole = ["press","cover","aux"].includes(p.r);
        const isCF   = p.r === "cf";
        const textDark = ["press","cover","aux","cf","gk"].includes(p.r);
        return (
          <g key={p.id} style={{ transform:`translate(${p.x}px,${p.y}px)`, transition:"transform 0.75s cubic-bezier(.4,0,.2,1)" }}>
            {(isRole || (isCF && si > 0)) && (
              <circle cx={0} cy={0} r={7.2} fill={`${rc}18`} stroke={rc} strokeWidth={0.55} opacity={0.65}/>
            )}
            <circle cx={0} cy={0} r={4.6}
              fill={rc}
              stroke={isRole ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"}
              strokeWidth={isRole ? 1.4 : 0.65}/>
            <text x={0} y={1.6} textAnchor="middle" fontSize={2.9}
              fill={textDark ? "#000" : "white"}
              fontWeight="bold" fontFamily="monospace">
              {p.drop ? "DM" : p.n}
            </text>
            {isRole && (
              <text x={0} y={-8} textAnchor="middle" fontSize={2.4} fill={rc} fontWeight="bold" fontFamily="monospace">
                {p.r==="press"?"PRESS":p.r==="cover"?"COVER":"AUX"}
              </text>
            )}
            {p.drop && !isRole && (
              <text x={0} y={-8} textAnchor="middle" fontSize={2.4} fill={T.cover} fontWeight="bold" fontFamily="monospace">COVER</text>
            )}
          </g>
        );
      })}

      {/* GK */}
      <circle cx={50} cy={124} r={4.6} fill={T.gk} stroke="rgba(255,255,255,0.6)" strokeWidth={0.8}/>
      <text x={50} y={125.6} textAnchor="middle" fontSize={2.9} fill="#000" fontWeight="bold" fontFamily="monospace">GK</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEGEND
═══════════════════════════════════════════════════════════ */
function Legend({ fid }) {
  const items = [
    { c:T.press, l:"Press/Pressure (Closest Man)" },
    { c:T.cover, l: fid==="u17_231" ? "Cover — DM drops as 2nd Man" : "Cover (Second Man)" },
    { c:T.aux,   l:"Auxiliary Cover (Third Man)" },
    { c:T.mid,   l: fid==="u17_231" ? "Holding Mid (DM) / Wide Mid" : "Midfielder" },
    { c:T.cf,    l:"Center Forward (CF)" },
    { c:T.atk,   l:"Opponent" },
  ];
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"5px 14px", padding:"9px 0 5px", justifyContent:"center" }}>
      {items.map(it => (
        <div key={it.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#475569" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:it.c, flexShrink:0 }}/>
          {it.l}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTENT PANEL
═══════════════════════════════════════════════════════════ */
function Panel({ data, accent }) {
  if (!data) return null;
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:"bold", color:accent, marginBottom:13, lineHeight:1.45 }}>
        {data.title}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {data.pts.map((pt, i) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:21, height:21, borderRadius:"50%",
              background:`${accent}1e`, border:`1.5px solid ${accent}55`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, color:accent, fontWeight:"bold", flexShrink:0, marginTop:1 }}>
              {i+1}
            </div>
            <div style={{ fontSize:13, color:"#c8d6e8", lineHeight:1.68 }}>{pt}</div>
          </div>
        ))}
        {data.cue && (
          <div style={{ marginTop:8, padding:"10px 13px", borderRadius:8,
            background:`${accent}11`, border:`1px solid ${accent}2e`,
            fontSize:12, color:"#e2eaf5", fontStyle:"italic", lineHeight:1.55 }}>
            🗣 {data.cue}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROLE BADGE
═══════════════════════════════════════════════════════════ */
function RolePill({ color, label, sub }) {
  return (
    <div style={{ padding:"8px 10px", borderRadius:8, textAlign:"center",
      background:`${color}12`, border:`1px solid ${color}35` }}>
      <div style={{ fontSize:11, fontWeight:"bold", color, lineHeight:1.3 }}>{label}</div>
      <div style={{ fontSize:9, color:"#475569", marginTop:3 }}>{sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
const RTABS = [
  { id:"back", emoji:"🛡", label:"Backline" },
  { id:"mid",  emoji:"⚡", label:"Midfield" },
  { id:"fwd",  emoji:"🎯", label:"Forward"  },
];

export default function App() {
  const [fid,  setFid]  = useState("u14_331");
  const [si,   setSi]   = useState(0);
  const [rt,   setRt]   = useState("back");
  const [intro,setIntro]= useState(true);

  const fm  = FM[fid];
  const sm  = STAGES[si];
  const ct  = C[fid][si];
  const pd  = ct[rt];
  const pc  = rt==="back" ? sm.col : rt==="mid" ? T.mid : T.cf;
  const is231 = fid === "u17_231";

  return (
    <div style={{ fontFamily:"'Trebuchet MS','Georgia',serif", background:T.bg,
      minHeight:"100vh", color:"#f0f5fa", paddingBottom:56 }}>

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(160deg,#0a1a0b 0%,#05080a 100%)",
        borderBottom:`2px solid #14532d35`, padding:"20px 16px 14px", textAlign:"center" }}>
        <div style={{ fontSize:9, letterSpacing:6, color:"#4ade80", textTransform:"uppercase", marginBottom:4 }}>
          Tactical Coaching Board
        </div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:"bold", color:"#fff", letterSpacing:0.5 }}>
          Protect the Box
        </h1>
        <p style={{ margin:"4px 0 0", fontSize:11, color:"#4a5568" }}>
          Compact Block · 3 Defensive Stages · Backline · Midfield · Forward Roles
        </p>
      </div>

      {/* ── HOW TO USE (dismissable) ── */}
      {intro && (
        <div style={{ margin:"12px 12px 0", padding:"13px 15px 13px 15px",
          borderRadius:10, background:"#0d1f0f", border:"1px solid #22c55e28",
          position:"relative" }}>
          <button onClick={() => setIntro(false)}
            style={{ position:"absolute", top:8, right:10, background:"none", border:"none",
              color:"#4a5568", fontSize:16, cursor:"pointer", lineHeight:1, padding:2 }}>✕</button>
          <div style={{ fontSize:10, fontWeight:"bold", color:"#4ade80",
            letterSpacing:3, textTransform:"uppercase", marginBottom:7 }}>
            How to Use
          </div>
          <div style={{ fontSize:12, color:"#8892a4", lineHeight:1.8 }}>
            <span style={{ color:"#c8d6e8", fontWeight:"bold" }}>1.</span> Pick your team &amp; formation below.<br/>
            <span style={{ color:"#c8d6e8", fontWeight:"bold" }}>2.</span> Step through the 3 stages to see how the whole team shifts on the animated pitch.<br/>
            <span style={{ color:"#c8d6e8", fontWeight:"bold" }}>3.</span> Tap <b style={{ color:"#c8d6e8" }}>Backline / Midfield / Forward</b> to read each player group's specific job.<br/>
            <span style={{ color:"#c8d6e8", fontWeight:"bold" }}>4.</span> Share this page with players — works on any phone or computer.
          </div>
        </div>
      )}

      {/* ── FORMATION TABS ── */}
      <div style={{ padding:"13px 10px 0", display:"flex", gap:7,
        justifyContent:"center", flexWrap:"wrap" }}>
        {Object.entries(FM).map(([k, f]) => (
          <button key={k} onClick={() => { setFid(k); setSi(0); setRt("back"); }}
            style={{ padding:"8px 15px", borderRadius:22, cursor:"pointer",
              transition:"all 0.2s",
              border: fid===k ? `2px solid ${f.col}` : `2px solid ${T.border}`,
              background: fid===k ? `${f.col}1e` : T.surf,
              color: fid===k ? f.acc : "#4a5568",
              fontWeight: fid===k ? "bold" : "normal", fontSize:12 }}>
            <div style={{ fontWeight:"bold" }}>{f.name}</div>
            <div style={{ fontSize:10, opacity:0.8 }}>{f.fmt}</div>
          </button>
        ))}
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"13px 12px 0" }}>

        {/* Formation note */}
        <div style={{ textAlign:"center", fontSize:11, color:"#374151",
          letterSpacing:1, marginBottom:12, fontStyle:"italic" }}>
          {fm.note}
        </div>

        {/* ── STAGE BUTTONS ── */}
        <div style={{ display:"flex", gap:5, marginBottom:10 }}>
          {STAGES.map((s, i) => (
            <button key={i} onClick={() => { setSi(i); setRt("back"); }}
              style={{ flex:1, padding:"10px 4px", borderRadius:8, cursor:"pointer",
                transition:"all 0.2s", textAlign:"center",
                border: si===i ? `2px solid ${s.col}` : `2px solid ${T.border}`,
                background: si===i ? `${s.col}16` : T.surf }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase",
                color: si===i ? s.col : "#2d3748", marginBottom:2 }}>{s.tag}</div>
              <div style={{ fontSize:12, fontWeight:"bold",
                color: si===i ? "#fff" : "#4a5568" }}>{s.title}</div>
              <div style={{ fontSize:9, marginTop:2,
                color: si===i ? `${s.col}aa` : "#1e293b" }}>
                {s.sub.replace("Ball ", "")}
              </div>
            </button>
          ))}
        </div>

        {/* Stage description */}
        <div style={{ padding:"9px 13px", borderRadius:8,
          background:`${sm.col}0d`, border:`1px solid ${sm.col}26`,
          marginBottom:12, display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:"50%",
            background:sm.col, flexShrink:0 }}/>
          <span style={{ fontSize:10, fontWeight:"bold", color:sm.col,
            letterSpacing:1.5, textTransform:"uppercase", marginRight:7 }}>{sm.title}</span>
          <span style={{ fontSize:12, color:"#8892a4" }}>{sm.desc}</span>
        </div>

        {/* ── PITCH ── */}
        <Pitch fid={fid} si={si} />
        <Legend fid={fid} />

        {/* ── 2-3-1 DM EXPLAINER ── */}
        {is231 && si > 0 && (
          <div style={{ margin:"10px 0 0", padding:"12px 14px", borderRadius:9,
            border:"1px solid #22d3ee28", background:"#22d3ee07",
            fontSize:12, color:"#8892a4", lineHeight:1.72 }}>
            <span style={{ fontWeight:"bold", color:"#22d3ee" }}>⚙ 2-3-1 Key Mechanism: </span>
            {si===1
              ? "The Holding Mid (DM) drops between the two CBs to create a temporary 3-man back line — this is the defining move of this system. The two wide mids must now cover all midfield width alone. The DM must commit fully with no hesitation."
              : "DM stays locked in the back line as a 3rd CB until the ball is completely cleared. The two remaining wide mids carry the full midfield workload — demanding, but essential to keeping the box protected."}
          </div>
        )}

        {/* ── ROLE PILLS (backline only, stage 1+) ── */}
        {si > 0 && rt === "back" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, margin:"14px 0 0" }}>
            <RolePill color={T.press} label="Press/Pressure" sub="(Closest Man)"/>
            <RolePill color={T.cover} label="Cover"          sub={is231 ? "(DM — 2nd Man)" : "(Second Man)"}/>
            <RolePill color={T.aux}   label="Auxiliary Cover" sub="(Third Man)"/>
          </div>
        )}

        {/* ── ROLE TABS ── */}
        <div style={{ display:"flex", gap:5, margin:"14px 0 9px" }}>
          {RTABS.map(r => {
            const rc = r.id==="back" ? sm.col : r.id==="mid" ? T.mid : T.cf;
            return (
              <button key={r.id} onClick={() => setRt(r.id)}
                style={{ flex:1, padding:"10px 4px", borderRadius:8, cursor:"pointer",
                  transition:"all 0.2s",
                  border: rt===r.id ? `2px solid ${rc}` : `2px solid ${T.border}`,
                  background: rt===r.id ? `${rc}18` : T.surf,
                  color: rt===r.id ? rc : "#4a5568",
                  fontWeight: rt===r.id ? "bold" : "normal", fontSize:12 }}>
                <span style={{ marginRight:4 }}>{r.emoji}</span>{r.label}
              </button>
            );
          })}
        </div>

        {/* ── CONTENT PANEL ── */}
        <div style={{ padding:"16px", borderRadius:10,
          border:`1px solid ${pc}20`, background:`${pc}07`, minHeight:170 }}>
          <Panel data={pd} accent={pc} />
        </div>

        {/* ── ALL-STAGE QUICK REFERENCE ── */}
        <div style={{ marginTop:20, padding:"15px", borderRadius:10,
          border:`1px solid ${T.border}`, background:T.surf }}>
          <div style={{ fontSize:9, letterSpacing:4, color:"#2d3748",
            textTransform:"uppercase", marginBottom:12 }}>
            Quick Cue Reference · {fm.name} · {fm.fmt}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {STAGES.map((s, i) => (
              <div key={i} style={{ padding:"11px 9px", borderRadius:8,
                background:`${s.col}0b`, border:`1px solid ${s.col}24` }}>
                <div style={{ fontSize:9, fontWeight:"bold", color:s.col,
                  letterSpacing:1, textTransform:"uppercase", marginBottom:7 }}>
                  {s.title}
                </div>
                {(["back","mid","fwd"]).map(k => {
                  const d2 = C[fid][i][k];
                  const rc = k==="back" ? s.col : k==="mid" ? T.mid : T.cf;
                  const lbl = k==="back" ? "Backline" : k==="mid" ? "Midfield" : "Forward";
                  return d2?.cue ? (
                    <div key={k} style={{ marginBottom:5 }}>
                      <div style={{ fontSize:8.5, color:rc, letterSpacing:1,
                        textTransform:"uppercase", marginBottom:2 }}>{lbl}</div>
                      <div style={{ fontSize:10, color:"#4a5568", fontStyle:"italic",
                        lineHeight:1.5, paddingLeft:6,
                        borderLeft:`2px solid ${rc}44` }}>
                        {d2.cue}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop:20, textAlign:"center", fontSize:11, color:"#2d3748" }}>
          Step through each stage · Switch formations · Share with your team
        </div>

      </div>
    </div>
  );
}

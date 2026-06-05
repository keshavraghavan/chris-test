const CX = 560;
const CY = 420;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBackPetals() {
  const N = 12;
  const R = 132;
  const W = 58;
  return Array.from({ length: N }, (_, i) => {
    const a = (360 / N) * i + 15;
    const d = `M ${CX} ${CY} C ${CX - W} ${CY - R * 0.42}, ${CX - W * 0.72} ${CY - R}, ${CX} ${CY - R} C ${CX + W * 0.72} ${CY - R}, ${CX + W} ${CY - R * 0.42}, ${CX} ${CY} Z`;
    return (
      <path
        key={`back-${i}`}
        d={d}
        transform={`rotate(${a} ${CX} ${CY})`}
        fill="var(--petal-back)"
        stroke="var(--ink)"
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
    );
  });
}

function buildFrontPetals() {
  const N = 12;
  const R = 160;
  const W = 63;
  const HR = R * 0.62;
  const HW = W * 0.5;
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const a = (360 / N) * i;
    const d = `M ${CX} ${CY} C ${CX - W} ${CY - R * 0.4}, ${CX - W * 0.72} ${CY - R}, ${CX} ${CY - R} C ${CX + W * 0.72} ${CY - R}, ${CX + W} ${CY - R * 0.4}, ${CX} ${CY} Z`;
    const hd = `M ${CX} ${CY} C ${CX - HW} ${CY - HR * 0.4}, ${CX - HW * 0.7} ${CY - HR}, ${CX} ${CY - HR} C ${CX + HW * 0.7} ${CY - HR}, ${CX + HW} ${CY - HR * 0.4}, ${CX} ${CY} Z`;
    nodes.push(
      <path
        key={`front-${i}`}
        d={d}
        transform={`rotate(${a} ${CX} ${CY})`}
        fill="var(--petal)"
        stroke="var(--ink)"
        strokeWidth={5}
        strokeLinejoin="round"
      />,
    );
    nodes.push(
      <path
        key={`front-h-${i}`}
        d={hd}
        transform={`rotate(${a} ${CX} ${CY})`}
        fill="#F47C5C"
        opacity={0.55}
      />,
    );
  }
  return nodes;
}

function buildSeeds() {
  const rand = mulberry32(42);
  const half = 58;
  const step = 22;
  const seeds: React.ReactNode[] = [];
  let k = 0;
  for (let gy = -half; gy <= half; gy += step) {
    for (let gx = -half; gx <= half; gx += step) {
      const jx = (rand() - 0.5) * 8;
      const jy = (rand() - 0.5) * 8;
      const px = gx + jx;
      const py = gy + jy;
      if (Math.hypot(px, py) <= half) {
        seeds.push(
          <circle
            key={`seed-${k++}`}
            cx={CX + px}
            cy={CY + py}
            r={5.4}
            fill="var(--seed)"
          />,
        );
      }
    }
  }
  return seeds;
}

export default function ChrisPriggFlower() {
  return (
    <div className="chris-prigg-frame">
      <svg
        viewBox="0 0 1500 1150"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A polished hand-drawn flower with the name chris Prigg"
      >
        <defs>
          <filter id="cp-rough" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={8} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="cp-roughSoft" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="cp-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" result="t" />
            <feColorMatrix in="t" type="saturate" values="0" />
          </filter>
          <pattern
            id="cp-dots"
            width={44}
            height={44}
            patternUnits="userSpaceOnUse"
            patternTransform="translate(8 8)"
          >
            <circle cx={3} cy={3} r={2.4} fill="rgba(54,38,26,0.11)" />
          </pattern>
          <radialGradient id="cp-bloomGlow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity={0.55} />
            <stop offset="70%" stopColor="#ffd98a" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={1500} height={1150} fill="var(--paper)" />
        <rect x={0} y={0} width={1500} height={1150} fill="url(#cp-dots)" />
        <rect
          x={0}
          y={0}
          width={1500}
          height={1150}
          filter="url(#cp-grain)"
          opacity={0.06}
          style={{ mixBlendMode: "multiply" }}
        />
        <ellipse cx={560} cy={420} rx={360} ry={320} fill="url(#cp-bloomGlow)" />

        <g filter="url(#cp-rough)">
          <rect x={46} y={46} width={1408} height={1058} rx={26} fill="none" stroke="var(--ink)" strokeWidth={7} />
          <rect x={66} y={66} width={1368} height={1018} rx={18} fill="none" stroke="var(--ink)" strokeWidth={2.6} />

          <path
            d="M 352 968 Q 540 952 770 970"
            fill="none"
            stroke="var(--ink)"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.75}
          />
          <path
            d="M 392 984 q 70 -6 150 2"
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.5}
          />

          <path
            d="M 560 470 C 540 620 600 780 576 950"
            fill="none"
            stroke="var(--leaf)"
            strokeWidth={17}
            strokeLinecap="round"
          />

          <g stroke="var(--ink)" strokeWidth={4.5} strokeLinejoin="round">
            <path d="M 568 712 C 470 660 432 700 446 770 C 520 778 560 760 568 712 Z" fill="var(--leaf-2)" />
            <path d="M 470 700 q 50 28 96 14" fill="none" strokeWidth={3} />
            <path d="M 580 776 C 678 740 720 786 700 852 C 626 854 590 826 580 776 Z" fill="var(--leaf-2)" />
            <path d="M 692 766 q -52 32 -110 22" fill="none" strokeWidth={3} />
          </g>

          <g>
            {buildBackPetals()}
            {buildFrontPetals()}
            <rect
              x={CX - 68}
              y={CY - 68}
              width={136}
              height={136}
              rx={36}
              fill="var(--center)"
              stroke="var(--ink)"
              strokeWidth={5.5}
            />
            {buildSeeds()}
          </g>
        </g>

        <g transform="rotate(-3.5 1130 548)">
          <text
            x={1130}
            y={566}
            textAnchor="middle"
            fontFamily="var(--font-shantell-sans), 'Shantell Sans', cursive"
            fontWeight={600}
            fontSize={104}
            fill="var(--ink)"
          >
            chris Prigg!
          </text>
          <path
            d="M 930 612 C 1040 596 1230 600 1330 620"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={9}
            strokeLinecap="round"
            filter="url(#cp-roughSoft)"
          />
        </g>

        <g filter="url(#cp-roughSoft)" stroke="var(--accent)" strokeWidth={6} strokeLinecap="round">
          <path d="M 1316 452 v 44 M 1294 474 h 44" />
        </g>
        <g filter="url(#cp-roughSoft)" stroke="var(--leaf)" strokeWidth={4.5} strokeLinecap="round">
          <path d="M 900 470 v 30 M 885 485 h 30" />
        </g>
      </svg>
    </div>
  );
}

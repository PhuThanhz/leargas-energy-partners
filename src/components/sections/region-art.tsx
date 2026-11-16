/** Conceptual illustration: international capital flowing into Vietnam and the region. */
export function RegionArt() {
  return (
    <div
      role="img"
      aria-label="Stylised illustration of international capital connecting to Vietnam and the wider Asia-Pacific region"
      className="relative min-h-[380px] overflow-hidden rounded-[2px] bg-green p-9 text-white md:min-h-[460px]"
    >
      <span
        aria-hidden
        className="absolute top-[-45px] left-[90px] size-[520px] rounded-full border border-gold/20"
      />
      <span
        aria-hidden
        className="absolute top-[45px] left-[180px] size-[340px] rounded-full border border-gold/15"
      />
      <span className="absolute top-6 right-[26px] text-[10px] tracking-[0.25em] text-gold/80">
        N ↑
      </span>
      <svg viewBox="0 0 500 400" fill="none" className="absolute inset-5 z-[1] h-[90%] w-[90%]">
        {/* Land masses */}
        <path
          d="M130 35 178 55 167 98 207 120 227 166 210 210 239 255 279 277 287 246 262 216 258 173 231 135 230 104 195 87 204 45"
          fill="#0d5a41"
        />
        <path
          d="m150 180 28 47-8 57 30 55 32 13-18-37-12-52-20-51zM238 344l43 5 39 16 43-3 36 17-70 6-68-17zM363 151l13 21-4 24 17 23 5-42-13-32zM346 278l36-17 34 21-5 48-34 7-28-23z"
          fill="#0d5a41"
        />
        {/* Global capital arriving */}
        <path d="M-10 40Q120 70 260 207" stroke="#f9c21e" strokeWidth="1.5" />
        <text x="8" y="30" fill="#f9c21e" fontSize="9" fontFamily="Arial" letterSpacing="2">
          GLOBAL CAPITAL
        </text>
        {/* Regional connections */}
        <path
          d="M260 207Q327 150 378 180M260 207Q229 259 206 298M260 207Q324 261 376 300M260 207Q264 314 311 367"
          stroke="#f9c21e"
          strokeOpacity=".7"
          strokeDasharray="4 6"
        />
        <circle
          cx="260"
          cy="207"
          r="26"
          fill="#ee0f1f"
          fillOpacity=".25"
          className="animate-pulse"
        />
        <circle cx="260" cy="207" r="7" fill="#ee0f1f" />
        <rect x="280" y="194" width="110" height="28" rx="2" fill="#f9c21e" />
        <text x="295" y="212" fill="#01422e" fontSize="10" fontFamily="Arial" letterSpacing="2.5">
          VIETNAM
        </text>
        {[
          [378, 180],
          [206, 298],
          [376, 300],
          [311, 367],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#f9c21e" />
        ))}
      </svg>
      <span className="absolute bottom-[25px] z-[2] text-[10px] tracking-[0.2em]">
        A LOCAL LENS. A REGIONAL OUTLOOK.
        <br />
        <small className="text-[8px] leading-loose text-white/60">
          Conceptual illustration · Not a coverage map
        </small>
      </span>
    </div>
  )
}

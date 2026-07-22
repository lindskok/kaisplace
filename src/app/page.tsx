"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DuckKind = "normal" | "fast" | "zigzag" | "armored" | "boss";

interface Duck {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: DuckKind;
  hp: number;
  maxHp: number;
  size: number;
  angle: number;
  escaped: boolean;
  dead: boolean;
  deathTimer: number;
  hitFlash: number;
  zigzagTimer: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Perk {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

type GamePhase = "title" | "playing" | "upgrade" | "gameover";

interface GameState {
  phase: GamePhase;
  wave: number;
  score: number;
  lives: number;
  streak: number;
  highScore: number;
  multiShot: number;
  bulletSize: number;
  reloadSpeed: number;
  piercingShots: boolean;
  timeWarp: boolean;
  doublePoints: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_W = 800;
const CANVAS_H = 500;
const BASE_LIVES = 5;
const DUCK_ESCAPE_X_MARGIN = 60;

const DUCK_COLORS: Record<DuckKind, string[]> = {
  normal:  ["#4ade80", "#22c55e"],
  fast:    ["#facc15", "#eab308"],
  zigzag:  ["#f97316", "#ea580c"],
  armored: ["#94a3b8", "#64748b"],
  boss:    ["#f43f5e", "#e11d48"],
};

const PERK_POOL: Perk[] = [
  { id: "multiShot",    name: "Multi-Shot",     icon: "✦", desc: "+1 bullet per shot" },
  { id: "bigBullet",    name: "Big Shot",       icon: "⬤", desc: "Bullets are 50% larger" },
  { id: "fastReload",   name: "Fast Reload",    icon: "⚡", desc: "Shoot 30% faster" },
  { id: "piercing",     name: "Piercing",       icon: "⟹", desc: "Bullets pierce through ducks" },
  { id: "timeWarp",     name: "Time Warp",      icon: "⏳", desc: "Ducks move 20% slower" },
  { id: "doublePoints", name: "Double Points",  icon: "×2", desc: "All kills worth 2×" },
  { id: "extraLife",    name: "Extra Life",     icon: "♥",  desc: "Gain +1 life" },
  { id: "fullHeal",     name: "Full Heal",      icon: "✚",  desc: "Restore all lives" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 1;

function spawnDuck(wave: number, timeWarp: boolean): Duck {
  const roll = Math.random();
  let kind: DuckKind = "normal";
  if (wave >= 10 && roll < 0.05) kind = "boss";
  else if (wave >= 6  && roll < 0.20) kind = "armored";
  else if (wave >= 4  && roll < 0.35) kind = "zigzag";
  else if (wave >= 2  && roll < 0.50) kind = "fast";

  const speed = (1.5 + wave * 0.18 + Math.random() * 0.8) * (timeWarp ? 0.8 : 1);
  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? -40 : CANVAS_W + 40;
  const y = 60 + Math.random() * (CANVAS_H - 180);
  const vx = fromLeft ? speed : -speed;
  const vy = (Math.random() - 0.5) * speed * 0.6;

  const hpMap: Record<DuckKind, number> = { normal: 1, fast: 1, zigzag: 1, armored: 2, boss: 5 };
  const sizeMap: Record<DuckKind, number> = { normal: 22, fast: 18, zigzag: 20, armored: 26, boss: 42 };
  const hp = hpMap[kind];

  return {
    id: nextId++,
    x, y, vx, vy, kind,
    hp, maxHp: hp,
    size: sizeMap[kind],
    angle: fromLeft ? 0 : Math.PI,
    escaped: false, dead: false,
    deathTimer: 0, hitFlash: 0, zigzagTimer: 0,
  };
}

function ducksForWave(wave: number) {
  return Math.min(5 + wave * 2, 30);
}

function drawDuck(ctx: CanvasRenderingContext2D, duck: Duck) {
  const { x, y, size, kind, angle, hp, maxHp, hitFlash } = duck;
  const [bodyColor, wingColor] = DUCK_COLORS[kind];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  if (hitFlash > 0) ctx.filter = "brightness(3)";

  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.65, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-size * 0.1, -size * 0.3, size * 0.6, size * 0.35, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = wingColor;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.75, -size * 0.3, size * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.88, -size * 0.38, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size * 1.1, -size * 0.22);
  ctx.lineTo(size * 1.4, -size * 0.28);
  ctx.lineTo(size * 1.1, -size * 0.12);
  ctx.fillStyle = "#fbbf24";
  ctx.fill();

  ctx.filter = "none";
  ctx.restore();

  if (maxHp > 1) {
    const barW = size * 2;
    const barX = x - barW / 2;
    const barY = y - size - 10;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(barX, barY, barW, 5);
    ctx.fillStyle = kind === "boss" ? "#f43f5e" : "#94a3b8";
    ctx.fillRect(barX, barY, barW * (hp / maxHp), 5);
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnParticles(x: number, y: number, kind: DuckKind): Particle[] {
  const colors = DUCK_COLORS[kind];
  return Array.from({ length: 12 }, () => ({
    id: nextId++,
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 2,
    life: 35 + Math.random() * 20,
    maxLife: 55,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 4,
  }));
}

function pickPerks(gs: GameState): Perk[] {
  const available = PERK_POOL.filter((p) => {
    if (p.id === "piercing"      && gs.piercingShots)  return false;
    if (p.id === "timeWarp"      && gs.timeWarp)        return false;
    if (p.id === "doublePoints"  && gs.doublePoints)    return false;
    if (p.id === "multiShot"     && gs.multiShot >= 4)  return false;
    if (p.id === "bigBullet"     && gs.bulletSize >= 3) return false;
    if (p.id === "fastReload"    && gs.reloadSpeed >= 4) return false;
    if (p.id === "fullHeal"      && gs.lives >= BASE_LIVES) return false;
    return true;
  });
  return [...available].sort(() => Math.random() - 0.5).slice(0, 3);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const stateRef      = useRef<GameState>({
    phase: "title",
    wave: 0, score: 0, lives: BASE_LIVES, streak: 0, highScore: 0,
    multiShot: 0, bulletSize: 1, reloadSpeed: 1,
    piercingShots: false, timeWarp: false, doublePoints: false,
  });
  const ducksRef      = useRef<Duck[]>([]);
  const particlesRef  = useRef<Particle[]>([]);
  const mouseRef      = useRef({ x: CANVAS_W / 2, y: CANVAS_H / 2 });
  const reloadRef     = useRef(0);
  const spawnQueueRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const waveEndRef    = useRef(false);
  const rafRef        = useRef<number>(0);

  const [phase,     setPhase]     = useState<GamePhase>("title");
  const [wave,      setWave]      = useState(0);
  const [score,     setScore]     = useState(0);
  const [lives,     setLives]     = useState(BASE_LIVES);
  const [perks,     setPerks]     = useState<Perk[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [streak,    setStreak]    = useState(0);

  const syncUI = useCallback(() => {
    const gs = stateRef.current;
    setPhase(gs.phase);
    setWave(gs.wave);
    setScore(gs.score);
    setLives(gs.lives);
    setStreak(gs.streak);
    setHighScore(gs.highScore);
  }, []);

  const startWave = useCallback(() => {
    const gs = stateRef.current;
    gs.wave += 1;
    gs.phase = "playing";
    spawnQueueRef.current  = ducksForWave(gs.wave);
    spawnTimerRef.current  = 60;
    waveEndRef.current     = false;
    ducksRef.current       = [];
    syncUI();
  }, [syncUI]);

  const applyPerk = useCallback((perk: Perk) => {
    const gs = stateRef.current;
    switch (perk.id) {
      case "multiShot":    gs.multiShot    = Math.min(gs.multiShot + 1, 4); break;
      case "bigBullet":    gs.bulletSize   = Math.min(gs.bulletSize + 0.5, 3); break;
      case "fastReload":   gs.reloadSpeed  = Math.min(gs.reloadSpeed + 0.3, 4); break;
      case "piercing":     gs.piercingShots = true; break;
      case "timeWarp":     gs.timeWarp      = true; break;
      case "doublePoints": gs.doublePoints  = true; break;
      case "extraLife":    gs.lives = Math.min(gs.lives + 1, BASE_LIVES + 5); break;
      case "fullHeal":     gs.lives = BASE_LIVES; break;
    }
    startWave();
  }, [startWave]);

  const shoot = useCallback(() => {
    const gs = stateRef.current;
    if (gs.phase !== "playing") return;
    if (reloadRef.current > 0) return;

    const baseCD = 18;
    reloadRef.current = Math.round(baseCD / gs.reloadSpeed);

    const { x: mx, y: my } = mouseRef.current;
    const bulletR = 10 * gs.bulletSize;
    const shots   = 1 + gs.multiShot;
    const spread  = 0.12;
    let hit = false;

    for (let s = 0; s < shots; s++) {
      const angleOffset = (s - (shots - 1) / 2) * spread;
      const dy = Math.sin(angleOffset);

      const targets = [...ducksRef.current]
        .filter(d => !d.dead && !d.escaped)
        .sort((a, b) => {
          const da = (a.x - mx) ** 2 + (a.y - my) ** 2;
          const db = (b.x - mx) ** 2 + (b.y - my) ** 2;
          return da - db;
        });

      for (const duck of targets) {
        const dist = Math.sqrt((duck.x - mx) ** 2 + (duck.y - my + dy * 0) ** 2);
        if (dist < duck.size + bulletR) {
          duck.hp     -= 1;
          duck.hitFlash = 6;
          if (duck.hp <= 0) {
            duck.dead       = true;
            duck.deathTimer = 30;
            const pts = (
              duck.kind === "boss"    ? 50 :
              duck.kind === "armored" ? 20 :
              duck.kind === "zigzag"  ? 15 :
              duck.kind === "fast"    ? 12 : 10
            ) * (1 + gs.streak * 0.1) * (gs.doublePoints ? 2 : 1);
            gs.score  += Math.round(pts);
            gs.streak += 1;
            particlesRef.current.push(...spawnParticles(duck.x, duck.y, duck.kind));
            hit = true;
          }
          if (!gs.piercingShots) break;
        }
      }
    }
    if (!hit) gs.streak = 0;
    syncUI();
  }, [syncUI]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const gs = stateRef.current;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      sky.addColorStop(0, "#0c1a2e");
      sky.addColorStop(1, "#1a3a1a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.fillStyle = "#14532d";
      ctx.fillRect(0, CANVAS_H - 60, CANVAS_W, 60);
      ctx.fillStyle = "#166534";
      ctx.fillRect(0, CANVAS_H - 65, CANVAS_W, 10);

      if (gs.phase === "playing") {
        // Spawn
        if (spawnQueueRef.current > 0) {
          spawnTimerRef.current -= 1;
          if (spawnTimerRef.current <= 0) {
            ducksRef.current.push(spawnDuck(gs.wave, gs.timeWarp));
            spawnQueueRef.current -= 1;
            spawnTimerRef.current  = 40 + Math.random() * 40;
          }
        }

        // Update ducks
        for (const duck of ducksRef.current) {
          if (duck.dead) { duck.deathTimer -= 1; continue; }
          if (duck.escaped) continue;
          if (duck.hitFlash > 0) duck.hitFlash -= 1;

          if (duck.kind === "zigzag") {
            duck.zigzagTimer += 1;
            duck.vy = Math.sin(duck.zigzagTimer * 0.12) * 3.5;
          }
          if (duck.y < 30 || duck.y > CANVAS_H - 80) duck.vy *= -1;
          duck.x    += duck.vx;
          duck.y    += duck.vy;
          duck.angle = duck.vx > 0 ? 0 : Math.PI;

          if (duck.x < -DUCK_ESCAPE_X_MARGIN || duck.x > CANVAS_W + DUCK_ESCAPE_X_MARGIN) {
            duck.escaped = true;
            gs.lives    -= 1;
            gs.streak    = 0;
            if (gs.lives <= 0) {
              gs.lives     = 0;
              gs.phase     = "gameover";
              if (gs.score > gs.highScore) gs.highScore = gs.score;
              syncUI();
            }
          }
        }

        ducksRef.current = ducksRef.current.filter(d => !(d.dead && d.deathTimer <= 0));

        if (!waveEndRef.current && spawnQueueRef.current === 0) {
          const alive = ducksRef.current.filter(d => !d.dead && !d.escaped);
          if (alive.length === 0) {
            waveEndRef.current = true;
            gs.phase = "upgrade";
            setPerks(pickPerks(gs));
            syncUI();
          }
        }

        for (const duck of ducksRef.current) {
          if (!duck.escaped) drawDuck(ctx, duck);
        }

        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        for (const p of particlesRef.current) {
          p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 1;
        }
        drawParticles(ctx, particlesRef.current);

        // Reload bar
        if (reloadRef.current > 0) {
          reloadRef.current -= 1;
          const total = Math.round(18 / gs.reloadSpeed);
          const frac  = 1 - reloadRef.current / total;
          ctx.fillStyle = "#1e293b88";
          ctx.fillRect(CANVAS_W / 2 - 50, CANVAS_H - 30, 100, 8);
          ctx.fillStyle = "#818cf8";
          ctx.fillRect(CANVAS_W / 2 - 50, CANVAS_H - 30, 100 * frac, 8);
        }

        // Crosshair
        const { x: mx, y: my } = mouseRef.current;
        const cr = 18;
        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth   = 1.5;
        ctx.beginPath(); ctx.moveTo(mx - cr, my); ctx.lineTo(mx + cr, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - cr); ctx.lineTo(mx, my + cr); ctx.stroke();
        ctx.beginPath(); ctx.arc(mx, my, cr * 0.55, 0, Math.PI * 2); ctx.stroke();

        // HUD
        ctx.fillStyle = "#f8fafc";
        ctx.font      = "bold 16px monospace";
        ctx.fillText(`WAVE ${gs.wave}`,  16, 28);
        ctx.fillText(`SCORE ${gs.score}`, 16, 50);
        ctx.fillStyle = "#f43f5e";
        ctx.fillText("♥".repeat(gs.lives), 16, 72);
        if (gs.streak > 2) {
          ctx.fillStyle = "#facc15";
          ctx.fillText(`×${gs.streak} streak`, CANVAS_W - 110, 28);
        }

        const activePerks: string[] = [];
        if (gs.multiShot)     activePerks.push(`+${gs.multiShot} shot`);
        if (gs.piercingShots) activePerks.push("pierce");
        if (gs.timeWarp)      activePerks.push("slow");
        if (gs.doublePoints)  activePerks.push("×2 pts");
        ctx.fillStyle = "#818cf8";
        ctx.font      = "12px monospace";
        activePerks.forEach((label, i) => ctx.fillText(label, CANVAS_W - 110, 48 + i * 16));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [syncUI]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect   = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }, []);

  const handleClick = useCallback(() => {
    const gs = stateRef.current;
    if (gs.phase === "title") {
      gs.score = 0; gs.lives = BASE_LIVES; gs.streak = 0; gs.wave = 0;
      gs.multiShot = 0; gs.bulletSize = 1; gs.reloadSpeed = 1;
      gs.piercingShots = false; gs.timeWarp = false; gs.doublePoints = false;
      ducksRef.current      = [];
      particlesRef.current  = [];
      startWave();
      return;
    }
    if (gs.phase === "gameover") { gs.phase = "title"; syncUI(); return; }
    if (gs.phase === "playing")  { shoot(); }
  }, [startWave, shoot, syncUI]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: "min(800px, 100vw)", aspectRatio: "800/500" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full h-full block cursor-none"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />

        {phase === "title" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-center px-6">
            <h1 className="text-5xl font-black mb-2 tracking-tight">
              <span className="text-green-400">DUCK</span>{" "}
              <span className="text-yellow-400">HUNT</span>
            </h1>
            <p className="text-zinc-400 mb-1 text-sm uppercase tracking-widest">Roguelike Edition</p>
            <p className="text-zinc-300 mb-8 max-w-xs text-sm">
              Survive waves of ducks. Choose upgrades between rounds. How far can you go?
            </p>
            {highScore > 0 && (
              <p className="text-yellow-400 mb-4 font-mono text-sm">HIGH SCORE: {highScore.toLocaleString()}</p>
            )}
            <button
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-lg transition-colors cursor-pointer"
              onClick={handleClick}
            >
              CLICK TO START
            </button>
          </div>
        )}

        {phase === "upgrade" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center px-6">
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-1">Wave {wave} clear!</p>
            <h2 className="text-3xl font-black mb-6">Choose an upgrade</h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {perks.map((perk) => (
                <button
                  key={perk.id}
                  onClick={() => applyPerk(perk)}
                  className="w-44 p-5 rounded-2xl border border-zinc-700 bg-zinc-900 hover:border-violet-500 hover:bg-violet-950 transition-all cursor-pointer flex flex-col items-center gap-2 group"
                >
                  <span className="text-3xl">{perk.icon}</span>
                  <span className="font-bold text-sm group-hover:text-violet-400 transition-colors">{perk.name}</span>
                  <span className="text-xs text-zinc-400">{perk.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center px-6">
            <h2 className="text-5xl font-black mb-2 text-red-500">GAME OVER</h2>
            <p className="text-zinc-400 mb-1">Wave {wave}</p>
            <p className="text-3xl font-mono mb-2">{score.toLocaleString()} pts</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 text-sm mb-4">✦ New High Score!</p>
            )}
            <p className="text-zinc-500 text-sm mb-8">Click anywhere to return to title</p>
            <button
              className="px-8 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-full text-lg transition-colors cursor-pointer"
              onClick={handleClick}
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-zinc-600 text-xs">kaisplace.com — click to shoot</p>
    </div>
  );
}


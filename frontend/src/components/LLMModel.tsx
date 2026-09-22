import { useEffect, type CSSProperties } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export type RobotPhase = 'idle' | 'thinking' | 'tool' | 'content' | 'done' | 'error';
// div + CSS 로봇 캐릭터. 챗봇 활동 상태(RobotPhase)에 따라 포즈를 취한다.
//  idle=심심함(두리번/깜빡/하품), thinking=턱 괴고 갸웃, tool=일어나 팻말 흔들기,
//  content=말하기, done=엄지척+점프, error=빨강 진동.
// 팔·팻말·눈·입은 transform 애니메이션만 써서 GPU 부담이 적다. 큰 정적 스타일이라 1회 주입.

interface Props {
  state?: RobotPhase;
  size?: number; // 로봇 높이(px). 기본 48. base 120x150 을 size/150 로 스케일.
}

let injected = false;
function injectRobotStyles() {
  if (injected || typeof document === 'undefined') {
    return;
  }
  injected = true;
  const s = document.createElement('style');
  s.setAttribute('data-tara-robot', '');
  s.textContent = ROBOT_CSS;
  document.head.appendChild(s);
}

const LLMModel = ({ state = 'idle', size = 48 }: Props) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  useEffect(() => {
    injectRobotStyles();
  }, []);

  const rs = size / 150;
  const base = isDark
    ? {
        metal: '#e0e8f8',
        metalSh: '#5677b8',
        accent: '#5bc1ff',
        eye: '#5bfff9',
        face: '#10203adb',
        shadow: 'rgba(0, 0, 0, 0.75)',
      }
    : {
        metal: '#fff',
        metalSh: '#738ece',
        accent: '#2887dc',
        eye: '#9bfff2',
        face: '#204e773d',
        shadow: 'rgba(20, 30, 60, 0.22)',
      };

  // 상태별로 몸체 금속색(--tr-metal-sh)에 살짝 다른 톤을 섞는다 — tool=골드, error=레드, thinking=블루.
  const STATE_TINT: Partial<Record<RobotPhase, string>> = {
    tool: '#f8bc24',
    error: '#ff5a52',
    thinking: base.accent,
  };
  const tint = STATE_TINT[state];
  const metalSh = tint ? (isDark? `color-mix(in srgb, ${base.metalSh} 72%, ${tint} 45%)`:`color-mix(in srgb, ${base.metalSh} 52%, ${tint} 58%)`): base.metalSh;

  const vars = {
    '--tr-metal': base.metal,
    '--tr-metal-sh': metalSh,
    '--tr-accent': base.accent,
    '--tr-eye': base.eye,
    '--tr-face': base.face,
    '--tr-shadow': base.shadow,
  };

  return (
    <div
      className="tara-robot-slot"
      data-theme={isDark ? 'dark' : 'light'}
      style={{zIndex:10, width: 120 * rs, height: 150 * rs, position: 'relative', ...(vars as CSSProperties) }}
    >
      <div
        className="tara-robot-scale"
        style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${rs})`, transformOrigin: 'top left' }}
      >
        <div className="tara-robot-shadow" />
        <div className={`tara-robot ${state}`}>
          <div className="antenna-bar" />
          <div className="antenna-tip" />
          <div className="head">
            <div className="ear l" />
            <div className="ear r" />
            <div className="face" />
            <div className="eye l" />
            <div className="eye r" />
            <div className="mouth" />
          </div>
          <div className="body">
            <div className="chest" />
          </div>
          <div className="arm l">
            <div className="hand" />
          </div>
          <div className="arm r">
            <div className="hand" />
            <div className="sign">
              <div className="sign-stick" />
              <div className="sign-board">TOOL</div>
            </div>
            <div className="thumb">👍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMModel;

const ROBOT_CSS = `
.tara-robot-shadow {
  position: absolute; left: 50%; bottom: -28px; width: 69px; height: 23px; margin-left: -36px;
  border-radius: 50%; background: radial-gradient(closest-side, var(--tr-shadow), transparent 75%);
  pointer-events: none;
}

.tara-robot {
  --busy: #f6c344; --ok: #34d17a; --crit: #ff5a52;
  position: relative; width: 120px; height: 150px; transform-origin: 50% 92%;
}
.tara-robot-slot[data-theme='light'] .tara-robot { --busy: #f0ff2f; --ok:#9cff8b; --crit:#db4b44 }

.tara-robot * { position: absolute; box-sizing: border-box; }

.tara-robot .antenna-bar { width: 4px; height: 16px; left: 50%; top: 18px; margin-left: -2px; background: var(--tr-metal-sh); border-radius: 3px; }
.tara-robot .antenna-tip { width: 13px; height: 13px; left: 50%; top: 6px; margin-left: -6.5px; background: var(--tr-accent); border-radius: 50%; box-shadow: 0 0 0 5px color-mix(in srgb, var(--tr-accent) 30%, transparent); }

.tara-robot .head { width: 95px; height: 72px; left: 50%; top: 33px; margin-left: -49px; background: linear-gradient(155deg, var(--tr-metal), var(--tr-metal-sh)); border-radius: 22px; border: 2px solid color-mix(in srgb, var(--tr-metal-sh) 70%, #000 10%); transform-origin: 50% 120%; }
.tara-robot .face { inset: 6px 8px; background: var(--tr-face); border-radius: 15px; box-shadow: inset 0 2px 6px rgba(0,0,0,.5); }
.tara-robot-slot[data-theme='light'] .face {box-shadow:inset 0 2px 5px rgb(0 26 65 / 37%) }
.tara-robot .eye {width: 9px; height: 11px; top: 28px; background: var(--tr-eye); border-radius: 50%; box-shadow: none; transition: all .18s; }
.tara-robot .eye.l { left: 22px; } .tara-robot .eye.r { right: 22px; }
.tara-robot-slot[data-theme='dark'] .eye { box-shadow: 0 0 8px color-mix(in srgb, var(--tr-eye) 70%, transparent); }
.tara-robot-slot[data-theme='light'] .eye { }
.tara-robot .mouth { width: 14px; height: 5px; left: 50%; margin-left: -6px; bottom: 18px; background: var(--tr-eye); border-radius: 3px; opacity: .8; transform-origin: center; }
.tara-robot-slot[data-theme='light'] .mouth {background:#ca7878 }
.tara-robot .ear { width: 9px; height: 19px; top: 25px; background: var(--tr-metal-sh); border-radius: 4px; }
.tara-robot .ear.l { left: -9px; } .tara-robot .ear.r { right: -9px; }

.tara-robot .body { width: 52px; height: 45px; left: 50%; bottom: 1px; margin-left: -27px; background: linear-gradient(160deg, var(--tr-metal), var(--tr-metal-sh)); border-radius: 21px 21px 14px 14px; border: 2px solid color-mix(in srgb, var(--tr-metal-sh) 70%, #000 10%); }
.tara-robot .chest { width: 26px; height: 26px; left: 50%; top: 8px; margin-left: -13px; background: var(--tr-face); border-radius: 8px; }
.tara-robot .chest::after { content:""; position:absolute; inset: 7px; border-radius: 50%; background: var(--tr-accent); box-shadow: 0 0 8px color-mix(in srgb, var(--tr-accent) 60%, transparent); }

.tara-robot .arm { width: 11px; height: 24px; top: 112px; background: var(--tr-metal-sh); border-radius: 6px; transform-origin: 50% 6px; }
.tara-robot .arm.l { left: 50%; margin-left: -33px; transform: rotate(17deg); }
.tara-robot .arm.r { left: 50%; margin-left: 20px; transform: rotate(-17deg); }
.tara-robot .hand { width: 15px; height: 15px; left: 50%; bottom: -6px; margin-left: -7.5px; background: var(--tr-metal); border-radius: 50%; border: 2px solid var(--tr-metal-sh); }

.tara-robot .sign { left: 50%; bottom: -2px; margin-left: -3px; opacity: 0; transform: scale(.4); transform-origin: 50% 100%; transition: opacity .2s, transform .2s; }
.tara-robot .sign-stick { width: 5px; height: 30px; background: #7a5a34; border-radius: 3px; left: 0; top: 0; }
.tara-robot .sign-board { width: 46px; height: 28px; left: -20px; top: -24px; background: var(--busy); border-radius: 7px; border: 2px solid #b98a2a; display: flex; align-items:center; justify-content:center; font: 900 13px/1 system-ui, sans-serif; letter-spacing: .5px; color: #6a4a08; }

.tara-robot .thumb { left: 50%; bottom: -21px; margin-left: -18px; font-size: 28px; opacity: 0; transform: scale(.3); transition: opacity .2s, transform .2s; }

@keyframes tr-bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }

/* IDLE */
.tara-robot.idle { animation: tr-idleFloat 4s ease-in-out infinite; }
.tara-robot.idle .head { animation: tr-lazyLoll 6s ease-in-out infinite; }
.tara-robot.idle .body { transform: rotate(348deg) }
.tara-robot.idle .antenna-bar { margin-left:-16.5px }
.tara-robot.idle .antenna-tip { margin-left:-20.5px }
.tara-robot.idle .eye { animation: tr-boredEyes 7s ease-in-out infinite; }
.tara-robot.idle .mouth { animation: tr-boredMouth 7s ease-in-out infinite; }
.tara-robot.idle .arm.l { animation: tr-armSwayL 6s ease-in-out infinite; }
.tara-robot.idle .arm.r { animation: tr-armSwayR 6.2s ease-in-out infinite; }
@keyframes tr-idleFloat { 0%,100%{ transform: translateY(0) rotate(-1.5deg);} 50%{ transform: translateY(-5px) rotate(1.5deg);} }
@keyframes tr-lazyLoll { 0%,100%{ transform: rotate(347deg);} 50%{ transform: rotate(344degdeg);} }
@keyframes tr-boredEyes {
  0%, 9% { transform: translateX(0) scaleY(1); }
  12% { transform: translateX(0) scaleY(.1); }
  15%, 36% { transform: translateX(-2px) scaleY(1); }
  40%, 47% { transform: translateX(0) scaleY(.25); } /* 하품: 입 벌어지는 타이밍(40~47%)에 눈도 같이 감김 */
  52%, 61% { transform: translateX(2px) scaleY(1); }
  64% { transform: translateX(2px) scaleY(.1); }
  67%, 89% { transform: translateX(0) scaleY(1); }
  92% { transform: translateX(0) scaleY(.1); }
  100% { transform: translateX(0) scaleY(1); }
}
@keyframes tr-boredMouth { 0%,34%,52%,100%{ transform: scaleY(1);} 40%,47%{ transform: scaleY(3.2) scaleX(.75);} }
@keyframes tr-armSwayL { 0%,100%{ transform: rotate(17deg);} 50%{ transform: rotate(44deg);} }
@keyframes tr-armSwayR { 0%,100%{ transform: rotate(-17deg);} 50%{ transform: rotate(-44deg);} }

/* THINKING */
.tara-robot.thinking { animation: tr-bob 4s ease-in-out infinite; }
.tara-robot.thinking .head { animation: tr-tilt 3s ease-in-out infinite; }
.tara-robot.thinking .mouth { bottom: 22px}
.tara-robot.thinking .arm.r { transform: rotate(-152deg); }
.tara-robot.thinking .arm.r .hand { transform: translate(5px, 3px); }
.tara-robot.thinking .eye { transform: translateY(-1px) scaleY(.3); }
@keyframes tr-tilt { 0%,100%{ transform: rotate(0);} 50%{ transform: rotate(7deg);} }

.tara-robot .thinking-label { left: 50%; top: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none; z-index: 5; }
.tara-robot .thinking-label span{ font-weight:600; position:unset}
.tara-robot-slot[data-theme='light'] .tara-robot .thinking-label {background:#31849763; padding:0px 10px; border:2px solid #d3feff}
/* TOOL */
.tara-robot.tool { animation: tr-standbob 1.1s ease-in-out infinite; }
.tara-robot.tool .arm.r { transform: rotate(-125deg); animation: tr-wavearm .7s ease-in-out infinite; }
.tara-robot.tool .arm.r .sign { opacity: 1; transform: scale(1); }
/* 팔이 -125도 회전하므로 글자가 뒤집힌다 → 보드를 +132도 카운터-회전해 글씨를 똑바로 세운다. */
.tara-robot.tool .arm.r .sign .sign-board { transform: rotate(132deg); }
.tara-robot.tool .arm.l { transform: rotate(53deg); animation: tr-armSwayL 3.6s ease-in-out infinite;}
.tara-robot.tool .eye { background: var(--busy); box-shadow: 0 0 8px var(--busy); }
.tara-robot-slot[data-theme='light'] .tara-robot.tool .face {background:#75721045; box-shadow:inset 0 2px 5px rgb(65 24 0 / 37%) }
.tara-robot-slot[data-theme='dark'] .tara-robot.tool .mouth {background:#efa635}

@keyframes tr-standbob { 0%,100%{ transform: translateY(-4px);} 50%{ transform: translateY(-9px);} }
@keyframes tr-wavearm { 0%,100%{ transform: rotate(-125deg);} 50%{ transform: rotate(-140deg);} }

/* CONTENT */
.tara-robot.content { animation: tr-bob 2.4s ease-in-out infinite; }
.tara-robot.content .mouth { animation: tr-talk .32s ease-in-out infinite; }
.tara-robot.content .head { animation: tr-nod 1s ease-in-out infinite; }
.tara-robot.content .eye {top:26px}
.tara-robot.content .mouth {bottom:24px}
.tara-robot.content .arm.l { animation: tr-armSwayL 3s ease-in-out infinite; }
.tara-robot.content .arm.r { animation: tr-armSwayR 3s ease-in-out infinite; }
@keyframes tr-talk { 0%,100%{ transform: scaleY(.5);} 50%{ transform: scaleY(1.9);} }
@keyframes tr-nod { 0%,100%{ transform: rotate(-2deg);} 50%{ transform: rotate(3deg);} }

/* DONE */
.tara-robot.done { animation: tr-cheer .7s ease-out; }
.tara-robot.done .arm.r { transform: rotate(-135deg); }
.tara-robot.done .arm.r .thumb { opacity: 1; transform: scale(1); }
.tara-robot.done .arm.l { transform: rotate(30deg); }
.tara-robot.done .eye { background: var(--ok); box-shadow: 0 0 10px var(--ok); }
.tara-robot.done .eye.l {height:33px; width:13px; height:4px; left:21px; top:33px}
.tara-robot.done .arm.l { animation: tr-armSwayL 2s ease-in-out infinite; }
.tara-robot.done .antenna-tip { background: var(--ok); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 35%, transparent); }
.tara-robot.done .chest::after { background:none;}

.tara-robot-slot[data-theme='dark'] .tara-robot.done .chest {background:#1e4d3394;}
@keyframes tr-cheer { 0%{ transform: translateY(0);} 35%{ transform: translateY(-22px) scale(1.05);} 70%{ transform: translateY(0);} 85%{ transform: translateY(-6px);} 100%{ transform: translateY(0);} }

/* ERROR */
.tara-robot.error { animation: tr-shake .4s ease-in-out infinite; }
.tara-robot.error .eye {width:8px; background: var(--crit); box-shadow: 0 0 12px var(--crit); transform: scale(1.25); }
.tara-robot-slot[data-theme='light'] .tara-robot.error .eye{width:6px; height:10px; background:#ffc9c6}
.tara-robot.error .head {background: linear-gradient(155deg, var(--tr-metal), var(--tr-metal-sh))}
.tara-robot.error .mouth { width: 14px; height: 14px; border-radius: 50%; margin-left: -7px; background: var(--crit); }
.tara-robot.error .antenna-tip { background: var(--crit); box-shadow: 0 0 0 3px color-mix(in srgb, var(--crit) 35%, transparent); }
.tara-robot.error .body{bottom:8px}
.tara-robot.error .arm {height: 26px; top:109px}
.tara-robot.error .arm.l {margin-left:-30px; transform:rotate(208deg)}
.tara-robot.error .arm.r {margin-left:18px; transform:rotate(156deg)}
.tara-robot.error .chest::after {content:"🚫"; inset:2px; background:none;}
.tara-robot-slot[data-theme='light'] .tara-robot.error .face {background:#8b000040; box-shadow:inset 0 2px 5px rgb(65 0 0 / 37%) }
@keyframes tr-shake { 0%,100%{ transform: translateX(0) rotate(0);} 25%{ transform: translateX(-5px) rotate(-3deg);} 75%{ transform: translateX(5px) rotate(3deg);} }

@media (prefers-reduced-motion: reduce) {
  .tara-robot, .tara-robot * { animation: none !important; }
}
`;

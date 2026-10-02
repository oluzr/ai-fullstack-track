// AppTheme은 아래 lightTheme 객체의 실제 모양에서 자동으로 뽑아낸 타입이다(파일
// 맨 아래 `export type AppTheme = typeof lightTheme` 참고). 그래서 색을 새로
// 추가할 때 여기 타입을 손으로 고칠 필요 없이, lightTheme/darkTheme 두 군데에만
// 값을 넣으면 된다 — darkTheme 쪽에 깜빡하고 안 넣으면 그때 TS가 알려준다.

const font = {
  base: `Pretendard, "Pretendard Variable", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif`,
  mono: `'JetBrains Mono', Pretendard, sans-serif`,
};

const radius = {
  xs: "9px",
  sm: "11px",
  md: "14px",
  lg: "18px",
  xl: "22px",
  xxl: "28px",
  pill: "99px",
};

const shadow = {
  sheet: "0 30px 70px -40px rgba(19,45,70,0.55)",
  activeNav: "0 6px 18px -12px rgba(23,60,92,0.6)",
  cta: "0 14px 28px -16px rgba(20,160,140,0.5)",
};

const logoGradient = "linear-gradient(140deg,#34d8ac,#6f8cf7)";
const gaugeFillGradient = "linear-gradient(90deg,#34d8ac,#5b8def)";

export const lightTheme = {
  name: "light" as "light" | "dark",
  font,
  color: {
    ink: "#0f172a",
    ink2: "#3e4c5f",
    ink3: "#4d5d70",
    ink4: "#76869a",
    acc: "#0b7a63",
    btn: "#0f172a",
    error: "#c0392b",
    fontMain: "#000",
  },
  surface: {
    body: "#e6eaed",
    page: "rgba(255, 255, 255, 0.3)",
    glow: "none",
    glass1: "rgba(255,255,255,0.26)",
    glass2: "rgba(255,255,255,0.46)",
    glass3: "rgba(255,255,255,0.56)",
    glass5: "rgba(255,255,255,0.72)",
    glass6: "rgba(255,255,255,0.82)",
    solid: "rgba(255, 255, 255, 0.54)",
    code: "rgba(13,26,43,0.9)",
    overlay: "rgba(243, 244, 247, 0.56)",
    field: "rgba(255,255,255,0.5)",
    explainBody: "#38d2b229",
    mainBody: "#bad8ff05",
    sideActive: "rgb(233 236 239)",
  },
  border: {
    bd1: "rgba(255,255,255,0.62)",
    bd2: "rgba(255,255,255,0.99)",
    bd3: "rgb(118 183 187)",
    line: "rgba(120,150,150,0.2)",
    fieldbd: "rgba(56, 59, 59, 0.28)",
    seg: "rgba(255,255,255,0.4)",
    track: "rgba(120, 150, 150, 0.06)",
  },
  gradient: {
    art: "linear-gradient(118deg, #FFFFFFEB, #8fc3b4 48%, #FFFD9D97, #44caa3 100%)",
    cta: "linear-gradient(135deg,#25cfa0,#14a3c7)",
    bubble: "linear-gradient(135deg,#25cfa0,#2f8ce0)",
    logo: logoGradient,
    gaugeFill: gaugeFillGradient,
  },
  radius,
  shadow,
};

export type AppTheme = typeof lightTheme;

export const darkTheme: AppTheme = {
  name: "dark",
  font,
  color: {
    ink: "#f4f2fb",
    ink2: "#d3cee6",
    ink3: "#a9a2c4",
    ink4: "#8a83a8",
    acc: "#7cf0cd",
    btn: "#7676ff",
    error: "#ff6b5b",
    fontMain: "#fff",
  },
  surface: {
    body: "#120f1c",
    page: "rgba(6, 1, 26, 0.37)",
    glow: "radial-gradient(620px 380px at 88% -8%, rgba(150,120,255,0.30), transparent 62%), radial-gradient(560px 420px at -6% 70%, rgba(110,80,210,0.26), transparent 62%)",
    glass1: "rgba(255,255,255,0.01)",
    glass2: "linear-gradient(346deg, #ffe4e414, #ffffff00)",
    glass3: "rgba(255,255,255,0.08)",
    glass5: "rgba(255,255,255,0.11)",
    glass6: "rgba(255,255,255,0.14)",
    solid: "rgba(42,34,68,0.72)",
    code: "rgba(12,9,22,0.55)",
    overlay: "rgba(4, 2, 10, 0.65)",
    field: "rgba(255,255,255,0.07)",
    explainBody: "rgb(229 158 251 / 11%)",
    mainBody: "#bad8ff05",
    sideActive: "rgb(155 117 155 / 18%)",
  },
  border: {
    bd1: "rgba(255,255,255,0.10)",
    bd2: "rgba(255,255,255,0.16)",
    bd3: "rgb(151 138 255 / 88%)",
    line: "rgba(255,255,255,0.12)",
    fieldbd: "rgba(255,255,255,0.16)",
    seg: "rgba(255,255,255,0.07)",
    track: "rgba(255,255,255,0.18)",
  },
  gradient: {
    art: "radial-gradient(60% 55% at 78% 10%, rgba(146,112,255,0.45), transparent 66%), radial-gradient(55% 50% at 10% 90%, rgba(104,68,196,0.38), transparent 64%), linear-gradient(140deg, #14101f 0%, #241a3c 46%, #3b2663 100%)",
    cta: "linear-gradient(135deg,#3ddcb4,#4f7fe8)",
    bubble: "linear-gradient(135deg,#8b6cf0,#5a4bd6)",
    logo: logoGradient,
    gaugeFill: gaugeFillGradient,
  },
  radius,
  shadow,
};

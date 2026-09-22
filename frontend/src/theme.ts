export type AppTheme = {
  name: 'light' | 'dark'
  font: {
    base: string
    mono: string
  }
  color: {
    ink: string
    ink2: string
    ink3: string
    ink4: string
    acc: string
    btn: string
    error: string
  }
  surface: {
    body: string
    page: string
    glow: string
    glass2: string
    glass3: string
    glass5: string
    glass6: string
    solid: string
    code: string
  }
  border: {
    bd1: string
    bd2: string
    line: string
    fieldbd: string
    seg: string
    track: string
  }
  gradient: {
    art: string
    cta: string
    bubble: string
    logo: string
    gaugeFill: string
  }
  radius: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
    pill: string
  }
  shadow: {
    sheet: string
    activeNav: string
    cta: string
  }
}

const font = {
  base: `Pretendard, "Pretendard Variable", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif`,
  mono: `'JetBrains Mono', Pretendard, sans-serif`,
}

const radius = {
  xs: '9px',
  sm: '11px',
  md: '14px',
  lg: '18px',
  xl: '22px',
  xxl: '28px',
  pill: '99px',
}

const shadow = {
  sheet: '0 30px 70px -40px rgba(19,45,70,0.55)',
  activeNav: '0 6px 18px -12px rgba(23,60,92,0.6)',
  cta: '0 14px 28px -16px rgba(20,160,140,0.5)',
}

const logoGradient = 'linear-gradient(140deg,#34d8ac,#6f8cf7)'
const gaugeFillGradient = 'linear-gradient(90deg,#34d8ac,#5b8def)'

export const lightTheme: AppTheme = {
  name: 'light',
  font,
  color: {
    ink: '#0f172a',
    ink2: '#3e4c5f',
    ink3: '#4d5d70',
    ink4: '#76869a',
    acc: '#0b7a63',
    btn: '#0f172a',
    error: '#c0392b',
  },
  surface: {
    body: '#e6eaed',
    page: 'rgba(255,255,255,0.58)',
    glow: 'none',
    glass2: 'rgba(255,255,255,0.46)',
    glass3: 'rgba(255,255,255,0.56)',
    glass5: 'rgba(255,255,255,0.72)',
    glass6: 'rgba(255,255,255,0.82)',
    solid: 'rgba(255,255,255,0.9)',
    code: 'rgba(13,26,43,0.9)',
  },
  border: {
    bd1: 'rgba(255,255,255,0.62)',
    bd2: 'rgba(255,255,255,0.9)',
    line: 'rgba(120,150,150,0.2)',
    fieldbd: 'rgba(120,150,150,0.28)',
    seg: 'rgba(255,255,255,0.4)',
    track: 'rgba(120,150,150,0.3)',
  },
  gradient: {
    art: 'linear-gradient(118deg, #FFFFFFEB, #8fc3b4 48%, #FFFD9D97, #44caa3 100%)',
    cta: 'linear-gradient(135deg,#25cfa0,#14a3c7)',
    bubble: 'linear-gradient(135deg,#25cfa0,#2f8ce0)',
    logo: logoGradient,
    gaugeFill: gaugeFillGradient,
  },
  radius,
  shadow,
}

export const darkTheme: AppTheme = {
  name: 'dark',
  font,
  color: {
    ink: '#f4f2fb',
    ink2: '#d3cee6',
    ink3: '#a9a2c4',
    ink4: '#8a83a8',
    acc: '#7cf0cd',
    btn: '#7676ff',
    error: '#ff6b5b',
  },
  surface: {
    body: '#120f1c',
    page: 'rgba(26,20,44,0.46)',
    glow:
      'radial-gradient(620px 380px at 88% -8%, rgba(150,120,255,0.30), transparent 62%), radial-gradient(560px 420px at -6% 70%, rgba(110,80,210,0.26), transparent 62%)',
    glass2: 'rgba(255,255,255,0.06)',
    glass3: 'rgba(255,255,255,0.08)',
    glass5: 'rgba(255,255,255,0.11)',
    glass6: 'rgba(255,255,255,0.14)',
    solid: 'rgba(42,34,68,0.72)',
    code: 'rgba(12,9,22,0.55)',
  },
  border: {
    bd1: 'rgba(255,255,255,0.10)',
    bd2: 'rgba(255,255,255,0.16)',
    line: 'rgba(255,255,255,0.12)',
    fieldbd: 'rgba(255,255,255,0.16)',
    seg: 'rgba(255,255,255,0.07)',
    track: 'rgba(255,255,255,0.18)',
  },
  gradient: {
    art:
      'radial-gradient(60% 55% at 78% 10%, rgba(146,112,255,0.45), transparent 66%), radial-gradient(55% 50% at 10% 90%, rgba(104,68,196,0.38), transparent 64%), linear-gradient(140deg, #14101f 0%, #241a3c 46%, #3b2663 100%)',
    cta: 'linear-gradient(135deg,#3ddcb4,#4f7fe8)',
    bubble: 'linear-gradient(135deg,#8b6cf0,#5a4bd6)',
    logo: logoGradient,
    gaugeFill: gaugeFillGradient,
  },
  radius,
  shadow,
}

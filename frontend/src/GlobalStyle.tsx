import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;
  }

  body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.text};
    transition: background 0.2s, color 0.2s;
  }

  h1 {
    font-size: 1.5rem;
  }
`

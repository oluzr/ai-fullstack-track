import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;
  }

  html, body {
    margin: 0;
    min-height: 100%;
    background: ${(p) => p.theme.surface.body};
    background-attachment: fixed;
  }

  body {
    font-family: ${(p) => p.theme.font.base};
    color: ${(p) => p.theme.color.ink};
    transition: background 0.2s, color 0.2s;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

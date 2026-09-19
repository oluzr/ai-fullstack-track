import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { GlobalStyle } from "./GlobalStyle";
import { useThemeStore } from "./store/useThemeStore";
import { darkTheme, lightTheme } from "./theme";

const queryClient = new QueryClient();

function Root() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

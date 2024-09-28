import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import Theme from "../components/Theme";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Theme>
    </QueryClientProvider>
  );
}

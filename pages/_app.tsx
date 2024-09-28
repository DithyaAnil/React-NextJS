import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import Dashboard from "../components/Dashboard";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Dashboard>
    </QueryClientProvider>
  );
}

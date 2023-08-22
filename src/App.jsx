import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import { auth } from "./firebase";
import Router from "./shared/Router";
import { GlobalStyle } from "./shared/GlobalStyle";
import useAuthStore from "./store/auth";
import { onAuthStateChanged } from "firebase/auth";

const queryClient = new QueryClient();

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Router />
    </QueryClientProvider>
  );
}

export default App;

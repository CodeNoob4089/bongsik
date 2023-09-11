import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import { auth, db } from "./firebase";
import Router from "./shared/Router";
import { GlobalStyle } from "./shared/GlobalStyle";
import useAuthStore from "./store/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "@firebase/firestore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser?.uid));

        if (userDoc.exists()) {
          setUser({ ...authUser, ...userDoc.data() });
        } else {
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Router />
    </QueryClientProvider>
  );
}

export default App;

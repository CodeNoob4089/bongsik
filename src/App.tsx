import { QueryClient, QueryClientProvider } from 'react-query'
import Router from './shared/Router'
import { GlobalStyle } from './shared/GlobalStyle'

const queryClient = new QueryClient

const App:React.FC = () => {
  return (

  <QueryClientProvider client={queryClient}>
    <GlobalStyle />
    <Router/>
    </QueryClientProvider>

    
  )
}

export default App
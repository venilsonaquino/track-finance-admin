import { AuthProvider } from '@/context'
import AllRoutes from '@/routes/Routes'
import { Toaster } from 'sonner'

function App() {
  return (
    <AuthProvider>
      <AllRoutes />
      <Toaster richColors />
    </AuthProvider>
  )
}

export default App

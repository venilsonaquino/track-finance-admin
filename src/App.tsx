import { AuthProvider } from '@/context'
import AllRoutes from '@/routes/Routes'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <AllRoutes />
      <Toaster />
    </AuthProvider>
  )
}

export default App

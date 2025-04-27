import { AuthProvider } from '@/context'
import { ThemeProvider } from '@/context/theme-context'
import AllRoutes from '@/routes/Routes'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AllRoutes />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

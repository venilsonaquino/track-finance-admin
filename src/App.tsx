import { AuthProvider } from '@/context'
import { ThemeProvider } from '@/context/theme-context'
import { SidebarProvider } from '@/layout/LeftSidebar'
import AllRoutes from '@/routes/Routes'
import { Toaster } from 'sonner'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <AllRoutes />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

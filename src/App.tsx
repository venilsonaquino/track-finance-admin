import { AuthProvider, useAuthContext } from '@/context'
import { ThemeProvider } from '@/context/theme-context'
import { SidebarProvider } from '@/layout/LeftSidebar'
import AllRoutes from '@/routes/Routes'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { registerTokenUpdateCallback } from '@/api/httpClient'

// Componente que registra o callback para atualização de token
function TokenRefreshHandler() {
  const { updateToken } = useAuthContext()
  
  useEffect(() => {
    // Registrar o callback para atualização de token
    registerTokenUpdateCallback(updateToken)
  }, [updateToken])
  
  return null
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TokenRefreshHandler />
        <SidebarProvider>
          <AllRoutes />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

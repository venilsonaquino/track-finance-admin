import { Suspense, lazy, type ReactNode, useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const Footer = lazy(() => import('@/layout/Footer'));
const LeftSideBar = lazy(() => import('@/layout/LeftSidebar'));
const TopNavbar = lazy(() => import('@/layout/TopNavbar'));

const Layout = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const FallbackLoader = <Progress value={progress} />;

  return (
    <Suspense fallback={FallbackLoader}>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Suspense fallback={<div />}>
            <LeftSideBar />
          </Suspense>
          <div className="page-wrapper flex-1 flex flex-col">
            <Suspense fallback={<div />}>
              <TopNavbar />
            </Suspense>
            <div className="page-content flex-1 overflow-auto">
              <div className="container-fluid p-4">
                <div className="breadcrumb-container py-2">
                  {/* Espaço reservado para breadcrumbs */}
                </div>
                <Suspense fallback={FallbackLoader}>
                  {children}
                </Suspense>
              </div>
            </div>
            <Suspense fallback={<div />}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Layout;

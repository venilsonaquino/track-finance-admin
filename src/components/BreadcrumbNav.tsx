import { ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  title?: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
  subName?: string;
}

const PageBreadcrumbNav = ({ title, subName, children, icon, href }: BreadcrumbItem) => {
	return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                Início
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {href ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={href}>
                    {icon && <span className="mr-1">{icon}</span>}
                    {title}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {subName && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{subName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>
                {icon && <span className="mr-1">{icon}</span>}
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      {subName && <p className="text-muted-foreground">{subName}</p>}
      {children}
    </div>
	)
}

export default PageBreadcrumbNav; 
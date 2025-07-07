import { ChevronRight, Home, HomeIcon } from 'lucide-react';
import React from 'react';

const BreadCrumbHeader = ({
  home = '/dashboard',
  breadcrumbs = []
}) => {
  return (
    <div className="row">
      <div className="col-12">
        <ul className="breadcrumb-list d-flex align-items-center flex-wrap mb-3 p-0">
          {/* Home breadcrumb */}
          <li className="breadcrumb-item d-flex align-items-center">
            <a href={home} className="text-decoration-none d-flex align-items-center">
              <HomeIcon size={16} />
            </a>
          </li>

          {/* Dynamic breadcrumbs */}
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <li className="breadcrumb-separator d-flex align-items-center px-2">
                <ChevronRight size={14} className="text-muted" />
              </li>
              <li className={`breadcrumb-item d-flex align-items-center ${breadcrumb.active ? 'active' : ''}`}>
                <a
                  href={breadcrumb.href}
                  className={`text-decoration-none ${breadcrumb.active ? 'active-link' : ''}`}
                  aria-current={breadcrumb.active ? 'page' : undefined}
                >
                  <span className={`breadcrumb-text ${breadcrumb.active ? 'text-primary fw-semibold' : 'text-secondary'}`}>
                    {breadcrumb.label}
                  </span>
                </a>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default BreadCrumbHeader;
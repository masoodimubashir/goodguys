import React from 'react';

const BreadCrumbHeader = ({
  home = '/dashboard',
  homeIcon = 'iconoir-home-alt',
  breadcrumbs = []
}) => {
  return (
    <div className="row m-1">
      <div className="col-12">
        <ul className="app-line-breadcrumbs mb-3">
          {/* Home breadcrumb */}
          <li>
            <a href={home} className="f-s-14 f-w-500">
              <span><i className={homeIcon}></i></span>
            </a>
          </li>
          
          {/* Dynamic breadcrumbs */}
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className={breadcrumb.active ? 'active' : ''}>
              <a 
                href={breadcrumb.href} 
                className="f-s-14 f-w-500"
              >
                {breadcrumb.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default BreadCrumbHeader;
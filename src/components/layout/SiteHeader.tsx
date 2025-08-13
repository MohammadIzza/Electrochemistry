import Link from 'next/link';
import site from '@content/site';
import MainNav from './MainNav';

export default function SiteHeader() {
  return (
    <header className="relative border-b border-shade-t40 z-20" id="headerMain">
      <div className="bg-shade-t20 py-2 relative z-30 dt:py-3">
        <a id="skip" href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="container flex items-center">
          <div className="content flex items-center w-full">
            <a
              href={site.utilityLink.href}
              className="block uppercase font-medium text-orange-s20 text-12 tracking-utexas dt:text-14"
            >
              {site.utilityLink.label}
            </a>
          </div>
          <div className="hidden dt:flex items-center flex-shrink-0"></div>
        </div>
      </div>
      <div className="container">
        <div className="content py-3 flex items-center tp:py-5 dt:py-6">
          <div className="w-full pr-4 dt:flex-grow dt:w-auto dt:pr-0">
            <Link href="/" rel="home">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
              <img
                className="inline-block w-auto max-w-full tp:max-w-500 h-10 tp:h-15"
                src={site.logo.src}
                data-disable-context-menu=""
                width={site.logo.width}
                height={site.logo.height}
                alt={site.name}
              />
            </Link>
          </div>
          <MainNav items={site.mainNav} />
        </div>
      </div>
    </header>
  );
}

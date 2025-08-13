import { Fragment } from 'react';
import site from '@content/site';
import SmartLink from '@/components/ui/SmartLink';
import FooterShell from './FooterShell';

const linkClass = 'border-b border-transparent hover:border-inherit transition-all';

export default function SiteFooter() {
  const { footer } = site;
  return (
    <FooterShell>
      <div className="bg-shade-s60 text-white antialiased py-8 tp:flex dt:py-16">
        <div className="container tp:flex tp:space-x-8 dt:space-x-16">
          <div className="mb-8 tp:mb-0 tp:w-6/16 dt:w-4/16">
            <div className="flow-relaxed">
              <SmartLink href="/">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
                <img
                  src={site.logo.srcOnDark}
                  alt={site.name}
                  className="inline-block w-auto max-w-full h-auto tp:max-h-18"
                  data-disable-context-menu=""
                  width={site.logo.width}
                  height={site.logo.height}
                />
              </SmartLink>
              <div>
                <a href={footer.loginUrl} className="icon-sign-in-alt-solid inline-flex items-center flex-row-reverse">
                  <span className="font-sans mr-2 hover-underline">Log In</span>
                </a>
              </div>
              <div>
                <a href={footer.helpUrl} className="icon-external-link-regular inline-flex items-center flex-row-reverse">
                  <span className="font-sans mr-2 hover-underline">Get Help</span>
                </a>
              </div>
            </div>
          </div>
          <nav className="tp:w-10/16 dt:w-12/16" aria-label="Footer menu">
            <ul className="flow list-none ml-0 flow-relaxed tp:flow-none tp:grid tp:grid-cols-2 tp:gap-8 tl:grid-cols-3 dt:grid-cols-4 dt:gap-16">
              {footer.nav.map((item) => (
                <li className="flow" key={item.label}>
                  <SmartLink href={item.href!} className={`font-bold ${linkClass}`}>
                    {item.label}
                  </SmartLink>
                  {item.children && (
                    <ul className="flow list-none ml-0">
                      {item.children.map((child) => (
                        <li className="flow" key={child.label}>
                          <SmartLink href={child.href!} className={linkClass}>
                            {child.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="bg-shade-s60 text-white antialiased py-8 tp:flex dt:py-16">
        <div className="container">
          <div className="mb-8 py-5 border-t border-b border-shade-s40">
            <div className="flex">
              <div className="flex items-center justify-center pr-4">
                <span className="text-16 font-medium">Follow Us</span>
              </div>
              <div>
                <ul id="footer-social-sharing-buttons" className="flex list-none m-0 p-0 items-center justify-center space-x-2">
                  {footer.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} className={`icon-rounded ${s.icon} text-24 bg-shade-s40 hover:bg-orange`}>
                        <span className="visually-hidden">{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="text-14 dt:flex">
              <div className="w-full dt:flex dt:w-1/2">
                &copy;{' '}
                <a href={footer.copyright.href} className="border-b border-white mx-1">
                  {footer.copyright.label}
                </a>{' '}
                {new Date().getFullYear()}
              </div>
              <div className="w-full dt:flex dt:justify-end dt:w-1/2">
                {footer.legalLinks.map((link, i) => {
                  const last = i === footer.legalLinks.length - 1;
                  const margin = i === 0 ? 'mr-2' : last ? 'ml-2' : 'mx-2';
                  return (
                    <Fragment key={link.href}>
                      {i > 0 && ' | '}
                      <a href={link.href} className={`border-b border-white ${margin}`}>
                        {link.label}
                      </a>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FooterShell>
  );
}

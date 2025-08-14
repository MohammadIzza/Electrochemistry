import Link from 'next/link';
import type { NavLink } from '@/lib/types';

/** "Home / Parent" trail shown above the page title. */
export default function Breadcrumb({ parent }: { parent: NavLink }) {
  return (
    <nav className="relative overflow-hidden -mb-12 z-10 tp:flex" aria-label="Breadcrumb">
      <div className="w-full bg-white"></div>
      <div className="relative flex-shrink-0 bg-transparent w-site">
        <ol className="breadcrumb | inline-flex h-12 items-center text-14 bg-white pr-6 pl-8">
          <li className="flex items-center">
            <Link
              href="/"
              className="icon-home-lg-alt-solid border-none text-12 text-shade-s40 hidden mb-1 hover:text-orange transition-colors transition-300 tp:block"
            >
              <span className="visually-hidden">Home</span>
            </Link>
            <span className="hidden tp:block px-2" aria-hidden="true">
              /
            </span>
          </li>
          <li className="flex items-center">
            <Link href={parent.href} className="transition-colors transition-300">
              <span className="icon-arrow-left-regular mr-2 tp:hidden" aria-hidden="true"></span>
              {parent.label}
            </Link>
          </li>
        </ol>
      </div>
      <div className="w-full bg-transparent"></div>
    </nav>
  );
}

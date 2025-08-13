import type { Metadata } from 'next';
import site from '@content/site';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import AutoSizes from '@/components/ui/AutoSizes';
import Lightbox from '@/components/ui/Lightbox';
import '@/styles/theme.css';
import '@/styles/custom.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: 'website' },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full overflow-x-hidden">
      <body className="font-sans font-normal text-16 text-charcoal h-full w-full relative overflow-x-hidden border-t-6 border-orange">
        <div className="flex flex-col min-h-full">
          <SiteHeader />
          <div className="container"></div>
          {children}
          <SiteFooter />
        </div>
        <Lightbox />
        <AutoSizes />
      </body>
    </html>
  );
}

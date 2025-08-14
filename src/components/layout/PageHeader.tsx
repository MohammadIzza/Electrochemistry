import ResponsiveBackground from '@/components/ui/ResponsiveBackground';
import type { PageHeaderVariant } from '@/lib/types';

interface PageHeaderProps {
  title: string;
  intro?: string;
  eyebrow?: string;
  image?: string;
  variant?: PageHeaderVariant;
  /** Landing pages render the header without bottom margin. */
  landing?: boolean;
  /** Basic pages with a section menu use a tighter bottom margin. */
  hasSidebar?: boolean;
}

/** Title band at the top of landing and basic pages. */
export default function PageHeader({
  title,
  intro,
  eyebrow,
  image,
  variant = image ? 'image' : 'plain',
  landing = false,
  hasSidebar = false,
}: PageHeaderProps) {
  const wrapperClass = landing ? undefined : hasSidebar ? 'dt:mb-16' : 'mb-4 tp:mb-8 dt:mb-16';
  const introEl = intro !== undefined ? <p className="text-21 tp:text-24">{intro}</p> : null;
  const eyebrowEl = eyebrow ? (
    <div className="text-14 text-blue uppercase tracking-wider font-medium mb-2 tp:text-16">{eyebrow}</div>
  ) : null;

  if (variant === 'gradient') {
    return (
      <div className={wrapperClass}>
        <div className="bg-gradient-orange-to-burnt antialiased relative">
          <div className="dt:container flex-col-reverse">
            <div className="w-full"></div>
            <div className="text-white container self-end dt:pl-0 dt:pr-16 pt-24 pb-10 tl:pt-32 tl:pb-12 dt:pt-36 dt:pb-16">
              {eyebrowEl}
              <h1 className="text-36 font-bold h-ul  h-ul--reverse tp:text-72">{title}</h1>
              {introEl}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const h1Class = intro !== undefined ? 'text-36 font-bold h-ul tp:text-72' : 'text-36 font-bold h-ul h-ul h-ul--no-subhead tp:text-72';

  if (variant === 'image' && image) {
    const padding = hasSidebar
      ? 'pt-12 pb-10 tp:pt-30 tl:pb-12 dt:pt-32 dt:pb-16'
      : 'pt-12 pb-10 tl:pt-18 tl:pb-12 dt:pt-24 dt:pb-16';
    return (
      <div className={wrapperClass}>
        <div className="bg-shade-t30 relative">
          <div className="dt:container flex flex-col tl:flex-row-reverse">
            <ResponsiveBackground image={image} className="w-full bg-cover min-h-2/3vw tl:min-h-0 tl:w-7/16 dt:w-6/16" />
            <div className={`container self-end dt:pl-0 dt:pr-16 ${padding} tl:w-9/16 dt:w-10/16`}>
              {eyebrowEl}
              <h1 className={h1Class}>{title}</h1>
              {introEl}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="bg-shade-t30 relative">
        <div className="dt:container flex-col-reverse">
          <div className="w-full"></div>
          <div className="container self-end dt:pl-0 dt:pr-16 pt-12 pb-10 tl:pt-18 tl:pb-12 dt:pt-24 dt:pb-16">
            {eyebrowEl}
            <h1 className={h1Class}>{title}</h1>
            {introEl}
          </div>
        </div>
      </div>
    </div>
  );
}

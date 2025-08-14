import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHeader from '@/components/layout/PageHeader';
import SectionMenu from '@/components/layout/SectionMenu';
import { renderMdx } from '@/lib/mdx';
import { getSectionMenu } from '@/lib/navigation';
import type { Page } from '@/lib/pages';

/** Renders an MDX page with the layout chosen in its frontmatter. */
export default async function ContentPage({ page }: { page: Page }) {
  const { frontmatter: fm } = page;
  const content = await renderMdx(page.body);
  const menu = fm.sectionMenu ? getSectionMenu(fm.sectionMenu) : [];
  const header = fm.header ?? {};

  if (fm.layout === 'home') {
    return (
      <main id="main-content" className="landing-page flex-1">
        {content}
        <div className="bg-gray-light">
          <div className="container"></div>
        </div>
      </main>
    );
  }

  if (fm.layout === 'landing') {
    return (
      <main id="main-content" className="landing-page flex-1">
        <PageHeader landing title={fm.title} intro={header.intro} image={header.image} variant={header.variant} />
        {menu.length > 0 && (
          <div className="bg-shade-t60 bg-opacity-50 py-4">
            <div className="container">
              <SectionMenu items={menu} variant="horizontal" />
            </div>
          </div>
        )}
        {content}
        <div className="bg-gray-light">
          <div className="container"></div>
        </div>
      </main>
    );
  }

  return (
    <>
    {fm.parent && <Breadcrumb parent={fm.parent} />}
    <main id="main-content" className="flex-1 mb-4 tp:mb-8">
      <PageHeader
        title={fm.title}
        intro={header.intro}
        eyebrow={header.eyebrow}
        image={header.image}
        variant={header.variant}
        hasSidebar={menu.length > 0}
      />
      <div className="dt:container">
        <div className={menu.length > 0 ? 'dt:flex dt:space-x-24' : undefined}>
          {menu.length > 0 && (
            <div id="region-sidebar-left" className="py-4 mb-4 bg-shade-t60 tp:mb-8 dt:w-4/16 dt:bg-white dt:py-0 dt:mb-0">
              <div className="container dt:container--unset">
                <SectionMenu items={menu} />
              </div>
            </div>
          )}
          <article className="dt:w-12/16">
            <div className="container flow text-18 dt:container--unset dt:text-20">
              <div className="copy flow">{content}</div>
            </div>
          </article>
        </div>
      </div>
    </main>
    </>
  );
}

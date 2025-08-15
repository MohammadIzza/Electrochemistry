import type { AnchorHTMLAttributes } from 'react';
import type { MDXComponents } from 'mdx/types';
import Button from '@/components/blocks/Button';
import Callout, { CalloutFancy } from '@/components/blocks/Callout';
import CardGrid, { Card, CardGridIntro } from '@/components/blocks/CardGrid';
import Highlighter from '@/components/blocks/Highlighter';
import HomeHero from '@/components/blocks/HomeHero';
import { Accordion, AccordionItem, ArrowItem, ArrowList } from '@/components/blocks/Lists';
import { Caption, Figure, FloatImage, Gallery, ImageText } from '@/components/blocks/Media';
import Text from '@/components/blocks/Text';
import VideoEmbed from '@/components/blocks/VideoEmbed';
import PeopleList from '@/components/people/PeopleList';
import SmartLink from '@/components/ui/SmartLink';
import { isExternal } from '@/lib/navigation';
import { Table } from './Table';

/** Markdown links: client-side navigation for internal links, an icon for external ones. */
function Anchor({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href) && isExternal(href);
  return (
    <SmartLink href={href} {...rest}>
      {children}
      {external && <span className="is-external"></span>}
    </SmartLink>
  );
}

/** Components available in MDX content files. */
export const mdxComponents: MDXComponents = {
  a: Anchor,
  table: Table,
  Accordion,
  AccordionItem,
  ArrowItem,
  ArrowList,
  Button,
  Callout,
  CalloutFancy,
  Caption,
  Card,
  CardGrid,
  CardGridIntro,
  Figure,
  FloatImage,
  Gallery,
  Highlighter,
  HomeHero,
  ImageText,
  PeopleList,
  Table,
  Text,
  VideoEmbed,
};

import type { ReactNode } from 'react';
import { Prose } from './Text';

/** List where each item is marked with a round arrow icon. */
export function ArrowList({ children }: { children: ReactNode }) {
  return (
    <div className="pt-content-blocks" role="presentation">
      <div role="presentation">
        <ul className="flow mt-4">{children}</ul>
      </div>
    </div>
  );
}

export function ArrowItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex">
      <div className="cursor-default mr-4" aria-hidden="true">
        <div className="flex items-center justify-center font-bold bg-shade-t40 rounded-full h-12 w-12">
          <span className="icon-arrow-right-regular text-20"></span>
        </div>
      </div>
      <Prose className="mt-2">{children}</Prose>
    </li>
  );
}

/** Group of collapsible panels. */
export function Accordion({ children }: { children: ReactNode }) {
  return (
    <div className="pt-content-blocks" role="presentation">
      <div role="presentation">
        <div className="mb-8 dt:mb-12">{children}</div>
      </div>
    </div>
  );
}

export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded overflow-hidden">
      <summary className="font-bold p-4 pr-12 border-b border-shade-t60 w-full text-left relative flex items-center bg-white cursor-pointer transition-transform hover:bg-shade-t20 hover:text-orange">
        {title}
      </summary>
      <div className="bg-white border-b border-shade-t60 py-2 tp:py-4" role="presentation">
        <Prose>{children}</Prose>
      </div>
    </details>
  );
}

import type { ReactNode } from 'react';
import { Prose } from './Text';

/** Centered text on a tinted panel, e.g. the newsletter sign-up on the home page. */
export default function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-content-blocks my-6 tp:my-12 dt:my-16 container" role="presentation">
      <div className="py-6 tp:py-12 dt:py-16 container px-8 dt:px-20 bg-shade-t20" role="presentation">
        <div>
          <div className="text-18 leading-relaxed container flow tp:text-22">
            <Prose className="m-auto max-w-prose">{children}</Prose>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Decorated call-out box inside rich text (e.g. "Program schedule"). */
export function CalloutFancy({ children }: { children: ReactNode }) {
  return (
    <div className="callout-fancy">
      <div className="callout-fancy__content">{children}</div>
    </div>
  );
}

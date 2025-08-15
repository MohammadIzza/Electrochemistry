import type { ReactNode } from 'react';

/** Rich-text wrapper: theme typography for Markdown content. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `formatted flow ${className}` : 'formatted flow'}>{children}</div>;
}

interface TextProps {
  children: ReactNode;
  /** Adds vertical spacing around the block. */
  spaced?: boolean;
  id?: string;
}

/** A block of Markdown text. */
export default function Text({ children, spaced = false, id }: TextProps) {
  return (
    <div id={id} className={spaced ? 'pt-content-blocks my-6 tp:my-12 dt:my-16' : 'pt-content-blocks'} role="presentation">
      <div role="presentation">
        <Prose>{children}</Prose>
      </div>
    </div>
  );
}

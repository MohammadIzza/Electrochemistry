import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import '@/styles/tablesaw.css';

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

function childrenOf(node: ReactNode): ReactNode[] {
  return isValidElement(node) ? Children.toArray((node as ElementWithChildren).props.children) : [];
}

function mapChildren(node: ReactNode, fn: (child: ReactNode, index: number) => ReactNode): ReactNode {
  if (!isValidElement(node)) return node;
  return cloneElement(node as ElementWithChildren, { children: childrenOf(node).map(fn) });
}

/**
 * Markdown table. Tables with a header row become Tablesaw "stack" tables: on
 * small screens each cell shows its column heading, like the Drupal Tablesaw module.
 * Tables without a header row render unchanged.
 */
export function Table({ children }: { children?: ReactNode }) {
  const sections = Children.toArray(children);
  const thead = sections.find((s) => isValidElement(s) && s.type === 'thead');
  if (!thead) return <table>{children}</table>;

  const headerCells = childrenOf(childrenOf(thead)[0]);
  const labels = headerCells.map((th) => (isValidElement(th) ? (th as ElementWithChildren).props.children : null));

  const rendered = sections.map((section) => {
    if (section === thead) {
      return mapChildren(section, (row) =>
        mapChildren(row, (th, i) =>
          isValidElement(th)
            ? cloneElement(th as ReactElement<Record<string, unknown>>, {
                role: 'columnheader',
                ...(i === 0 ? { 'data-tablesaw-priority': 'persist' } : {}),
              })
            : th,
        ),
      );
    }
    if (!isValidElement(section) || section.type !== 'tbody') return section;
    return mapChildren(section, (row) =>
      mapChildren(row, (cell, i) => {
        if (!isValidElement(cell)) return cell;
        return cloneElement(cell as ElementWithChildren, {
          children: (
            <>
              <strong className=" tablesaw-cell-label" aria-hidden="true">
                {labels[i]}
              </strong>{' '}
              <span className="tablesaw-cell-content">{(cell as ElementWithChildren).props.children}</span>
            </>
          ),
        });
      }),
    );
  });

  return (
    <table className="tablesaw tablesaw-stack" data-tablesaw-mode="stack" data-tablesaw-minimap="">
      {rendered}
    </table>
  );
}

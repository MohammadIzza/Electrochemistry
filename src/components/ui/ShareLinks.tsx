'use client';

import { useEffect, useState } from 'react';

interface ShareLinksProps {
  /** Absolute URL of the page being shared. */
  url: string;
  title: string;
}

/** Social share buttons plus a "copy URL" tool. */
export default function ShareLinks({ url, title }: ShareLinksProps) {
  const [copierOpen, setCopierOpen] = useState(false);
  const [copierHidden, setCopierHidden] = useState(true);
  const [toast, setToast] = useState<'hidden' | 'shown' | 'leaving'>('hidden');

  useEffect(() => {
    if (copierOpen) {
      setCopierHidden(false);
      return;
    }
    const t = setTimeout(() => setCopierHidden(true), 300);
    return () => clearTimeout(t);
  }, [copierOpen]);

  const copy = () => {
    if (toast !== 'hidden') return;
    navigator.clipboard.writeText(url).then(
      () => {
        setToast('leaving');
        setTimeout(() => setToast('shown'), 50);
        setTimeout(() => setToast('leaving'), 1500);
        setTimeout(() => setToast('hidden'), 2000);
      },
      () => console.error(`Failed to copy URL to clipboard (Source: ${window.location.href})`),
    );
  };

  const button = 'icon-rounded text-white bg-shade-s40 hover:bg-orange';

  return (
    <>
      <h2 className="text-24 font-bold font-serif">Share</h2>
      <ul id="social-sharing-buttons" className="flex gap-2 tl:grid tl:grid-cols-4 dt:flex dt:gap-2">
        <li>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} className={`icon-facebook-f-brands ${button}`} target="_blank">
            <span className="visually-hidden">Share on Facebook</span>
          </a>
        </li>
        <li>
          <a href={`https://twitter.com/intent/tweet?url=${url}`} className={`icon-twitter-brands ${button}`} target="_blank">
            <span className="visually-hidden">Share on X</span>
          </a>
        </li>
        <li>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} className={`icon-linkedin-in-brands ${button}`} target="_blank">
            <span className="visually-hidden">Share on LinkedIn</span>
          </a>
        </li>
        <li>
          <button
            id="share-url"
            className={`icon-link-regular icon-rounded relative text-white bg-shade-s40 hover:bg-orange${copierOpen ? ' icon-times' : ''}`}
            aria-controls="url-copier-tool"
            aria-expanded={copierOpen}
            onClick={() => setCopierOpen(!copierOpen)}
          >
            <span className="visually-hidden">Show and hide the URL copier tool.</span>
          </button>
        </li>
        <li>
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${url}`} className={`icon-envelope-regular ${button}`}>
            <span className="visually-hidden">Share via email</span>
          </a>
        </li>
      </ul>
      <div
        id="url-copier-tool"
        className={`${copierHidden ? 'hidden ' : ''}transform${copierOpen ? '' : ' translate-x-full'} transition-all duration-300 flex w-full h-10 bg-shade-t20 items-center mt-4 mb-8 border border-charcoal-t40 rounded`}
      >
        <div className="px-4 w-full whitespace-nowrap overflow-x-scroll scrollbar-lite">
          <span id="url-copier-content" className="transform transition-all duration-300">
            {url}
          </span>
        </div>
        <button
          id="url-copier"
          className="icon-copy-regular w-10 h-10 bg-shade-t40 flex-shrink-0 items-center justify-center flex ml-4 border-t border-b border-l border-charcoal-t40 rounded-tr rounded-br hover:bg-orange hover:text-white transition-colors"
          data-url={url}
          onClick={copy}
        >
          <span className="visually-hidden">Copy this page&apos;s URL</span>
        </button>
        {toast !== 'hidden' && (
          <span
            className={`block absolute text-14 font-bold top-full pl-4 mt-2 transform transition-all duration-300${toast === 'leaving' ? ' opacity-0 -translate-y-full' : ''}`}
          >
            URL copied to clipboard
          </span>
        )}
      </div>
    </>
  );
}

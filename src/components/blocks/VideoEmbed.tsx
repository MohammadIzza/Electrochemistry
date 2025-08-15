interface VideoEmbedProps {
  /** Player URL, e.g. `https://player.vimeo.com/video/123` or a YouTube embed URL. */
  src: string;
  title?: string;
  id?: string;
}

/** Responsive 16:9 video player. */
export default function VideoEmbed({ src, title = 'Video player', id }: VideoEmbedProps) {
  return (
    <div id={id} className="pt-content-blocks" role="presentation">
      <div role="presentation">
        <div className="responsive-iframe responsive-iframe--16-9">
          <iframe width="1600" height="900" src={src} title={title} allow="fullscreen; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
}

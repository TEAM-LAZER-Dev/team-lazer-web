// Endlos laufendes Band (reines CSS). Zwei Reihen laufen gegenläufig.
export default function Marquee({ items, reverse = false, outline = false }) {
  const row = (
    <>
      {items.map(t => (
        <span key={t} className="grl-mq-item">
          {t}
          <i className="grl-mq-dot" />
        </span>
      ))}
    </>
  )
  return (
    <div className={`grl-mq${reverse ? ' rev' : ''}${outline ? ' outline' : ''}`} aria-hidden="true">
      <div className="grl-mq-track">
        <div className="grl-mq-set">{row}</div>
        <div className="grl-mq-set">{row}</div>
      </div>
    </div>
  )
}

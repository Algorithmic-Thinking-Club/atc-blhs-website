type SpriteProps = {
  /** path to a horizontal sprite sheet in /public */
  sheet: string;
  /** number of frames in the sheet */
  frames: number;
  /** rendered size of one frame in px */
  size: number;
  className?: string;
  label?: string;
};

/** Plays a horizontal sprite sheet with a CSS steps() animation. */
export default function Sprite({
  sheet,
  frames,
  size,
  className = "",
  label,
}: SpriteProps) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={`sprite-idle ${className}`}
      style={
        {
          backgroundImage: `url(${sheet})`,
          width: size,
          height: size,
          "--frames": frames,
          "--sheet-w": `${frames * size}px`,
        } as React.CSSProperties
      }
    />
  );
}

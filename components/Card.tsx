type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`pixel-border bg-panel p-6 transition-colors duration-150 hover:bg-panel-2 ${className}`}
    >
      {children}
    </div>
  );
}

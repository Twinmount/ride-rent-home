import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  isHero?: boolean;
  align?: 'center' | 'left';
  className?: string;
};

export const SectionHeading = ({
  title,
  subtitle,
  isHero = false,
  align = 'center',
  className = '',
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
<<<<<<< HEAD
        "my-8 flex w-full flex-col gap-y-3",
        align === "center" ? "text-center" : "ml-8 text-left lg:ml-14",
        className,
=======
        'flex w-full flex-col gap-y-3',
        align === 'center' ? 'text-center' : 'text-left',
        className
>>>>>>> top-banner
      )}
    >
      {isHero ? (
        <h1 className="heading-primary">{title}</h1>
      ) : (
        <h2 className="heading-primary">{title}</h2>
      )}

      {subtitle && <p className="heading-secondary">{subtitle}</p>}
    </div>
  );
};

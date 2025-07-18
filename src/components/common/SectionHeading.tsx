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
        'my-8 flex w-full flex-col gap-y-3',
        align === 'center' ? 'text-center' : 'ml-2 text-left md:ml-10 lg:ml-0',
        className
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

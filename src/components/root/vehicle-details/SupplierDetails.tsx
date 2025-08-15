import { cn } from '@/lib/utils';

export default function SupplierDetails() {
  return (
    <div className="flex flex-col">
      {/* title */}
      <div className={cn('mb-4 flex w-full flex-col gap-y-3 text-left')}>
        <h4 className="text-lg font-medium text-text-primary md:text-xl lg:text-2xl">
          Supplier Details
        </h4>

        <p className="heading-secondary hidden lg:block">
          Lorem ipsum dolor sit amet consectetur.
        </p>
      </div>

      {/* details */}
      <div className="h-20 rounded bg-white">Details of the supplier</div>
    </div>
  );
}

import { FC, useEffect, useRef } from "react";

type VisibilityObserverProps = {
  vehicle: any;
  onVisible: (vehicleId: string) => void;
  onHidden: (vehicleId: string) => void;
  children: React.ReactNode;
};

const VisibilityObserver: FC<VisibilityObserverProps> = ({
  vehicle,
  onVisible,
  onHidden,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(vehicle.vehicleId);
        } else {
          onHidden(vehicle.vehicleId);
        }
      },
      { threshold: 0.25 }, // 25% visible
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [vehicle.vehicleId]);

  return <div ref={ref}>{children}</div>;
};

export default VisibilityObserver;

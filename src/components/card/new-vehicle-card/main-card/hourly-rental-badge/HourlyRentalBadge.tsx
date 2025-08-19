import styles from "./HourlyRentalBadge.module.scss";

export default function HourlyRentalBadge({
  isHourlyRental,
}: {
  isHourlyRental?: boolean | undefined;
}) {
  if (!isHourlyRental) {
    return null;
  }
  return (
    <div className={`${styles.hourlyRental} ${styles.badgeTopRight}`}>
      <span>Hourly Rental</span>
    </div>
  );
}

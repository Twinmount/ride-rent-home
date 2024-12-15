export default function GreenNotificationPing({
  classes,
}: {
  classes?: string;
}) {
  return (
    <span
      className={`relative flex-center h-4 w-4 md:mr-1 ping-animation sm:display-hidden ${classes}`}
    >
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 sm:display-hidden md:display-hidden" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

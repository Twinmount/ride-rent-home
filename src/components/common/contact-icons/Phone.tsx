import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaSquarePhoneFlip } from "react-icons/fa6";

type PhoneProps = {
  phoneNumber: string | null;
  onClick?: () => void;
  loading?: boolean;
};

export default function Phone({ phoneNumber, onClick, loading }: PhoneProps) {
  const handleClick = () => {
    if (!loading && phoneNumber) {
      // Trigger the optional parent onClick callback
      if (onClick) onClick();

      const phoneLink = `tel:${phoneNumber.replace(/\s+/g, "")}`;
      const newTab = window.open(phoneLink, "_self");

      // Google Ads tracking logic
      const gtag_report_conversion = (url: string | null) => {
        if (
          typeof window !== "undefined" &&
          typeof window.gtag === "function"
        ) {
          const callback = () => {
            if (url && !newTab) {
              // Fallback if the phone link wasn't opened
              window.open(url, "_self");
            }
          };

          window.gtag("event", "conversion", {
            send_to: "AW-11504082547/NKncCIL4v_kZEPO8ye0q",
            value: 1.0,
            currency: "INR",
            event_callback: callback,
          });
        } else {
          console.warn("gtag is not defined");
          if (url && !newTab) {
            // Fallback if gtag is not defined
            window.open(url, "_self");
          }
        }
      };

      // Trigger Google Ads conversion tracking
      gtag_report_conversion(phoneLink);
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Show phone number"
        disabled={loading || !phoneNumber}
      >
        <span
          className={`flex items-center justify-center ${
            loading || !phoneNumber
              ? "cursor-not-allowed opacity-30 blur-sm"
              : "cursor-pointer"
          }`}
          style={loading ? { cursor: "wait" } : {}}
        >
          <FaSquarePhoneFlip className="h-10 w-10" />
        </span>
      </PopoverTrigger>
      {phoneNumber && (
        <PopoverContent
          side="top"
          sideOffset={15}
          className="flex h-12 w-fit cursor-pointer items-center justify-center rounded-3xl bg-yellow"
        >
          <div
            onClick={handleClick}
            className={`flex items-center justify-center gap-x-2 font-bold tracking-wider text-white md:text-lg ${
              loading ? "loading" : ""
            }`}
            style={loading ? { cursor: "wait" } : {}}
          >
            {phoneNumber}
            <FaSquarePhoneFlip className="text-2xl text-white md:text-3xl" />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

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
      <PopoverTrigger>
        <FaSquarePhoneFlip
          className={`icon phone ${
            loading || !phoneNumber ? "disabled " : "cursor-pointer"
          }`}
          style={loading ? { cursor: "wait" } : {}}
        />
      </PopoverTrigger>
      {phoneNumber && (
        <PopoverContent
          side="top"
          sideOffset={15}
          className="bg-yellow h-12 w-fit rounded-3xl flex justify-center items-center cursor-pointer"
        >
          <div
            onClick={handleClick}
            className={`md:text-lg font-bold tracking-wider text-white flex justify-center items-center gap-x-2 ${
              loading ? "loading" : ""
            }`}
            style={loading ? { cursor: "wait" } : {}}
          >
            {phoneNumber}
            <FaSquarePhoneFlip className="text-white text-2xl md:text-3xl" />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

import React from "react";
import { PhoneInput } from "react-international-phone";

interface PhoneInput2Props {
  value: string;
  onChange?: (value: string, country: any) => void;
  defaultCountry?: string;
  phoneNumber: string;
  countryCode: string;
  onHandlePhoneNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export const PhoneInput2 = ({
  value,
  onChange,
  defaultCountry = "ae",
  phoneNumber,
  countryCode,
  onHandlePhoneNumberChange,
  className = "",
  placeholder = "enter phone number",
}: PhoneInput2Props) => {
  return (
    <div className={className}>
      <div className="relative z-10 flex gap-2">
        <div className="flex h-8 w-20 flex-shrink-0 items-center justify-center rounded-lg border-2 bg-transparent backdrop-blur-sm transition-all sm:h-10">
          <PhoneInput
            defaultCountry={defaultCountry}
            value={value}
            onChange={onChange}
            className="flex items-center justify-center"
            inputClassName="hidden"
            countrySelectorStyleProps={{
              className:
                "bg-transparent !text-xs !p-0 !bg-transparent !shadow-none",
              style: {
                padding: 0,
                backgroundColor: "transparent",
                background: "transparent",
                boxShadow: "none",
              },
              buttonClassName:
                "!border-none outline-none !h-full !w-full !rounded-none bg-transparent !p-0 !bg-transparent !shadow-none",
            }}
          />
          <span className="mx-0.5 text-[10px] font-semibold sm:text-xs">
            {countryCode}
          </span>
        </div>
        <input
          type="tel"
          id="phone"
          placeholder={placeholder}
          value={phoneNumber}
          onChange={onHandlePhoneNumberChange}
          className="h-8 w-full flex-1 rounded-lg border-2 bg-transparent px-2 text-[10px] outline-none backdrop-blur-sm transition-all placeholder:text-black/40 sm:h-10 sm:px-3 sm:text-sm"
          autoComplete="tel"
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

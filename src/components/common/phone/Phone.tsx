import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FaSquarePhoneFlip } from 'react-icons/fa6'

type PhoneProps = {
  phoneNumber: string | null
  onClick?: () => void
  loading?: boolean
}

export default function Phone({ phoneNumber, onClick, loading }: PhoneProps) {
  const handleClick = () => {
    if (!loading && phoneNumber && onClick) {
      onClick()
      window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <FaSquarePhoneFlip
          className={`icon phone ${
            loading || !phoneNumber ? 'disabled ' : 'cursor-pointer'
          }`}
          style={loading ? { cursor: 'wait' } : {}}
        />
      </PopoverTrigger>
      {phoneNumber && (
        <PopoverContent
          side="top"
          sideOffset={15}
          className="bg-yellow h-12 w-fit rounded-3xl flex justify-center items-center"
        >
          <div
            onClick={handleClick}
            className={`md:text-lg font-bold tracking-wider text-white flex justify-center items-center gap-x-2 ${
              loading ? 'loading' : ''
            }`}
            style={loading ? { cursor: 'wait' } : {}}
          >
            {phoneNumber}
            <FaSquarePhoneFlip className="text-white text-2xl md:text-3xl" />
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

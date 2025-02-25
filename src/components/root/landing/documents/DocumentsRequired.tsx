import { GiCheckMark } from "react-icons/gi";
import Image from "next/image";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";

const DocumentsRequired = ({ category }: { category: string }) => {
  return (
    <div className="mt-12">
      <div className="g mx-auto mb-12 w-fit text-center">
        <h2 className="text-center text-xl font-bold">
          Documents Required to Rent a {category} in UAE
        </h2>
        <hr className="mx-auto mt-2 w-[70%] border-t-4 border-yellow" />
      </div>
      <div className="mx-6 flex flex-col items-center justify-center gap-4 md:flex-row">
        {/* left doc */}
        <MotionDiv className="box flex h-36 items-center gap-4">
          <div className="h-full w-[40%]">
            <Image
              width={100}
              height={100}
              src={"/assets/img/documents/Residents.webp"}
              alt="Resident's image"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="box_right flex flex-col justify-center">
            <h3 className="mb-1 font-bold">For UAE Residents</h3>
            <div>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> Valid UAE Driving
                License
              </p>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> Emirates ID
              </p>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> (Residential Visa may
                be acceptable)
              </p>
            </div>
          </div>
        </MotionDiv>

        {/* right doc */}
        <MotionDiv className="box flex h-36 items-center gap-4 md:flex-row-reverse">
          <div className="box_left h-full w-[40%]">
            <Image
              width={100}
              height={100}
              src={"/assets/img/documents/UAE.webp"}
              alt="Tourist's image"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="box_right flex flex-col justify-center">
            <h3 className="mb-1 font-bold">For Tourists in UAE</h3>
            <div>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> Valid Passport
              </p>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> Visa Details
              </p>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> Home Country Driving
                License
              </p>
              <p className="mb-1 flex items-center gap-1 text-sm">
                <GiCheckMark className="text-green-500" /> International Driving
                Permit (IDP)
              </p>
            </div>
          </div>
        </MotionDiv>
      </div>

      <div className="mx-auto mt-6 max-w-[80%]">
        <p className="text-center text-sm font-normal">
          Travellers from the GCC, US, UK, Canada, Europe, and some other places
          can use their home country driver&apos;s license to drive in UAE,
          without needing an International Driving Permit (IDP) .
        </p>
      </div>
    </div>
  );
};
export default DocumentsRequired;

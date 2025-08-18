import { useState } from 'react';
import { MdOutlineVerifiedUser } from 'react-icons/md';


const BestPriceGuarantee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Clickable Best Price Guarantee Text */}
      <div className="flex justify-center mt-2">
        <button 
          onClick={openModal}
          className="flex items-center gap-x-1 text-orange-500 hover:text-orange-600 transition-colors"
        >
          <MdOutlineVerifiedUser className="h-5 w-5 text-yellow" />
          <span className="text-sm font-medium text-yellow border-b border-yellow">
            Best Price Guarantee
          </span>
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              
            </button>

            {/* Shield Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <MdOutlineVerifiedUser className="h-10 w-10 text-white" fill="currentColor" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Lowest Price Guarantee!
            </h2>

            {/* Description */}
            <div className="text-center space-y-4 text-gray-600">
              <p className="text-sm">
                At Ride.Rent We are Committed to Helping You Get the Lowest Prices Every Time.
              </p>
              
              <p className="text-sm">
                We Use Advanced Machine Learning and Expert Insights to Track Local Rates, Compare Prices and Apply Smart Pricing Strategies So You Always Get the Best Rental Deals.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestPriceGuarantee;
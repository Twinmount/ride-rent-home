import Footer from '@/components/footer/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <section className="error-section">
        <div className="error-top">
          <img src={'/assets/img/general/404.webp'} alt="404 Not Found" />
        </div>

        <div className="error-bottom">
          <h1>Spacecraft Rental</h1>
          <h2>Coming Soon!</h2>

          <button className="yellow-gradient gradient-btn">
            Check out the active offerings now
          </button>

          {/* logo */}
          <div className="logo-container">
            <Link href={'/'} className="header-logo">
              <figure>
                <img
                  src={'/assets/img/logo/riderent-logo.webp'}
                  className="header-img"
                  alt="Ride Rent Logo"
                />
                <figcaption>
                  Quick way to get a <span>Ride On Rent</span>
                </figcaption>
              </figure>
            </Link>
          </div>

          <div className="text-bottom">
            <p>
              <span>Ride.Rent</span> ensures that you have access to the best
              and
              <span> most affordable car rental services in Dubai. </span>
              Take advantage of our exceptional offers on car rentals throughout
              Dubai, with Ride On Rent, each car is well maintained and
              pre-serviced for efficient performance. <br />
              For your peace of mind, all vehicles are insured and come with
              dedicated agent assistance.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </>
  )
}

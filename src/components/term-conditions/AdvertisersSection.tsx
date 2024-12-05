import AdvertisersMain from "./Advertisers/AdvertisersMain"
import AdvertisersSection1 from "./Advertisers/AdvertisersSection1"
import AdvertisersSection2 from "./Advertisers/AdvertisersSection2"
import AdvertisersSection3 from "./Advertisers/AdvertisersSection3"
import AdvertisersSection4 from "./Advertisers/AdvertisersSection4"
import AdvertisersSection5 from "./Advertisers/AdvertisersSection5"
import AdvertisersSection6 from "./Advertisers/AdvertisersSection6"
import AdvertisersSection7 from "./Advertisers/AdvertisersSection7"
import AdvertisersSectionNew from "./Advertisers/AdvertisersSection5"

export default function AdvertisersSection() {
    return (
      <section>
        <h2 className="section-heading">For Advertisers</h2>
        <AdvertisersMain />
        <AdvertisersSection1 />
        <AdvertisersSection2 />
        <AdvertisersSection3 />
        <AdvertisersSection4 />
        <AdvertisersSection5 />
        <AdvertisersSection6 />
        <AdvertisersSection7 />
        </section>
    )
}
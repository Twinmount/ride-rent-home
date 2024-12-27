import Script from "next/script";

export default function BodyScripts() {
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PKCR43SJ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      {/* Meta Pixel (noscript) */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=555373380252698&ev=PageView&noscript=1"
        />
      </noscript>

      {/* Meta Pixel (noscript) */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt="Facebook Pixel"
          src="https://www.facebook.com/tr?id=888541143352202&ev=PageView&noscript=1"
        />
      </noscript>
      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-insight-tag" strategy="afterInteractive">
        {`
            _linkedin_partner_id = "6480588";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
      </Script>
      <Script id="linkedin-insight-js" strategy="afterInteractive">
        {`
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=6480588&fmt=gif"
        />
      </noscript>
    </>
  );
}

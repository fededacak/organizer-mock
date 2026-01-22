import { TickPickLogo } from "@/components/tickpick-logo";

const COMPANY_LINKS = [
  "About Us",
  "Partners",
  "Press",
  "Mobile Apps",
  "Organize Events",
  "Sell Tickets",
  "Gift Cards",
  "Contact Us",
  "Careers",
  "Blog",
  "Ticket Brokers",
  "Seating Charts",
  "Refer Friends",
  "Affiliates",
  "Broker Licenses",
];

const PROMISE_LINKS = [
  "BuyerTrust Guarantee",
  "BestPrice Guarantee",
  "User Agreement",
  "Privacy Policy",
  "Cookie Policy",
  "Do Not Sell or Share My Personal Information",
  "CCPA Notice",
  "FAQ",
  "Accessibility",
];

export function MarketplaceFooter() {
  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0f] border-t border-light-gray dark:border-[#2a2a35] transition-colors duration-300 ease-out">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Main Links */}
        <div className="flex flex-wrap justify-between gap-8 py-6">
          {/* Logo */}
          <div className="w-[190px]">
            <TickPickLogo
              width={190}
              height={42}
              className="dark:[&_path[fill='black']]:fill-white"
            />
          </div>

          {/* App Downloads */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col gap-3">
              {/* App Store */}
              <div className="w-[152px] h-[51px] bg-black dark:bg-white rounded-md flex items-center px-2 gap-2">
                <svg
                  width="22"
                  height="27"
                  viewBox="0 0 22 27"
                  className="shrink-0 fill-white dark:fill-black"
                >
                  <path d="M18.5 13.5c0-3.5 2.8-5.2 2.9-5.3-1.6-2.3-4.1-2.6-5-2.7-2.1-.2-4.1 1.2-5.2 1.2-1.1 0-2.7-1.2-4.5-1.2-2.3 0-4.4 1.3-5.6 3.4-2.4 4.2-.6 10.3 1.7 13.7 1.1 1.7 2.5 3.5 4.3 3.4 1.7-.1 2.4-1.1 4.4-1.1 2.1 0 2.7 1.1 4.5 1.1 1.9 0 3-1.7 4.1-3.4 1.3-1.9 1.8-3.7 1.9-3.8-.1 0-3.5-1.4-3.5-5.3zM15.2 3.5c.9-1.1 1.6-2.7 1.4-4.2-1.4.1-3 .9-4 2-.9 1-1.6 2.5-1.4 4 1.5.1 3-.8 4-1.8z" />
                </svg>
                <div className="flex flex-col text-white dark:text-black">
                  <span className="text-[10px] leading-tight">
                    Download on the
                  </span>
                  <span className="text-lg font-medium leading-tight tracking-tight">
                    App Store
                  </span>
                </div>
              </div>
              {/* Google Play */}
              <div className="w-[152px] h-[51px] bg-black dark:bg-white rounded-md flex items-center px-2 gap-2">
                <svg
                  width="24"
                  height="27"
                  viewBox="0 0 24 27"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M1 1.5L14 13.5L1 25.5V1.5Z"
                    fill="#00D9FF"
                    stroke="#00D9FF"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M14 13.5L18 10L5 2L14 13.5Z"
                    fill="#00FF85"
                    stroke="#00FF85"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M14 13.5L18 17L5 25L14 13.5Z"
                    fill="#FF3B3B"
                    stroke="#FF3B3B"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M18 10L22 12.5L18 17L14 13.5L18 10Z"
                    fill="#FFCF00"
                    stroke="#FFCF00"
                    strokeWidth="0.5"
                  />
                </svg>
                <div className="flex flex-col text-white dark:text-black">
                  <span className="text-[11px] uppercase leading-tight">
                    Get it on
                  </span>
                  <span className="text-lg font-medium leading-tight">
                    Google Play
                  </span>
                </div>
              </div>
            </div>
            {/* Rating */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="#FFB222"
                  >
                    <path d="M6 0L7.76 4.56L12 5.28L8.8 8.64L9.52 13.2L6 11.04L2.48 13.2L3.2 8.64L0 5.28L4.24 4.56L6 0Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] text-dark-gray dark:text-[#9ca3af]">
                Rating: 4.8 - 168k reviews
              </span>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2">
            <p className="font-extrabold text-[15px] text-black dark:text-white">
              Company
            </p>
            <div className="flex flex-col gap-1">
              {COMPANY_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-neutral-700 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Promise Links */}
          <div className="flex flex-col gap-2 w-[194px]">
            <p className="font-extrabold text-[15px] text-black dark:text-white">
              Our Promise
            </p>
            <div className="flex flex-col gap-1">
              {PROMISE_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-neutral-700 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-light-gray dark:border-[#2a2a35] py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-dark-gray dark:text-[#9ca3af]">
            <p>©2025 TickPick LLC. All rights reserved.</p>
            <p>
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-tp-blue hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-tp-blue hover:underline">
                Terms of Service
              </a>{" "}
              apply
            </p>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-lg bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-lg bg-red-600 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-full bg-blue-600 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="#"
              className="w-[30px] h-[30px] rounded-full bg-black dark:bg-white flex items-center justify-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="fill-white dark:fill-black"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

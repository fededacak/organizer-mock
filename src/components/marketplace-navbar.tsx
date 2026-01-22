import { TickPickLogo } from "@/components/tickpick-logo";
import { Button } from "@/components/ui/button";

interface MarketplaceNavbarProps {
  isDarkMode?: boolean;
}

export function MarketplaceNavbar({ isDarkMode = false }: MarketplaceNavbarProps) {
  return (
    <header className="sticky top-0 left-0 w-full bg-white dark:bg-[#0a0a0f] transition-colors duration-300 ease-out z-50">
      <div className="h-[72px] flex items-center justify-between px-4 md:px-8 lg:px-6 xl:px-[72px]">
        <div className="flex items-center gap-6">
          <TickPickLogo
            width={145}
            height={32}
            variant={isDarkMode ? "light" : "dark"}
          />
          <nav className="hidden lg:flex items-center gap-5">
            {["MLB", "NHL", "NBA", "NFL", "Concerts", "Other"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease cursor-pointer"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button className=" text-sm text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease hidden sm:block cursor-pointer">
            Organize Events
          </button>
          <button className=" text-sm text-dark-gray dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors duration-200 ease hidden sm:block cursor-pointer">
            Sell Tickets
          </button>
          <Button className="bg-tp-blue hover:bg-tp-blue/90 text-white font-bold text-base rounded-[36px] px-4 py-2 h-auto">
            Log In
          </Button>
        </div>
      </div>
    </header>
  );
}

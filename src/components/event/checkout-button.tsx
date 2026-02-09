interface CheckoutButtonProps {
  totalTickets: number;
  totalPrice: number;
  ticketTypeCount?: number;
  mode?: "checkout" | "seats";
  onSeatsClick?: () => void;
  isPwywInvalid?: boolean;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

export function CheckoutButton({
  totalTickets,
  totalPrice,
  ticketTypeCount = 1,
  mode = "checkout",
  onSeatsClick,
  isPwywInvalid = false,
}: CheckoutButtonProps) {
  const showCount = ticketTypeCount > 1 && totalTickets > 0;
  const isSeatsMode = mode === "seats";
  const isDisabled = !isSeatsMode && (totalTickets === 0 || isPwywInvalid);

  const handleClick = () => {
    if (isSeatsMode && onSeatsClick) {
      onSeatsClick();
    }
  };

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={`w-full rounded-full h-[50px] md:h-[46px] px-2.5 flex items-center justify-between text-white transition-colors duration-200 ease ${
        isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={
        {
          backgroundColor: "var(--color-tp-blue)",
          "--hover-bg": "color-mix(in srgb, var(--color-tp-blue) 90%, black)",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor =
            "color-mix(in srgb, var(--color-tp-blue) 90%, white)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-tp-blue)";
      }}
    >
      <div
        className={`w-[26px] h-[26px] rounded-full bg-black/10 flex items-center justify-center ${
          !showCount || isSeatsMode ? "opacity-0" : ""
        }`}
      >
        <span className="font-bold text-sm tracking-tight">{totalTickets}</span>
      </div>
      <span className="font-bold text-base tracking-tight flex items-center gap-2">
        {isSeatsMode
          ? "Choose Seats"
          : isDisabled
            ? "Checkout"
            : `Buy Tickets - ${formatPrice(totalPrice)}`}
      </span>
      <div className="w-[26px] h-[26px] opacity-0" />
    </button>
  );
}

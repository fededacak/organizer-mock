interface CheckoutButtonProps {
  totalTickets: number;
  totalPrice: number;
  ticketTypeCount?: number;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

export function CheckoutButton({
  totalTickets,
  totalPrice,
  ticketTypeCount = 1,
}: CheckoutButtonProps) {
  const showCount = ticketTypeCount > 1 && totalTickets > 0;
  const isDisabled = totalTickets === 0;

  return (
    <button
      disabled={isDisabled}
      className={`w-full bg-tp-blue rounded-full h-[50px] md:h-[46px] px-2.5 flex items-center justify-between text-white transition-colors duration-200 ease ${
        isDisabled
          ? "opacity-30 cursor-not-allowed"
          : "cursor-pointer hover:bg-tp-blue/90"
      }`}
    >
      <div
        className={`w-[26px] h-[26px] rounded-full bg-black/10 flex items-center justify-center ${
          !showCount ? "opacity-0" : ""
        }`}
      >
        <span className="font-bold text-sm tracking-tight">{totalTickets}</span>
      </div>
      <span className="font-bold text-base tracking-tight">
        {isDisabled ? "Checkout" : `Buy Tickets - ${formatPrice(totalPrice)}`}
      </span>
      <div className="w-[26px] h-[26px] opacity-0" />
    </button>
  );
}

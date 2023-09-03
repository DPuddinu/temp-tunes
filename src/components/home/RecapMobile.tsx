import { useState, type ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

interface props {
  cards: ReactNode[];
}
const MobileCarousel = ({ cards }: props) => {
  const [selectedCard, setSelectedCard] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setSelectedCard((card) => {
        if (card + 1 < cards.length) {
          scrollTo(`item-${card + 1}`);
          return card + 1;
        }
        return card;
      }),
    onSwipedRight: () =>
      setSelectedCard((card) => {
        if (selectedCard - 1 >= 0) {
          scrollTo(`item-${card - 1}`);
          return card - 1;
        }
        return card;
      }),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <div className="carousel rounded-box w-full grow sm:hidden" {...handlers}>
        {cards?.map((card, i) => (
          <div
            className="carousel-item w-full touch-none touch-pan-y justify-center mx-1"
            key={i}
            id={`item-${i}`}
          >
            {card}
          </div>
        ))}
      </div>
      <div className="flex items-start justify-center gap-1 pt-2">
        {cards?.map((_, i) => (
          <div
            key={i}
            className={`${
              selectedCard === i && "scale-150"
            } h-1 w-1 rounded-full bg-slate-300 transition-transform`}
          />
        ))}
      </div>
      <section className="hidden sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
        {cards.map((card) => card)}
      </section>
    </div>
  );
};

export default MobileCarousel;

function scrollTo(targetId: string) {
  document
    .getElementById(targetId)
    ?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CharacterAnimationConfig {
  selector: string;
  startX: string;
  endX: string;
}

export const animateCharacters = (characters: CharacterAnimationConfig[]) => {
  characters.forEach(({ selector, startX, endX }) => {
    gsap.fromTo(
      selector,
      { x: startX, opacity: 1 },
      {
        x: endX,
        opacity: 10,
        scrollTrigger: {
          trigger: selector,
          start: "top center",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      }
    );
  });
};

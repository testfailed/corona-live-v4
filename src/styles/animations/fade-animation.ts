import { rem } from "polished";
import { keyframes } from "@stitches/react";

export const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const fadeOut = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

export const fadeScaleIn = keyframes({
  "0%": { opacity: 0, transform: "translate3d(-50%, -50%, 0rem) scale(0.8)" },
  "100%": { opacity: 1, transform: "translate3d(-50%, -50%, 0rem) scale(1)" },
});

export const fadeScaleOut = keyframes({
  "0%": { opacity: 1, transform: "translate3d(-50%, -50%, 0rem) scale(1)" },
  "100%": { opacity: 0, transform: "translate3d(-50%, -50% ,0rem) scale(0.8)" },
});

export const fadeInUp = keyframes({
  "0%": { opacity: 0, transform: `translate3d(0rem, ${rem(20)}, 0rem)` },
  "100%": { opacity: 1, transform: "translateY(0rem, 0rem, 0rem)" },
});

export const fadeInUpCentered = keyframes({
  "0%": {
    opacity: 0,
    transform: `translate3d(-50%, calc(-50% + ${rem(20)}), 0rem)`,
  },
  "100%": { opacity: 1, transform: "translate3d(-50%, -50%, 0rem)" },
});

export const fadeOutDown = keyframes({
  "0%": { opacity: 1, transform: "translate3d(0rem, 0rem, 0rem)" },
  "100%": { opacity: 0, transform: `translate3d(0rem, ${rem(20)}, 0rem)` },
});

export const fadeOutDonwCentered = keyframes({
  "0%": { opacity: 1, transform: "translate3d(-50%, -50%, 0rem)" },
  "100%": {
    opacity: 0,
    transform: `translate3d(-50%, calc(-50% + ${rem(20)}), 0rem)`,
  },
});

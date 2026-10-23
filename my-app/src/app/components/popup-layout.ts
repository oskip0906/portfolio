// Size and placement shared by the teahouse section popups and the globe photo popup, so they always match.
// Phones: the top gap is where the centered popup used to start (max(12.5dvh, 5.5rem), clear of the
// top buttons) and the bottom gap is a bit smaller, so the popup sits slightly high of center.
// sm+: centered, height capped at min(75dvh, 100dvh - 11rem): 11rem = 2 x 5.5rem of clearance for
// the top button row, which never exceeds ~5.5rem at any breakpoint.
export const POPUP_FRAME =
  "flex items-start justify-center pb-[max(7dvh,2.75rem)] pt-[max(12.5dvh,5.5rem)] sm:items-center sm:p-6"
export const POPUP_PANEL = "h-full w-[92vw] sm:h-[min(75dvh,calc(100dvh-11rem))] sm:w-[85vw] md:w-[75vw] lg:w-[65vw]"

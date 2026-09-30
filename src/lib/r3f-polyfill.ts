import * as React from "react";

// Polyfill for React 19 / Next.js 15 internal shape expected by @react-three/fiber / react-reconciler 0.27
const ReactAny = React as any;

const clientInternals =
  ReactAny.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ||
  ReactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
  {};

if (!ReactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  ReactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = clientInternals;
}

const internals = ReactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

if (!internals.ReactCurrentOwner) {
  internals.ReactCurrentOwner = clientInternals.A || { current: null };
}
if (!internals.ReactCurrentDispatcher) {
  internals.ReactCurrentDispatcher = clientInternals.H || { current: null };
}
if (!internals.ReactCurrentBatchConfig) {
  internals.ReactCurrentBatchConfig = clientInternals.T || { transition: null };
}
if (!internals.ReactCurrentActQueue) {
  internals.ReactCurrentActQueue = { current: null, isBatchingLegacy: false, didScheduleLegacyEat: false };
}

if (typeof window !== "undefined") {
  (window as any).React = React;

  // Suppress benign browser AbortError when audio/video play() is interrupted by pause()
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event?.reason?.name === "AbortError" ||
      (typeof event?.reason?.message === "string" &&
        event.reason.message.includes("interrupted by a call to pause()"))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

export default React;

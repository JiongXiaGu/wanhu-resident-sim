# Portrait art-direction detail review

The current isolated concept route is `/?view=portrait-art-directions`.
It does not replace the production PortraitFrame runtime or certify modular production assets.

## Native dialog lifecycle

Escape, the close button and backdrop clicks use one controlled close handler. That handler closes the native dialog and clears the selected study during the same interaction.

Do not clear the selected study from the native `close` event. The browser queues that notification; a notification from an earlier opening can otherwise erase a newer selection. The notification may restore focus only while the dialog is still closed. A stale notification must not steal focus from an open dialog.

## Review contract

`scripts/capture-art-directions.mjs` waits for the selected direction, role and pixel images to be rendered, and waits for selected content to be detached after closing. It does not use fixed sleeps or weaken the pixel-count assertions.

The review covers repeated Escape/button close-and-reopen interactions, a delayed-close regression, focus restoration, SVG export, all 54 true-size samples, light/dark backgrounds and the mobile layout. Artwork and the production resident regression checks remain unchanged.

Original screenshots and transparent study exports remain in the Actions artifact. Automated success must still be followed by actual image inspection; neither concept approval nor Unity readiness follows from CI alone.

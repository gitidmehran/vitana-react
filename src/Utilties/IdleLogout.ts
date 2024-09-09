import { useEffect } from "react";

interface Props {
  idleTime: number;
  onLogout: () => void;
}

export default function IdleLogout({ idleTime, onLogout }: Props) {
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    function resetIdleTimer() {
      // Clear the existing timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      // Start a new timer
      idleTimer = setTimeout(() => {
        onLogout();
      }, idleTime);
    }

    // Reset the timer on user input
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("pointermove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("pointermove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);

      // Clear any remaining timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [idleTime, onLogout]);

  return null;
}

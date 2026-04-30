import { useCallback, useEffect, useState } from "react";

// Detects the breakpoint/device based on standardBreakpoints
const useDetectDevice = () => {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">();

  const updateDevice = useCallback(() => {
    const isMobile = window.matchMedia(
      `(max-width: 639px)`
    )?.matches;

    const isTablet = window.matchMedia(
      `(max-width: 1025px)`
    )?.matches;
    setDevice(isMobile ? "mobile" : isTablet ? "tablet" : "desktop");
  }, []);

  useEffect(() => {
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => {
      window.removeEventListener("resize", updateDevice);
    };
  }, [updateDevice]);

  return device;
};

export default useDetectDevice;

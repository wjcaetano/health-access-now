
import { useIsMobile } from "./use-mobile";

export const useResponsiveLayout = () => {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    getLayoutClass: (desktopClass: string, mobileClass: string) => 
      isMobile ? mobileClass : desktopClass,
    getContainerPadding: () => isMobile ? "p-2" : "p-6"
  };
};

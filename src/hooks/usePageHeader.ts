"use client";

import { useHeader } from "@/providers/HeaderProvider";
import { useEffect } from "react";

type HeaderConfig = {
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
};

// export function usePageHeader(config: HeaderConfig) {
//   const { setHeader } = useHeader();

//   useEffect(() => {
//     setHeader(config);

//     return () => {
//       setHeader({
//         title: "YuvaCrix",
//         showBackButton: false,
//         showNotifications: true,
//       });
//     };
//   }, [config, setHeader]);
// }

export function usePageHeader(config: HeaderConfig) {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(config);

    return () => {
      setHeader({
        title: "YuvaCrix",
        showBackButton: false,
        showNotifications: true,
      });
    };
  }, [
    config.title,
    config.showBackButton,
    config.showNotifications,
    setHeader,
  ]);
}

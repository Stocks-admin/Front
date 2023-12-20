import { useEffect, useRef } from "react";

const useClickOutside = (handler: () => void) => {
  let domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let maybeHandler = (event: MouseEvent) => {
      if (!domNode?.current?.contains(event.target as Node | null)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

export default useClickOutside;

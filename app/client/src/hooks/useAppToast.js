import { useToast } from "@chakra-ui/react";

/**
 * App-wide toast wrapper with slower, gentler display.
 * Duration defaults to 8s to avoid flashes.
 */
export default function useAppToast(defaults = {}) {
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: "top",
    ...defaults,
  });

  return (options = {}) =>
    toast({
      duration: options.duration ?? 8000,
      isClosable: true,
      position: "top",
      ...options,
    });
}

import { useToast } from "@chakra-ui/react";

/**
 * App-wide toast wrapper with slower animation and longer display.
 * Duration defaults to 6s and slide transition is slowed slightly.
 */
export default function useAppToast(defaults = {}) {
  const toast = useToast({
    duration: 6000,
    isClosable: true,
    position: "top",
    ...defaults,
  });

  return (options = {}) =>
    toast({
      duration: 6000,
      isClosable: true,
      position: "top",
      transition: { duration: 0.5 },
      ...options,
    });
}

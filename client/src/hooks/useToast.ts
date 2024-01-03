import { useToast as useChakraToast } from "@chakra-ui/react";

interface ToastParamsI {
  title: string;
  description?: string;
}

interface ToastHookI {
  success: (params: ToastParamsI) => void;
  error: (params: ToastParamsI) => void;
  info: (params: ToastParamsI) => void;
}
const useToast = (): ToastHookI => {
  const toast = useChakraToast();

  const error = (params: ToastParamsI): void => {
    toast({
      title: params.title,
      description: params.description,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  };

  const success = (params: ToastParamsI): void => {
    toast({
      title: params.title,
      description: params.description,
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  const info = (params: ToastParamsI): void => {
    toast({
      title: params.title,
      description: params.description,
      status: "info",
      duration: 4000,
      isClosable: true,
    });
  };

  return {
    error,
    success,
    info,
  };
};

export default useToast;

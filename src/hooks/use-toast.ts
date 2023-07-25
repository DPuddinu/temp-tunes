import { useStore } from "~/core/userStore";

export const useToast = () => {
  const { message, setMessage } = useStore();
  return { message, setMessage }
}
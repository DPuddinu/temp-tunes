import { useStore } from "~/core/store"

export const useToast = () => {
  const {message, setMessage} = useStore();
  return {message, setMessage}
}
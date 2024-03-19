import { setPortfolio } from "@/redux/slices/portfolioSlice";
import { getUserBenchmark, getUserPortfolio } from "@/services/userServices";
import { useDispatch } from "react-redux";
import { useToast } from "./useToast";
import { setBenchmark } from "@/redux/slices/benchmarkSlice";

export function useUpdatePortfolio() {
  const dispatch = useDispatch();
  const [notify] = useToast();

  const updatePortfolio = async () => {
    try {
      const newPortfolio = await getUserPortfolio();
      if (newPortfolio.status === 200) {
        dispatch(setPortfolio(newPortfolio.data));
      }

      const newBenchmark = await getUserBenchmark();
      if (newBenchmark.status === 200) {
        dispatch(setBenchmark(newBenchmark.data));
      }
    } catch (error) {
      notify("No se pudo actualizar el portafolio", "error");
      dispatch(setPortfolio([]));
    }
  };

  return [updatePortfolio];
}

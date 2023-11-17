import { useCallback } from "react";
import useCurrencyConverter from "./useCurrencyConverter";

const useMoneyTextGenerator = () => {
  const { convertToArs } = useCurrencyConverter();

  const calculateVariation = useCallback(
    (previousValue: number, currentValue: number, currency: 0 | 1) => {
      const PercentageVariation =
        ((currentValue - previousValue) / previousValue) * 100;

      const nominalVariation = currentValue - previousValue;
      return {
        percentage: PercentageVariation.toFixed(2),
        nominal:
          currency == 0
            ? nominalVariation.toLocaleString()
            : convertToArs(nominalVariation).toLocaleString(),
      };
    },
    []
  );

  const getMoneyText = useCallback(
    (valueToConvert: number, destinationCurrency: 0 | 1) => {
      if (destinationCurrency === 1) {
        return `${convertToArs(valueToConvert).toLocaleString()} AR$`;
      } else {
        return `U$S ${valueToConvert.toLocaleString()}`;
      }
    },
    []
  );

  return { calculateVariation, getMoneyText };
};

export default useMoneyTextGenerator;

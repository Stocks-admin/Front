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
        result: nominalVariation >= 0 ? "positive" : "negative",
        percentage: PercentageVariation.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        nominal:
          currency == 0
            ? nominalVariation.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : convertToArs(nominalVariation).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
      };
    },
    []
  );

  const getMoneyText = useCallback(
    (valueToConvert: number, destinationCurrency: 0 | 1) => {
      if (destinationCurrency === 1) {
        return `${convertToArs(valueToConvert).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      } else {
        return `${valueToConvert.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    },
    []
  );

  return { calculateVariation, getMoneyText };
};

export default useMoneyTextGenerator;

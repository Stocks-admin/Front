interface getMoneyTextProps {
  valueToConvert: number;
  destinationCurrency: string;
  converter: (value: number) => number;
}

export const getMoneyText = ({
  valueToConvert,
  destinationCurrency,
  converter,
}: getMoneyTextProps) => {
  if (destinationCurrency === "ARS") {
    return `${converter(valueToConvert).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} AR$`;
  } else {
    return `U$S ${valueToConvert.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

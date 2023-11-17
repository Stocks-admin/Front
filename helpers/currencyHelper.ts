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
    return `${converter(valueToConvert).toLocaleString()} AR$`;
  } else {
    return `U$S ${valueToConvert.toLocaleString()}`;
  }
};

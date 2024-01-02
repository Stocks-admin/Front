import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { UserPortfolio } from "@/models/userModel";
import Image from "next/image";
import noImage from "@/public/static/images/noImage.jpg";

interface AssetsTableProps {
  assets: UserPortfolio;
  variationType: "percentage" | "nominal";
  currency: 0 | 1;
}

const AssetsTable = ({ assets, variationType, currency }: AssetsTableProps) => {
  const { calculateVariation, getMoneyText } = useMoneyTextGenerator();

  return (
    <table className="w-full">
      <thead className="text-center">
        <tr className="py-2">
          <th>Activo</th>
          <th>Mercado</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Precio compra</th>
          <th>Precio actual</th>
          <th>Variacion</th>
        </tr>
      </thead>
      <tbody>
        {assets?.length > 0 &&
          assets.map((asset) => {
            const variation = calculateVariation(
              asset.purchase_price,
              asset.current_price,
              currency
            );
            return (
              <tr
                key={"asset-" + asset.symbol}
                className="text-center shadow rounded-full py-2"
              >
                <td className="py-2 flex">
                  <Image
                    src={asset?.organization?.logo || noImage.src}
                    alt="logo"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="pl-2">{asset.symbol}</span>
                </td>
                <td className="py-2">{asset.market}</td>
                <td className="py-2">Accion</td>
                <td className="py-2">{asset.final_amount}</td>
                <td className="py-2">
                  {getMoneyText(asset.purchase_price, currency)}
                </td>
                <td className="py-2">
                  {getMoneyText(asset.current_price, currency)}
                </td>
                <td
                  className={`py-2 font-bold ${
                    variation.result === "positive"
                      ? "text-bull_green"
                      : "text-bear_red"
                  }`}
                >
                  {variationType === "nominal" &&
                    (currency === 0 ? "U$S " : "AR$ ")}
                  {variation[variationType]}
                  {variationType === "percentage" && "%"}
                  {variation.result === "positive" ? "▲" : "▼"}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default AssetsTable;

import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { UserPortfolio } from "@/models/userModel";
import Image from "next/image";
import noImage from "@/public/static/images/noImage.jpg";
import { useRouter } from "next/router";

interface AssetsTableProps {
  assets: UserPortfolio;
  variationType: "percentage" | "nominal";
  currency: 0 | 1;
}

const AssetsTable = ({ assets, variationType, currency }: AssetsTableProps) => {
  const { calculateVariation, getMoneyText } = useMoneyTextGenerator();

  const router = useRouter();

  return (
    <table className="w-full">
      <thead className="text-right mb-2">
        <tr className="py-2">
          <th></th>
          <th className="text-left">Activo</th>
          <th className="text-left">Cantidad</th>
          <th>Precio compra</th>
          <th>Precio actual</th>
          <th>Total</th>
          <th className="pe-4">Variacion</th>
        </tr>
      </thead>
      <tbody>
        {assets?.length > 0 ? (
          assets.map((asset) => {
            const currentPrice =
              asset?.bond_info?.batch !== undefined
                ? asset.current_price * asset.bond_info.batch
                : asset.current_price;
            const variation = calculateVariation(
              asset.purchase_price,
              currentPrice,
              currency
            );

            return (
              <tr
                key={"asset-" + asset.symbol}
                className="table-bg-gradient overflow-hidden py-2 text-right cursor-pointer"
                onClick={() =>
                  router.push(`/transactions?symbol=${asset.symbol}`)
                }
              >
                <td className="py-2 flex">
                  <Image
                    src={asset?.organization?.logo || noImage.src}
                    alt="logo"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </td>
                <td className="text-left">{asset.symbol}</td>
                <td className="py-2 text-left">{asset.final_amount}</td>
                <td className="py-2">
                  {getMoneyText(asset.purchase_price, currency)}
                </td>
                <td className="py-2">
                  {asset.hasError ? "-" : getMoneyText(currentPrice, currency)}
                </td>
                <td>
                  {asset.hasError
                    ? "-"
                    : getMoneyText(currentPrice * asset.final_amount, currency)}
                </td>
                <td
                  className={`py-2 font-bold ${
                    variation.result === "positive"
                      ? "text-bull_green"
                      : "text-bear_red"
                  }`}
                >
                  {variation.result === "positive" && "+"}
                  {variation[variationType]}
                  {variationType === "percentage" && "%"}
                  {variation.result === "positive" ? " ▲" : " ▼"}
                </td>
              </tr>
            );
          })
        ) : (
          <td colSpan={6}>
            <h2 className="text-center">
              No hay ningun activo cargado actualmente
            </h2>
          </td>
        )}
      </tbody>
    </table>
  );
};

export default AssetsTable;

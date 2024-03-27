import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { UserPortfolio } from "@/models/userModel";
import Image from "next/image";
import noImage from "@/public/static/images/noImage.jpg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCurrencyConverter from "@/hooks/useCurrencyConverter";

interface AssetsTableProps {
  assets: UserPortfolio;
  variationType: "percentage" | "nominal";
  currency: 0 | 1;
  page?: number;
}

const AssetsTable = ({
  assets,
  variationType,
  currency,
  page = 1,
}: AssetsTableProps) => {
  const { calculateVariation, getMoneyText } = useMoneyTextGenerator();
  const { convertToUsd } = useCurrencyConverter();
  const [assetsPage, setAssetsPage] = useState(
    assets.slice(page * 10 - 10, page * 10)
  );

  useEffect(() => {
    setAssetsPage(assets.slice(page * 10 - 10, page * 10));
    console.log("assetsPage", assets.slice(page * 10 - 10, page * 10));
  }, [assets, page]);

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
        {assetsPage?.length > 0 ? (
          assetsPage.map((asset) => {
            let currentPrice =
              asset?.bond_info?.batch !== undefined
                ? asset.current_price * asset.bond_info.batch
                : asset.current_price;
            if (asset.price_currency === "ARS") {
              currentPrice = convertToUsd(currentPrice);
            }
            const variation = calculateVariation(
              asset.purchase_price,
              currentPrice,
              currency
            );

            const logo = () => {
              if (asset.organization?.logo) {
                return asset.organization?.logo;
              } else if (asset.currency_info?.country.flag) {
                return asset.currency_info?.country.flag;
              } else if (asset.bond_info?.country.flag) {
                return asset.bond_info?.country.flag;
              } else {
                return noImage.src;
              }
            };

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
                    src={logo()}
                    alt="logo"
                    width={256}
                    height={256}
                    className="rounded-full aspect-square object-cover w-8 h-8"
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

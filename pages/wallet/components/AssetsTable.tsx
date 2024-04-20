import SortableTable from "@/components/SortableTable";
import useCurrencyConverter from "@/hooks/useCurrencyConverter";
import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { UserPortfolio, UserStock } from "@/models/userModel";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import noImage from "@/public/static/images/noImage.jpg";
import { useRouter } from "next/router";

interface AssetsTableProps {
  assets: UserPortfolio;
  variationType: "percentage" | "nominal";
  currency: 0 | 1;
  page?: number;
}

const columns = [
  { key: "image", label: " " },
  { key: "name", label: "Activo", sortable: true },
  { key: "amount", label: "Cantidad", sortable: true },
  { key: "purchase_price", label: "Precio compra", sortable: true },
  { key: "current_price", label: "Precio actual", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "variation", label: "Variacion", sortable: true },
];

const AssetsTable = ({ assets, currency, variationType }: AssetsTableProps) => {
  const { calculateVariation, getMoneyText } = useMoneyTextGenerator();
  const { convertToUsd } = useCurrencyConverter();
  const [orderInfo, setOrderInfo] = useState({
    column: "name",
    direction: "asc",
  });
  const router = useRouter();

  console.log("ASSETS", assets);

  const parseData = (assetsToParse: UserPortfolio) => {
    const newArray = new Array(assetsToParse.length);
    assetsToParse.forEach((asset, index) => {
      let currentPrice =
        asset?.bond_info?.batch !== undefined
          ? asset.current_price * asset.bond_info.batch
          : asset.current_price;
      if (asset.price_currency === "ARS") {
        currentPrice = convertToUsd(currentPrice);
      }
      let total = asset.current_price * asset.final_amount;
      if (asset.price_currency === "ARS") {
        total = convertToUsd(total);
      }
      let purchasePrice = asset?.purchase_price || 0;
      if (asset.bond_info?.batch !== undefined) {
        purchasePrice = asset.purchase_price * asset.bond_info.batch;
      }
      const amount = asset.bond_info?.batch
        ? asset.final_amount / asset.bond_info.batch
        : asset.final_amount;
      const variation = calculateVariation(
        purchasePrice * amount,
        currentPrice * amount,
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

      newArray[index] = {
        image: (
          <Image
            src={logo()}
            alt="logo"
            width={1024}
            height={1024}
            quality={100}
            className="rounded-full aspect-square w-8 h-8 overflow-hidden block object-center"
          />
        ),
        name: asset.symbol,
        amount: asset.final_amount,
        purchase_price: getMoneyText(purchasePrice, currency),
        current_price: getMoneyText(currentPrice, currency),
        total: getMoneyText(total, currency),
        variation: (
          <div
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
          </div>
        ),
      };
    });
    return newArray;
  };

  const [sortedData, setSortedData] = useState(parseData(assets));

  const handleSort = () => {
    const { column, direction } = orderInfo;
    const sorted = [...assets].sort((a, b) => {
      if (column === "variation") {
        let aVariation;
        let bVariation;
        let aCurrentPrice = a.current_price;
        let bCurrentPrice = b.current_price;
        if (a.price_currency === "ARS") {
          aCurrentPrice = convertToUsd(aCurrentPrice);
        }
        if (b.price_currency === "ARS") {
          bCurrentPrice = convertToUsd(bCurrentPrice);
        }
        if (b.type === "Bond" && b?.bond_info?.batch) {
          bCurrentPrice = bCurrentPrice * b?.bond_info?.batch;
        }
        if (a.type === "Bond" && a?.bond_info?.batch) {
          aCurrentPrice = aCurrentPrice * a?.bond_info?.batch;
        }
        if (variationType === "percentage") {
          aVariation =
            ((aCurrentPrice - a.purchase_price) / a.purchase_price) * 100;
          bVariation =
            ((bCurrentPrice - b.purchase_price) / b.purchase_price) * 100;
        } else {
          aVariation = (aCurrentPrice - a.purchase_price) * a.final_amount;
          bVariation = (bCurrentPrice - b.purchase_price) * b.final_amount;
        }
        if (direction === "asc") {
          return aVariation - bVariation;
        } else {
          return bVariation - aVariation;
        }
      }
      if (direction === "asc") {
        return a[column] < b[column] ? -1 : 1;
      } else {
        return a[column] > b[column] ? -1 : 1;
      }
    });
    setSortedData(parseData(sorted));
  };

  const onChangeSort = (column: string, direction: string) => {
    setOrderInfo({ column, direction });
  };

  useEffect(() => {
    handleSort();
  }, [orderInfo, variationType, currency, assets]);

  const handleRowClick = (rowNumber: number) => {
    router.push(`/transactions?symbol=${assets[rowNumber].symbol}`);
  };

  return (
    <SortableTable
      clickable
      columns={columns}
      data={sortedData}
      pagination
      onSort={onChangeSort}
      onRowClick={handleRowClick}
    />
  );
};

export default AssetsTable;

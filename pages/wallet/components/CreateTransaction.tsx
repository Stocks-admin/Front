import BottomCard from "@/components/BottomCard";
import { useToast } from "@/hooks/useToast";
import { searchSymbol } from "@/services/searchServices";
import { createTransaction } from "@/services/transactionServices";
import { yupResolver } from "@hookform/resolvers/yup";
import CreatableSelect from "react-select/creatable";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import SymbolInput from "./SymbolInput";
import { useUpdatePortfolio } from "@/hooks/useUpdatePortfolio";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getSymbolPrice } from "@/services/stockServices";
import SideDrawer from "@/components/Drawer";
import Link from "next/link";

const schema = yup.object().shape({
  type: yup
    .string()
    .oneOf(["buy", "sell"])
    .required()
    .label("Tipo de transaccion"),
  symbol: yup.string().required(),
  market: yup.string().nullable(),
  amount: yup.number().min(1).required().label("Cantidad de acciones"),
  currency: yup.string().oneOf(["ARS", "USD"]).required().label("Moneda"),
  price: yup.number().min(0).required().label("Precio"),
  date: yup.date().required().label("Fecha de transaccion"),
});

interface IProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
}

const CreateTransaction = ({ isSheetOpen, setIsSheetOpen }: IProps) => {
  const [notify] = useToast();
  const [updatePortfolio] = useUpdatePortfolio();
  const [priceBlocked, setPriceBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      symbol: "",
      amount: 0,
      price: 0,
      date: moment().toDate(),
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const body = {
      symbol: data.symbol.toUpperCase(),
      transaction_type: data.type,
      market: data.market,
      amount_sold: data.amount,
      currency: data.currency,
      symbol_price: data.price,
      transaction_date: data.date,
    };
    try {
      const transaction = await createTransaction(body);
      if (transaction.status === 200) {
        reset();
        await updatePortfolio();
        notify("Transaccion creada correctamente", "success");
        return setIsSheetOpen(false);
      }
    } catch (error: any) {
      notify(
        error?.response?.data?.error || "Ocurrio un error inesperado",
        "error"
      );
    }
  };

  const searchSymbolPrice = async () => {
    setPriceBlocked(true);
    try {
      const symbol = watch("symbol");
      if (!symbol) return setPriceBlocked(false);
      const date = moment(watch("date")).format("YYYY-MM-DD");
      const market = watch("market") || "nASDAQ";
      const symbolPrice = await getSymbolPrice(symbol, market, date);
      const currency = watch("currency");
      const symbolFinalPrice =
        currency && currency === "USD"
          ? symbolPrice?.data?.value || 0
          : symbolPrice?.data?.value *
              symbolPrice?.data?.conversionRate?.value || 0;
      if (symbolPrice.status === 200)
        setValue("price", +symbolFinalPrice.toFixed(2) || 0);
      setPriceBlocked(false);
    } catch (error) {
      setPriceBlocked(false);
      return notify("No se pudo obtener el valor del simbolo", "error");
    }
  };

  return (
    <SideDrawer
      isDrawerOpen={isSheetOpen}
      setIsDrawerOpen={setIsSheetOpen}
      title="Crear transaccion"
    >
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="form-group">
            <label htmlFor="type">Tipo de transaccion</label>
            <select
              className={`form-control ${errors.type?.message && "error"}`}
              id="type"
              {...register("type")}
              defaultValue="buy"
            >
              <option value="buy">Compra</option>
              <option value="sell">Venta</option>
            </select>
            <p className="text-danger">{errors.type?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="symbol">Simbolo</label>
            <SymbolInput setValue={setValue} />
            <p className="text-danger">{errors.symbol?.message}</p>
          </div>

          <div className="form-group">
            <select
              className={`form-control ${errors.market?.message && "error"}`}
              id="market"
              {...register("market")}
              defaultValue="nasdaq"
              hidden
            >
              <option value="nasdaq">NASDAQ</option>
              <option value="nyse">NYSE</option>
              <option value="bcba">BCBA</option>
              <option value="cedears">CEDEARS</option>
            </select>
            <p className="text-danger">{errors.market?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Cantidad</label>
            <input
              type="number"
              step={1}
              className={`form-control ${errors.amount?.message && "error"}`}
              id="amount"
              {...register("amount")}
            />
            <p className="text-danger">{errors.amount?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="currency">Moneda</label>
            <select
              className={`form-control ${errors.currency?.message && "error"}`}
              id="currency"
              {...register("currency")}
              defaultValue="USD"
            >
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input
              type="date"
              className={`form-control ${errors.date?.message && "error"}`}
              id="date"
              {...register("date")}
            />
            <p className="text-danger">{errors.date?.message}</p>
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <div className="flex justify-between items-center">
              <input
                type="number"
                step={0.01}
                className={`form-control flex-1 disabled:opacity-50 ${
                  errors.price?.message && "error"
                }`}
                id="price"
                disabled={priceBlocked}
                {...register("price")}
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="px-2 cursor-pointer"
                onClick={searchSymbolPrice}
              />
            </div>
            <p className="text-danger">{errors.price?.message}</p>
          </div>

          <button type="submit" className="btn btn-primary">
            Crear transaccion
          </button>
        </form>
        <Link
          className="btn btn-secondary mt-4 text-center"
          href={"/transactions/massiveCreation"}
        >
          Cargar masivamente
        </Link>
      </div>
    </SideDrawer>
  );
};

export default CreateTransaction;

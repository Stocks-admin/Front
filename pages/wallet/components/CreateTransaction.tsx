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

const schema = yup.object().shape({
  type: yup
    .string()
    .oneOf(["buy", "sell"])
    .required()
    .label("Tipo de transaccion"),
  symbol: yup.string().required(),
  market: yup.string().required(),
  amount: yup.number().min(1).required().label("Cantidad de acciones"),
  price: yup.number().min(0).required().label("Precio"),
  date: yup.date().required().label("Fecha de transaccion"),
});

interface IProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
}

const CreateTransaction = ({ isSheetOpen, setIsSheetOpen }: IProps) => {
  const [notify] = useToast();
  const dispatch = useDispatch();
  const [updatePortfolio] = useUpdatePortfolio();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      symbol: "",
      amount: 0,
      price: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const body = {
      symbol: data.symbol.toUpperCase(),
      transaction_type: data.type,
      market: data.market,
      amount_sold: data.amount,
      symbol_price: data.price,
      transaction_date: data.date,
    };
    try {
      const transaction = await createTransaction(body);
      if (transaction.status === 200) {
        updatePortfolio();
        setIsSheetOpen(false);
        return notify("Transaccion creada correctamente", "success");
      }
    } catch (error: any) {
      console.log(error?.response?.data?.error);
      notify(
        error?.response?.data?.error || "Ocurrio un error inesperado",
        "error"
      );
    }
  };

  return (
    <BottomCard isDrawerOpen={isSheetOpen} setIsDrawerOpen={setIsSheetOpen}>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {/* <input
              type="text"
              className={`form-control ${errors.symbol?.message && "error"}`}
              id="symbol"
              onChange={(e) => setSymbolValue(e.target.value)}
            /> */}
            <SymbolInput setValue={setValue} />
            <p className="text-danger">{errors.symbol?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="market">Mercado</label>
            <select
              className={`form-control ${errors.market?.message && "error"}`}
              id="market"
              {...register("market")}
              defaultValue="nasdaq"
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
              step={0.01}
              className={`form-control ${errors.amount?.message && "error"}`}
              id="amount"
              {...register("amount")}
            />
            <p className="text-danger">{errors.amount?.message}</p>
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              className={`form-control ${errors.price?.message && "error"}`}
              id="price"
              {...register("price")}
            />
            <p className="text-danger">{errors.price?.message}</p>
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

          <button type="submit" className="btn btn-primary">
            Crear transaccion
          </button>
        </form>
      </div>
    </BottomCard>
  );
};

export default CreateTransaction;

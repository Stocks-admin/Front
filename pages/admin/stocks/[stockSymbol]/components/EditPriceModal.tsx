import { useToast } from "@/hooks/useToast";
import { ItemPrice } from "@/models/transactionModel";
import { updateItemPrice } from "@/services/adminServices";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "flowbite-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  symbol: string;
  info?: ItemPrice;
}

const schema = yup.object().shape({
  price: yup.number().required("Price is required"),
  date: yup.string().required("Date is required"),
  market: yup
    .string()
    .oneOf(["CEDEARS", "NASDAQ", "BCBA"])
    .required("Market is required"),
});

const EditPriceModal = ({ info, open, setOpen, symbol }: IProps) => {
  const router = useRouter();
  const [notify] = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: 0,
      date: "",
      market: "NASDAQ" as const,
    },
  });

  useEffect(() => {
    if (!info) return;
    setValue("price", info?.value);
    setValue("date", moment(info?.date).utc().format("YYYY-MM-DD"));
    setValue("market", info?.market);
  }, [info]);

  const onSubmit = (data: FieldValues) => {
    console.log(data);

    const body = {
      value: data.price,
      date: data.date,
      market: data.market,
      symbol: symbol,
    };

    updateItemPrice(body)
      .then((resp) => {
        notify("Price updated successfully", "success");
        setOpen(false);
        router.reload();
      })
      .catch((err) => {
        notify("Error updating price", "error");
        console.log(err);
      });
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} className="font-circular">
      <Modal.Header>
        {info ? <h1>Edit {symbol} Price</h1> : <h1>Add {symbol} Price</h1>}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="form-group">
            <label className="label">
              Price
              <input
                type="number"
                className="input"
                {...register("price")}
                step={0.01}
              />
              {errors.price && (
                <span className="text-red-500">{errors.price.message}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label className="label">
              Date
              <input type="date" className="input" {...register("date")} />
              {errors.date && (
                <span className="text-red-500">{errors.date.message}</span>
              )}
            </label>
          </div>
          <div className="form-group">
            <label className="label">
              Market
              <select className="input" {...register("market")}>
                <option value="CEDEARS">CEDEARS</option>
                <option value="NASDAQ">NASDAQ</option>
                <option value="BCBA">BCBA</option>
              </select>
              {errors.market && (
                <span className="text-red-500">{errors.market.message}</span>
              )}
            </label>
          </div>
          <button type="submit" className="btn-primary mt-5">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPriceModal;

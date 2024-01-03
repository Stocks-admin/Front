import { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { AppState } from "@/redux/store";
import { setDollarValue, setState } from "@/redux/slices/dollarSlice";
import { getCurrentDollarValue } from "@/services/currencyServices";

function useCurrencyConverter() {
  const dollarValueSelector = useSelector(
    (state: AppState) => state.dollar,
    shallowEqual
  );
  const dispatch = useDispatch<any>();
  const [dollarValueState, setDollarValueState] = useState(
    dollarValueSelector?.dollarValue || 0
  );

  useEffect(() => {
    const lastUpdate = moment.utc(dollarValueSelector?.last_update);
    const now = moment.utc().subtract(3, "hours");
    if (
      dollarValueSelector?.state !== "success" ||
      !lastUpdate?.isSameOrAfter(now, "day")
    ) {
      updateDollarValue();
    }
  }, []);

  const updateDollarValue = async () => {
    dispatch(setState("loading"));
    getCurrentDollarValue()
      .then((res) => {
        const { value, date } = res.data;
        dispatch(
          setDollarValue({
            dollarValue: value,
            last_update: date,
            state: "success",
          })
        );
      })
      .catch((err) => {
        dispatch(setState("failed"));
      });
  };

  useEffect(() => {
    setDollarValueState(dollarValueSelector?.dollarValue || 0);
  }, [dollarValueSelector]);

  const convertToUsd = (valueToConvert: number) => {
    return valueToConvert / dollarValueState;
  };

  const convertToArs = (valueToConvert: number) => {
    return valueToConvert * dollarValueState;
  };

  return { convertToArs, convertToUsd };
}

export default useCurrencyConverter;

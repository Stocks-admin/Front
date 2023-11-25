import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { getSession } from "next-auth/react";
import SidebarLayout from "@/components/Layout/SidebarLayout";
import ToggleSwitch from "@/components/ToggleSwitch";
import { getUserPortfolio } from "@/services/userServices";
import AssetsTable from "./components/AssetsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  setPortfolio,
  setPortfolioStatus,
} from "@/redux/slices/portfolioSlice";
import useLogout from "@/hooks/useLogout";
import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import CreateTransaction from "./components/CreateTransaction";
import { useToast } from "@/hooks/useToast";
import { createFakeTransactions } from "@/services/transactionServices";
import { useUpdatePortfolio } from "@/hooks/useUpdatePortfolio";

const Wallet = () => {
  const [variationSelected, setVariationSelected] = useState<0 | 1>(0);
  const [currencySelected, setCurrencySelected] = useState<0 | 1>(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { getMoneyText, calculateVariation } = useMoneyTextGenerator();
  const dispatch = useDispatch();
  const portfolio = useSelector(
    (state: AppState) => state.portfolio,
    shallowEqual
  );
  const logout = useLogout();
  const [notify] = useToast();
  const [updatePortfolio] = useUpdatePortfolio();

  useEffect(() => {
    if (portfolio.status !== "success" && portfolio.status !== "loading") {
      dispatch(setPortfolioStatus("loading"));
      getUserPortfolio()
        .then((res) => {
          dispatch(setPortfolioStatus("success"));
          dispatch(setPortfolio(res.data));
        })
        .catch((err) => {
          dispatch(setPortfolioStatus("failed"));
          notify("Error al obtener el portfolio", "error");
          logout();
        });
    }
  }, []);

  const portfolioValue = useMemo(() => {
    if (portfolio.status === "success") {
      return portfolio.stocks.reduce((acc, curr) => {
        return acc + curr.current_price * curr.final_amount;
      }, 0);
    }
    return 0;
  }, [portfolio]);

  const portfolioPurchaseValue = useMemo(() => {
    if (portfolio.status === "success") {
      return portfolio.stocks.reduce((acc, curr) => {
        return acc + curr.purchase_price * curr.final_amount;
      }, 0);
    }
    return 0;
  }, [portfolio]);

  const onChangeVariation = (option: 0 | 1) => {
    setVariationSelected(option);
  };

  const onChangeCurrency = (option: 0 | 1) => {
    setCurrencySelected(option);
  };

  const createTransactions = () => {
    createFakeTransactions()
      .then((res) => {
        notify("Transacciones creadas correctamente", "success");
        updatePortfolio();
      })
      .catch((err) => {
        notify("Error al crear transacciones", "error");
      });
  };

  return (
    <SidebarLayout>
      <div className="flex justify-end my-3">
        <button onClick={createTransactions} className="btn-secondary">
          Crear transacciones falsas
        </button>
        <ToggleSwitch
          option1="$"
          option2="%"
          selected={variationSelected}
          onChange={onChangeVariation}
        />
        <ToggleSwitch
          option1="U$S"
          option2="AR$"
          selected={currencySelected}
          onChange={onChangeCurrency}
        />
      </div>
      <div className="flex justify-between py-3 border-y-2 border-slate-200">
        <h2 className="font-circular">
          Portfolio {getMoneyText(portfolioValue, currencySelected)}
        </h2>
        <h2 className="font-circular">
          Balance{" "}
          {variationSelected === 0 &&
            (currencySelected === 0 ? "U$S " : "AR$ ")}
          {
            calculateVariation(
              portfolioPurchaseValue,
              portfolioValue,
              currencySelected
            )[variationSelected === 0 ? "nominal" : "percentage"]
          }
          {variationSelected === 1 && "%"}
        </h2>
      </div>
      <div className="mt-3">
        <AssetsTable
          assets={portfolio.stocks}
          currency={currencySelected}
          variationType={variationSelected === 0 ? "nominal" : "percentage"}
        />
      </div>
      <div className="mt-3">
        <button
          className="btn-primary rounded-full flex items-center"
          onClick={() => setIsCardOpen(true)}
        >
          Agregar activo
          <FontAwesomeIcon icon={faPlus} className="ml-2" />
        </button>
      </div>
      <CreateTransaction
        isSheetOpen={isCardOpen}
        setIsSheetOpen={setIsCardOpen}
      />
    </SidebarLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Wallet;

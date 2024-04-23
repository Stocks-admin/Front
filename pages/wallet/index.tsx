import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { getSession } from "next-auth/react";
import SidebarLayout from "@/components/Layout/SidebarLayout";
import ToggleSwitch from "@/components/ToggleSwitch";
import { getUserBenchmark, getUserPortfolio } from "@/services/userServices";
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
import {
  cleanUserTransactions,
  createFakeTransactions,
} from "@/services/transactionServices";
import { useUpdatePortfolio } from "@/hooks/useUpdatePortfolio";
import Link from "next/link";
import {
  setBenchmark,
  setBenchmarkStatus,
} from "@/redux/slices/benchmarkSlice";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { NumberParam, useQueryParam } from "use-query-params";
import Pagination from "@/components/Pagination";
import useCurrencyConverter from "@/hooks/useCurrencyConverter";
import AssetsTable from "./components/AssetsTable";

const Wallet = () => {
  const [variationSelected, setVariationSelected] = useState<0 | 1>(0);
  const [currencySelected, setCurrencySelected] = useState<0 | 1>(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [page, setPage] = useQueryParam("page", NumberParam);
  const { getMoneyText, calculateVariation } = useMoneyTextGenerator();
  const { convertToUsd } = useCurrencyConverter();
  const dispatch = useDispatch();
  const portfolio = useSelector(
    (state: AppState) => state.portfolio,
    shallowEqual
  );
  const benchmark = useSelector(
    (state: AppState) => state.benchmark,
    shallowEqual
  );

  const logout = useLogout();
  const [notify] = useToast();
  const [updatePortfolio] = useUpdatePortfolio();

  useEffect(() => {
    if (!page) {
      setPage(1);
    }
  }, [page]);

  useEffect(() => {
    if (portfolio.status !== "success" && portfolio.status !== "loading") {
      dispatch(setPortfolioStatus("loading"));
      const fetchInfo = [getUserPortfolio(), getUserBenchmark()];

      Promise.all(fetchInfo)
        .then((res) => {
          const portfolio = res[0].data;
          const benchmark = res[1].data;
          if (portfolio) {
            dispatch(setPortfolioStatus("success"));
            dispatch(setPortfolio(portfolio));
          }
          if (benchmark) {
            dispatch(setBenchmarkStatus("success"));
            dispatch(setBenchmark(benchmark));
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(setPortfolioStatus("failed"));
          notify("Error al obtener el portfolio", "error");
          logout();
        });
    }
  }, []);

  const portfolioValue = useMemo(() => {
    if (portfolio.status === "success") {
      return portfolio.stocks.reduce((acc, curr) => {
        let currentPrice = curr.current_price;
        const batch = curr.bond_info?.batch || 1;
        if (curr.price_currency === "ARS") {
          currentPrice = convertToUsd(currentPrice);
        }
        return acc + currentPrice * (curr.final_amount / batch);
      }, 0);
    }
    return 0;
  }, [portfolio]);

  const portfolioPurchaseValue = useMemo(() => {
    if (portfolio.status === "success") {
      return portfolio.stocks.reduce((acc, curr) => {
        let purchase_price = curr.purchase_price;
        const batch = curr.bond_info?.batch || 1;
        return acc + purchase_price * curr.final_amount;
      }, 0);
    }
    return 0;
  }, [portfolio]);

  const balance = useMemo(() => {
    return calculateVariation(
      portfolioPurchaseValue,
      portfolioValue,
      currencySelected
    );
  }, [portfolio, currencySelected]);

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

  const cleanTransactions = () => {
    cleanUserTransactions()
      .then((res) => {
        notify("Transacciones borradas correctamente", "success");
        updatePortfolio();
      })
      .catch((err) => {
        notify("Error al borrar transacciones", "error");
      });
  };

  return (
    <SidebarLayout>
      <div className="flex justify-end my-3">
        {process.env.NEXT_PUBLIC_SCOPE === "development" && (
          <>
            <button onClick={createTransactions} className="btn-secondary">
              Crear transacciones falsas
            </button>
            <button onClick={cleanTransactions} className="btn-secondary">
              Limpiar transacciones
            </button>
          </>
        )}
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
      <div className="flex justify-between py-3 border-t-2 border-slate-200">
        <h2 className="font-circular text-4xl font-bold tracking-tighter">
          Portfolio:{" "}
          {variationSelected === 0 &&
            (currencySelected === 0 ? "U$S " : "AR$ ")}
          {getMoneyText(portfolioValue, currencySelected)}
        </h2>
        <h2 className="font-circular text-4xl font-bold">
          Balance:{" "}
          <span
            className={`font-bold ${
              balance.result === "positive"
                ? "text-bull_green"
                : "text-bear_red"
            }`}
          >
            {variationSelected === 0 &&
              (currencySelected === 0 ? "U$S " : "AR$ ")}
            {balance.result === "positive" && "+"}
            {balance[variationSelected === 0 ? "nominal" : "percentage"]}
            {variationSelected === 1 && "%"}
          </span>
        </h2>
      </div>

      <div className="py-3 border-b-2 border-slate-200">
        <h2 className="font-circular text-center">Benchmark</h2>
        <div className="flex justify-evenly">
          <h2
            className={`font-circular ${
              benchmark.benchmark.uva < 0 ? "text-bear_red" : "text-bull_green"
            }`}
          >
            Dolar: {benchmark?.benchmark?.dollar?.toLocaleString() || "-"}%
          </h2>
          <h2
            className={`font-circular ${
              benchmark.benchmark.uva < 0 ? "text-bear_red" : "text-bull_green"
            }`}
          >
            Uva: {benchmark?.benchmark?.uva?.toLocaleString() || "-"}%
          </h2>
        </div>
      </div>

      <div className="mt-3">
        {portfolio.status === "loading" ? (
          <TableSkeleton />
        ) : (
          <AssetsTable
            assets={portfolio.stocks}
            currency={currencySelected}
            variationType={variationSelected === 0 ? "nominal" : "percentage"}
            page={page || 1}
          />
          // <AssetsTable
          //   assets={portfolio.stocks}
          //   currency={currencySelected}
          //   variationType={variationSelected === 0 ? "nominal" : "percentage"}
          //   page={page || 1}
          // />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="mt-3 flex gap-5 items-center">
          <button
            className="btn-primary rounded-full flex items-center"
            onClick={() => setIsCardOpen(true)}
          >
            Agregar activo
            <FontAwesomeIcon icon={faPlus} className="ml-2" />
          </button>
          <Link href="/transactions/massiveCreation" className="btn-secondary">
            Cargar desde excel
          </Link>
        </div>
        {/* <div className="flex items-center justify-between">
          <Pagination
            page={page || 1}
            totalItems={portfolio?.stocks?.length || 0}
            onChangePage={setPage}
          />
        </div> */}
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

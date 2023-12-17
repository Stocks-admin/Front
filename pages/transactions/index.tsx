import SidebarLayout from "@/components/Layout/SidebarLayout";
import { Transaction } from "@/models/transactionModel";
import { getUserTransactions } from "@/services/userServices";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NumberParam, useQueryParam } from "use-query-params";
import TransactionList from "./components/transactionList";
import ToggleSwitch from "@/components/ToggleSwitch";

interface IProps {
  transactions: Transaction[];
  total: number;
}

const Transactions = (props: IProps) => {
  const { transactions: transactionsParams, total: totalTransactions } = props;
  const [transactions, setTransactions] = useState(transactionsParams);
  const [fetchedPage, setFetchedPage] = useState(1);
  const [page, setPage] = useQueryParam("page", NumberParam);
  const [currencySelected, setCurrencySelected] = useState<0 | 1>(0);

  useEffect(() => {
    if (!page) {
      return setPage(1);
    }
    if (page && page !== fetchedPage) {
      setFetchedPage(page);
      getUserTransactions({
        limit: 10,
        offset: (page || 1) * 10 - 10,
      }).then((res) => {
        setTransactions(res.data.transactions);
      });
    }
  }, [page]);

  const onChangeCurrency = (option: 0 | 1) => {
    setCurrencySelected(option);
  };

  return (
    <SidebarLayout>
      <div className="flex justify-end my-3">
        <ToggleSwitch
          option1="U$S"
          option2="AR$"
          selected={currencySelected}
          onChange={onChangeCurrency}
        />
      </div>
      <TransactionList
        page={page || 1}
        totalTransactions={totalTransactions}
        transactions={transactions}
        currencySelected={currencySelected}
      />
    </SidebarLayout>
  );
};

export const getServerSideProps = async ({
  req,
  res,
  query,
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
  const { page } = query;
  let offset = 0;
  if (page && typeof page === "string") {
    offset = parseInt(page) * 10 - 10;
  }
  const resp = await getUserTransactions({
    token: session.user.accessToken,
    // page: page && typeof page === "string" ? parseInt(page) : 1,
    limit: 10,
    offset,
  });
  if (resp.status === 401) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else if (resp.status === 200) {
    return {
      props: {
        transactions: resp.data.transactions,
        total: resp.data.total,
      },
    };
  }
  return {
    props: {
      transactions: [],
      total: 0,
    },
  };
};

export default Transactions;

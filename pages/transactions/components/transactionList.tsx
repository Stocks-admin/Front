import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { useToast } from "@/hooks/useToast";
import { Transaction } from "@/models/transactionModel";
import { deleteTransaction } from "@/services/transactionServices";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NumberParam, StringParam, useQueryParam } from "use-query-params";

interface IProps {
  transactions: Transaction[];
  currencySelected: 0 | 1;
}

const TransactionList = ({
  transactions: transactionsParam,
  currencySelected,
}: IProps) => {
  const { getMoneyText } = useMoneyTextGenerator();
  const [notify] = useToast();
  const [transactions, setTransactions] = useState(transactionsParam);
  const [page, setPage] = useQueryParam("page", NumberParam);
  const [symbol, setSymbol] = useQueryParam("symbol", StringParam);
  const totalTransactions = useMemo(
    () =>
      symbol !== undefined ? transactions.length : transactionsParam.length,
    [transactionsParam, transactions, symbol]
  );

  useEffect(() => {
    setTransactions(transactionsParam);
  }, [transactionsParam]);

  useEffect(() => {
    if (!page) {
      return setPage(1);
    }
    let filteredTransactions = transactionsParam;
    if (symbol) {
      filteredTransactions = transactionsParam.filter((transaction) =>
        transaction.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    }
    if (page) {
      filteredTransactions = filteredTransactions.slice(
        (page || 1) * 10 - 10,
        (page || 1) * 10
      );
    }
    setTransactions(filteredTransactions);
  }, [page, symbol]);

  const handleDelete = (transactionId: number) => {
    deleteTransaction(transactionId)
      .then((res) => {
        if (res.status !== 200)
          return notify("No se pudo eliminar la transaccion", "error");
        const filteredTransactions = transactions.filter(
          (transaction) => transaction.transaction_id !== transactionId
        );
        setTransactions(filteredTransactions);
        return notify("Transaccion eliminada correctamente", "success");
      })
      .catch((err) => {
        return notify("No se pudo eliminar la transaccion", "error");
      });
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSymbol(value);
    } else {
      setSymbol(undefined);
    }
  };

  return (
    <>
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <div className="float-right mb-5 relative">
        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
          <FontAwesomeIcon
            icon={faSearch}
            className="w-5 h-5 text-gray-400 dark:text-gray-300"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          id="table-search"
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Buscar..."
          defaultValue={symbol || ""}
          onChange={handleChangeSearch}
        />
      </div>
      <table className="transaction-list-table">
        <thead>
          <tr>
            <th>Simbolo</th>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.symbol}</td>
              <td>
                {moment(transaction.transaction_date).format("DD-MM-YYYY")}
              </td>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.amount_sold}</td>
              <td>
                {getMoneyText(transaction.symbol_price, currencySelected)}
              </td>
              <td>
                <button
                  className="transaction-list-table__delete-button"
                  onClick={() => handleDelete(transaction.transaction_id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="pagination-control" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {(page || 1) * 10 - 9} -{" "}
            {totalTransactions >= 10 ? (page || 1) * 10 : totalTransactions}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalTransactions}
          </span>
        </span>
        <ul className="inline-flex -space-x-px text-sm h-8">
          <li>
            <Link
              className={`page-button page-button__prev ${
                page === 1 && "page-button__disabled"
              }`}
              href={`?page=${page && page > 1 ? page - 1 : 1}`}
            >
              Previous
            </Link>
          </li>
          <li>
            <Link
              className={`page-button page-button__next ${
                page &&
                page >= totalTransactions / 10 &&
                "page-button__disabled"
              }`}
              href={`?page=${
                page && page < totalTransactions / 10 ? page + 1 : page
              }`}
            >
              Next
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default TransactionList;

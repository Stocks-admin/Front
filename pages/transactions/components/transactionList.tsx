import useMoneyTextGenerator from "@/hooks/useMoneyTextGenerator";
import { useToast } from "@/hooks/useToast";
import { Transaction } from "@/models/transactionModel";
import { deleteTransaction } from "@/services/transactionServices";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IProps {
  transactions: Transaction[];
  page: number;
  totalTransactions: number;
  currencySelected: 0 | 1;
}

const TransactionList = ({
  transactions: transactionsParam,
  page,
  totalTransactions,
  currencySelected,
}: IProps) => {
  const { getMoneyText } = useMoneyTextGenerator();
  const [notify] = useToast();
  const [transactions, setTransactions] = useState(transactionsParam);

  useEffect(() => {
    setTransactions(transactionsParam);
  }, [transactionsParam]);

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

  return (
    <>
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
              href={`?page=${page > 1 ? page - 1 : 1}`}
            >
              Previous
            </Link>
          </li>
          <li>
            <Link
              className={`page-button page-button__next ${
                page >= totalTransactions / 10 && "page-button__disabled"
              }`}
              href={`?page=${page < totalTransactions / 10 ? page + 1 : page}`}
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

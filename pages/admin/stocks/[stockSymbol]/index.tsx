import { getAllStockPrices } from "@/services/adminServices";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AdminLayout from "../../components/AdminLayout";
import moment from "moment";
import EditPriceModal from "./components/EditPriceModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { ItemPrice } from "@/models/transactionModel";

interface IProps {
  prices: ItemPrice[];
}

const AdminStockSymbol = ({ prices }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceToEdit, setPriceToEdit] = useState<ItemPrice | undefined>(
    undefined
  );
  const router = useRouter();
  const { stockSymbol } = router.query;

  useEffect(() => {
    if (!priceToEdit) return;
    setIsModalOpen(true);
  }, [priceToEdit]);

  return (
    <AdminLayout>
      <Link href="/admin/stocks">
        {" "}
        <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Volver
      </Link>
      <table className="w-full text-center">
        <thead>
          <th>Symbol</th>
          <th>Market</th>
          <th>Price (in USD)</th>
          <th>Date</th>
          <th></th>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={`price-${price.market}`}>
              <td>{price.stock_symbol}</td>
              <td>{price.market}</td>
              <td>
                {price.value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td>{moment(price.date).utc().format("DD-MM-YYYY")}</td>
              <td>
                <button
                  onClick={() => setPriceToEdit(price)}
                  className="btn-secondary"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditPriceModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        info={priceToEdit}
        symbol={(stockSymbol as string) || ""}
      />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (session.user.user_roles.some((role) => role.role === "ADMIN")) {
    try {
      //   const allStocks = await getAllStocks();
      const symbol = ctx.params?.stockSymbol as string;
      const stockPrices = await getAllStockPrices(symbol);

      return {
        props: {
          prices: stockPrices.data,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        props: {
          allStocks: [],
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/wallet",
        permanent: false,
      },
    };
  }
}

export default AdminStockSymbol;

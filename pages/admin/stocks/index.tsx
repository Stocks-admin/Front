import { GetServerSideProps, GetServerSidePropsContext } from "next";
import AdminLayout from "../components/AdminLayout";
import noImage from "@/public/static/images/noImage.jpg";
import { getSession } from "next-auth/react";
import { getAllStocks } from "@/services/adminServices";
import { Organization } from "@/models/OrganizationModel";
import _ from "lodash";
import { useEffect, useState } from "react";
import { NumberParam, useQueryParam } from "use-query-params";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import LoadImageModal from "./components/LoadImageModal";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  allStocks: Organization[];
}

const Stocks = ({ allStocks }: IProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [symbolToSubmitPhoto, setSymbolToSubmitPhoto] = useState<string | null>(
    null
  );
  const router = useRouter();
  const [page, setPage] = useQueryParam("page", NumberParam, {
    skipUpdateWhenNoChange: true,
  });
  const [filteredStocks, setFilteredStocks] = useState(allStocks);
  const [paginatedStocks, setPaginatedStocks] = useState(allStocks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!page) setPage(1);
    const newPage = page || 1;
    setPaginatedStocks(filteredStocks.slice(newPage * 10 - 10, newPage * 10));
  }, [page]);

  useEffect(() => {
    if (symbolToSubmitPhoto === null) return;
    setIsModalOpen(true);
  }, [symbolToSubmitPhoto]);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredStocks(allStocks);
    }

    const filteredArray = _.filter(allStocks, (stock) => {
      return (
        stock.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
        stock?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    const newPage = page || 1;
    setFilteredStocks(filteredArray as Organization[]);
    setPaginatedStocks(
      filteredArray.slice(newPage * 10 - 10, newPage * 10) as Organization[]
    );
  }, [searchValue]);

  const goToStock = (symbol: string) => {
    router.push(`/admin/stocks/${symbol}`);
  };

  console.log(allStocks);

  return (
    <AdminLayout>
      <div className="mt-5">
        <div className="flex justify-end items-center w-full">
          <div>
            <label htmlFor="name" className="w-full font-circular">
              Symbol or name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ex: MELI"
              onChange={(e) => setSearchValue(e.target.value)}
              className="rounded-full w-full p-2 border-2 border-gray-300 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <table className="w-full mt-5">
          <thead>
            <tr>
              <th colSpan={2}>Symbol</th>
              <th>Name</th>
              <th>Market</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks?.map((stock) => (
              <tr
                key={stock.symbol}
                className="border hover:bg-slate-400 hover:cursor-pointer"
                onClick={() => goToStock(stock.symbol)}
              >
                <td>
                  <Image
                    src={stock.logo || noImage.src}
                    alt={stock.symbol}
                    width={1024}
                    height={1024}
                    className="w-10 h-10 rounded-full overflow-hidden block object-center"
                  />
                </td>
                <td className="font-semibold">{stock.symbol}</td>
                <td>{stock.name}</td>
                <td>{stock.market}</td>
                <td className="flex items-center justify-around">
                  <button className="btn-secondary">Edit</button>
                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSymbolToSubmitPhoto(stock.symbol);
                    }}
                  >
                    Cargar foto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center">
          <Pagination
            page={page || 1}
            totalItems={filteredStocks.length}
            onChangePage={setPage}
          />
        </div>
      </div>
      <LoadImageModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        symbol={symbolToSubmitPhoto || ""}
      />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (session.user.roles.some((role) => role.role === "ADMIN")) {
    try {
      const allStocks = await getAllStocks();

      return {
        props: {
          allStocks: allStocks.data,
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
};

export default Stocks;

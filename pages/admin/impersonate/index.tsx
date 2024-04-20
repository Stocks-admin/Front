import { getSession } from "next-auth/react";
import AdminLayout from "../components/AdminLayout";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { impersonate } from "@/services/authServices";
import { useToast } from "@/hooks/useToast";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import {
  cleanPortfolio,
  setPortfolio,
  setPortfolioStatus,
} from "@/redux/slices/portfolioSlice";
import { getUserBenchmark, getUserPortfolio } from "@/services/userServices";
import {
  setBenchmark,
  setBenchmarkStatus,
} from "@/redux/slices/benchmarkSlice";

const ImpersonatePage = () => {
  const [userId, setUserId] = useState<number | undefined>();
  const [notify] = useToast();
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!userId) return notify("User id is required", "error");
    impersonate(userId)
      .then(async (res) => {
        if (res.status === 200) {
          dispatch(cleanPortfolio());
          const token = res.data.accessToken;
          setCookie("x-impersonated-token", token, {
            maxAge: 60 * 60,
            path: "/",
          });
          await handleImpersonalization(token);
          notify("Impersonated successfully", "success");
          window.open("/wallet");
        }
      })
      .catch(() => {
        notify("Error impersonating user", "error");
      });
  };

  const handleImpersonalization = async (token: string) => {
    dispatch(setPortfolioStatus("loading"));
    const fetchInfo = [getUserPortfolio(token), getUserBenchmark(token)];

    const res = await Promise.all(fetchInfo);
    console.log(res);
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
  };

  return (
    <AdminLayout>
      <div className="mt-5">
        <h1 className="text-3xl font-semibold uppercase">Impersonate</h1>
        <p className="text-gray-500 my-5">
          Use this page to impersonate other users
        </p>
        <input
          type="text"
          placeholder="User id"
          className="border border-gray-300 rounded-md p-1"
          onChange={(e) => setUserId(parseInt(e.target.value))}
        ></input>
        <button
          className="bg-blue-500 text-white rounded-md p-1"
          onClick={handleClick}
        >
          Impersonate
        </button>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (!session.user.user_roles.some((role) => role.role === "ADMIN")) {
    return {
      redirect: {
        destination: "/wallet",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default ImpersonatePage;

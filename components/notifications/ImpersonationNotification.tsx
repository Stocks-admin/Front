import { useEffect, useState } from "react";
import NotificationWrapper from "./NotificationWrapper";
import { deleteCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { cleanPortfolio } from "@/redux/slices/portfolioSlice";

const ImpersonationNotification = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    hasCookie("x-impersonated-token")
      ? setShouldShow(true)
      : setShouldShow(false);
  }, []);

  const stopImpersonation = () => {
    // stop impersonation
    deleteCookie("x-impersonated-token");
    dispatch(cleanPortfolio());
    router.reload();
  };

  if (shouldShow) {
    return (
      <NotificationWrapper>
        <span className="font-bold text-lg text-red-600">Warning !</span>
        <p>You are impersonating another user</p>
        <button
          onClick={stopImpersonation}
          className={
            "rounded-full flex items-center mt-2 bg-red-600 px-3 py-1 text-white"
          }
        >
          Stop impersonation
        </button>
      </NotificationWrapper>
    );
  }
};

export default ImpersonationNotification;

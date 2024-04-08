import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AdminLayout from "./components/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout>
      <h1>Admin</h1>
    </AdminLayout>
  );
};

//getServerSideProps
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getSession(ctx);

  console.log("session", session);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (session.user.user_roles.some((role) => role.role === "ADMIN")) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        destination: "/wallet",
        permanent: false,
      },
    };
  }
};

export default Admin;

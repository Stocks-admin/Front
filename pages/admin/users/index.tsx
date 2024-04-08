import { getAllUsers } from "@/services/adminServices";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AdminLayout from "../components/AdminLayout";
import { User } from "@/models/userModel";

interface IProps {
  users: User[];
}

const AdminUsers = ({ users }: IProps) => {
  console.log("AdminUsers", users);

  return (
    <AdminLayout>
      <div className="mt-5">
        <table className="w-full text-center">
          <thead>
            <th>Nombre</th>
            <th>Email</th>
            <th>phone</th>
            <th>roles</th>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.user_roles.map((role) => role.role).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  if (session.user.user_roles.some((role) => role.role === "ADMIN")) {
    const users = await getAllUsers();

    return {
      props: {
        users: users.data,
      },
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

export default AdminUsers;

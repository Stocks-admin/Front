import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import logo from "@/components/Layout/assets/Iso logo.png";
import * as yup from "yup";
import { resetPassword } from "@/services/authServices";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";

const schema = yup.object().shape({
  password: yup.string().required().label("Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const RecoverPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notify] = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleResetPassword = async (data: FieldValues) => {
    setIsLoading(true);
    const password = data.password;
    const token = router.query.tkn as string;

    resetPassword(password, token)
      .then((res) => {
        if (res.status === 200) {
          notify("Password reset successfully", "success");
          router.push("/login");
        } else {
          setIsLoading(false);
          notify("An error occurred, please try again", "error");
          console.log("Error");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        notify("An error occurred, please try again", "error");
        console.log(err);
      });

    // Aquí va la lógica para enviar la nueva contraseña al servidor
  };

  return (
    <FullWidthLayout>
      <div className="h-screen flex flex-col justify-center items-center">
        <Link href="/" className="mx-auto">
          <Image
            src={logo.src}
            alt="Butter_logo_full"
            width={150}
            height={64}
          />
        </Link>
        <div className="mx-auto my-auto bg-gray-300 rounded-lg h-64 w-96 px-9 py-7">
          <h1 className="text-2xl text-center mb-6">Reset Password</h1>
          <form
            className="flex flex-col justify-between items-center"
            onSubmit={handleSubmit(handleResetPassword)}
          >
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="border-gray-400 rounded-full p-2 w-full"
            />
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className="border-gray-400 rounded-full p-2 w-full mt-5"
            />
            <button
              type="submit"
              className="btn-primary w-full mt-5"
              disabled={isLoading}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </FullWidthLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.query.tkn as string;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default RecoverPassword;

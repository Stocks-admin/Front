import * as yup from "yup";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { RefObject } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { cleanPortfolio } from "@/redux/slices/portfolioSlice";

const schema = yup.object().shape({
  email: yup.string().required().label("Email"),
  password: yup.string().required().label("Contraseña"),
});

const LoginForm = ({
  formRef,
  setIsLoading,
}: {
  formRef?: RefObject<HTMLFormElement>;
  setIsLoading: (value: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const [notify] = useToast();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    dispatch(cleanPortfolio());
    try {
      const resp = await signIn("credentials", {
        redirect: false, // No redireccionar automáticamente
        username: data.email, // Se envía el nombre de usuario ingresado
        password: data.password, // Se envía la contraseña ingresada
      });
      console.log("RESPONSE", resp);
      if (resp?.error) {
        console.log("ERROR", resp?.error);
        setIsLoading(false);
        notify(resp?.error, "error");
      } else {
        router.push("/wallet");
      }
    } catch (error) {
      console.log("ERROR", error);
      setIsLoading(false);
      notify("Ocurrio un error inesperado", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      className="flex flex-col justify-between items-center"
    >
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          id="email"
          {...register("email")}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          {...register("password")}
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
        />
      </div>
      <Link href={"#"} className="w-full text-center text-sm mb-5">
        Olvidaste tu contraseña?
      </Link>
      <button
        type="submit"
        className="h-0 w-0 opacity-0 pointer-events-none absolute"
      />
    </form>
  );
};

export default LoginForm;

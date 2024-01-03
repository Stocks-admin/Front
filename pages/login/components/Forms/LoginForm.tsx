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

const LoginForm = ({ formRef }: { formRef?: RefObject<HTMLFormElement> }) => {
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
    dispatch(cleanPortfolio());
    signIn("credentials", {
      redirect: false, // No redireccionar automáticamente
      username: data.email, // Se envía el nombre de usuario ingresado
      password: data.password, // Se envía la contraseña ingresada
    })
      .then((result) => {
        if (result?.error) {
          // Si hay un error, mostrarlo en pantalla
          notify(result.error, "error");
        } else {
          // Si no hay error, redireccionar a la página principal
          router.push("/wallet");
        }
      })
      .catch((err) => {
        console.log(err);
        return notify(
          "Ocurrio un error inesperado, vuelva a intentar en unos minutos",
          "error"
        );
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      className="flex flex-col justify-between items-center"
    >
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
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
    </form>
  );
};

export default LoginForm;

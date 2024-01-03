import * as yup from "yup";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RefObject } from "react";
import { register as registerService } from "@/services/authServices";
import { useToast } from "@/hooks/useToast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup.string().required().label("Email"),
  name: yup.string().required().label("Nombre"),
  phone: yup.string().notRequired().nullable().label("Telefono"),
  password: yup.string().required().label("Contraseña"),
});

const RegisterForm = ({
  formRef,
}: {
  formRef?: RefObject<HTMLFormElement>;
}) => {
  const [notify] = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FieldValues) => {
    const body = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      password: data.password,
    };
    registerService(body).then((res) => {
      if (res.status === 200) {
        signIn("credentials", {
          redirect: false, // No redireccionar automáticamente
          username: data.email, // Se envía el nombre de usuario ingresado
          password: data.password, // Se envía la contraseña ingresada
          callbackUrl: "/wallet",
        }).then((result) => {
          if (result?.error) {
            // Si hay un error, mostrarlo en pantalla
            notify(result.error, "error");
          } else {
            // Si no hay error, redireccionar a la página principal
            router.push("/wallet");
          }
        });
      } else {
        notify("Ocurrio un error inesperado. Intentelo de nuevo", "error");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      className="flex flex-col justify-between items-center mb-3"
    >
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className={`form-control ${errors?.email ? "is-invalid" : ""}`}
          id="email"
          {...register("email")}
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          {...register("name")}
          className={`form-control ${errors?.name ? "is-invalid" : ""}`}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Telefono</label>
        <input
          type="text"
          {...register("phone")}
          className={`form-control ${errors?.phone ? "is-invalid" : ""}`}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          {...register("password")}
          className={`form-control ${errors?.password ? "is-invalid" : ""}`}
        />
      </div>
    </form>
  );
};

export default RegisterForm;

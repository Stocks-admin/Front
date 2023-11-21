import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import FormWrapper from "./components/FormWrapper";
import Image from "next/image";
import login_text from "@/public/static/images/login-text.png";

const Login = () => {
  return (
    <FullWidthLayout>
      <div className="flex justify-between items-center mt-20">
        <div className="w-2/3 px-2">
          <Image
            alt="Administra tu plata mas facil"
            src={login_text.src}
            height={login_text.height}
            width={login_text.width}
          />
          <p className="font-circular text-md mt-5">
            La herramienta que necesitas para administrar tus inversiones
          </p>
          <button className="btn-secondary mt-3">Conoce mas</button>
        </div>
        <div className="w-1/3 px-2">
          <FormWrapper />
        </div>
      </div>
    </FullWidthLayout>
  );
};

export default Login;

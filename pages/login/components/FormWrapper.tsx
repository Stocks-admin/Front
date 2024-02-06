import ToggleSwitch from "@/components/ToggleSwitch";
import { useRef, useState } from "react";
import LoginForm from "./Forms/LoginForm";
import RegisterForm from "./Forms/RegisterForm";

const FormWrapper = () => {
  const [formSelected, setFormSelected] = useState<0 | 1>(1);
  const [isLoading, setIsLoading] = useState(false);
  const loginRef = useRef<HTMLFormElement>(null);
  const registerRef = useRef<HTMLFormElement>(null);

  const onChangePill = (selected: 0 | 1) => {
    if (selected === formSelected) {
      if (selected === 0) {
        registerRef.current?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      } else {
        loginRef.current?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    } else {
      setFormSelected(selected);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center rounded-3xl bg-white shadow-lg px-4 py-3 my-5">
      {/* Form */}
      {formSelected === 0 ? (
        <RegisterForm formRef={registerRef} setIsLoading={setIsLoading} />
      ) : (
        <LoginForm formRef={loginRef} setIsLoading={setIsLoading} />
      )}
      <ToggleSwitch
        option1="Registrarme"
        option2="Ingresar"
        selected={formSelected}
        onChange={onChangePill}
        disabled={isLoading}
      />
    </div>
  );
};

export default FormWrapper;

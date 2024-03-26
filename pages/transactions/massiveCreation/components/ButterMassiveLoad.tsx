import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import useLogout from "@/hooks/useLogout";
import { useToast } from "@/hooks/useToast";
import { useUpdatePortfolio } from "@/hooks/useUpdatePortfolio";
import { createMassiveTransactions } from "@/services/transactionServices";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface FileObject {
  name: string;
  size: number;
}

const schema = yup.object().shape({
  file: yup
    .mixed()
    .required("No se cargo ningun archivo")
    .test("fileSize", "The file is too large", (value: any) => {
      if (!value || !value?.length) return true; // attachment is optional
      return value[0].size <= 2000000;
    })
    .label("Archivo"),
});

const ButterMassiveLoad = () => {
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notify] = useToast();
  const [updatePortfolio] = useUpdatePortfolio();
  const logout = useLogout();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: [],
    },
  });

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    const body = new FormData();
    body.append("file", data.file[0]);
    createMassiveTransactions(body)
      .then((res) => {
        if (res?.data?.transactions) {
          updatePortfolio()
            .then(() => {
              setIsLoading(false);
              notify(
                `Se han creado ${
                  res?.data?.transactions?.count || "las"
                } transacciones`,
                "success"
              );
              setFileName("");
              setValue("file", []);
              router.push("/transactions");
            })
            .catch((err) => {
              setIsLoading(false);
              logout();
            });
        } else {
          if (res?.data?.transactions) {
            setIsLoading(false);
            notify(`Se han creado las transacciones correctamente`, "success");
            setFileName("");
            setValue("file", []);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.response?.data?.error) {
          return notify(err?.response?.data?.error, "error");
        } else {
          return notify(
            "No se pudieron crear las transacciones correctamente",
            "error"
          );
        }
      });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setValue("file", [file]);
  };

  useEffect(() => {
    const watchedFile = watch("file") as FileObject[] | undefined;
    if (!watchedFile || watchedFile.length <= 0) {
      if (fileName !== "") {
        setFileName("");
      }
      return;
    }
    const file = watchedFile[0];
    setFileName(file.name);
  }, [watch("file")]);

  return (
    <div className="w-full">
      <div className="flex justify-center items-center w-full">
        <form
          id="dropzone-form"
          onSubmit={handleSubmit(onSubmit)}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center justify-center w-full"
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FontAwesomeIcon
                icon={faCloudArrowUp}
                className="w-8 h-8 mb-4 text-gray-500"
              />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">XLX, CSV or XLSX</p>
              {fileName !== "" && (
                <p className="text-sm text-green-700 font-bold">{fileName}</p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              {...register("file")}
            />
          </label>
        </form>
      </div>
      <div className="flex mt-5 self-start gap-5 items-center">
        <button
          type="submit"
          form="dropzone-form"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Subiendo..." : "Guardar"}
        </button>
        <Link
          href="https://butter-bucket-gp.s3.amazonaws.com/Butter+massive+creation.xlsx"
          target="_blank"
          className="btn-secondary"
        >
          Descargar modelo
        </Link>
      </div>
    </div>
  );
};

export default ButterMassiveLoad;

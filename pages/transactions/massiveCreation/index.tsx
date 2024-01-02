import SidebarLayout from "@/components/Layout/SidebarLayout";
import useLogout from "@/hooks/useLogout";
import { useToast } from "@/hooks/useToast";
import { useUpdatePortfolio } from "@/hooks/useUpdatePortfolio";
import { createMassiveTransactions } from "@/services/transactionServices";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
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

const MassiveCreation = () => {
  const [fileName, setFileName] = useState("");
  const [notify] = useToast();
  const [updatePortfolio] = useUpdatePortfolio();
  const logout = useLogout();

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
    const body = new FormData();
    body.append("file", data.file[0]);
    createMassiveTransactions(body)
      .then((res) => {
        if (res?.data?.transactions) {
          updatePortfolio()
            .then(() => {
              notify(
                `Se han creado ${res?.data?.transactions} transacciones`,
                "success"
              );
              setFileName("");
              setValue("file", []);
            })
            .catch((err) => {
              logout();
            });
        } else {
          if (res?.data?.transactions) {
            notify(`Se han creado las transacciones correctamente`, "success");

            setFileName("");
            setValue("file", []);
          }
        }
      })
      .catch((err) => {
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
    <SidebarLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold self-start mb-5 uppercase">
          Carga masiva de transacciones
        </h1>
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
                  <p className="text-xs text-gray-500">{fileName}</p>
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
          <button type="submit" form="dropzone-form" className="btn-primary">
            Guardar
          </button>
          <Link
            href="https://butter-bucket-gp.s3.us-east-1.amazonaws.com/Butter%20massive%20creation.xlsx?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEQaCXNhLWVhc3QtMSJHMEUCID0P5FZYuMpNkdHRSbFN3s9Ncm7cD85rC5%2B16xSmJc4AAiEAuhlDCDLAMAlG9QkA4PiZjCO4A8hJn0kAHjrNwJR2nr0q7QIIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5Mzk0NzI4MjM5MjUiDEx5p%2BikqWA9qm2niirBAiH%2BosAqRr2HaJaE9hsZ%2B3NJ5VwMgv%2FXCohi5%2BArh3xrAyXN0vvo5ANEj77b%2BiC%2FFrEDm%2Bb%2B7Vw36lxeFL1zEGV5OnzdnfBBSNCCn57L1WSav1vNWu8AispQfBSDruLqPYyV11%2F%2Fg1yPaoiXaopJnb3odUzojtFCJ50kBmGGf6ZUFYX%2FMsEztvwxjjVMPBVQkPZvKseoM8KmguGi1EgzMa4wIMk9hu3XEhCwm2TYPtwTxgnJqwYb%2FxGcNRsnYqBlpGBVkWMevPFKDLGNfTnCRuCeRQIGfPZDe%2B5P%2FhLrzDa%2Bf0ibW5KUPSztuut5SZpbwQT5Bshi0skwpvzXM2yeHKY7zgTrm3J%2BSDTtJk9V3KmS0wUgpVpuZkI%2FUrMHOb1R3Uie5Eh7et1gUWxcG0Rjj0jZZu5itAq4FJ9JZCiIX0oacDC6ubesBjqzAqtIqDDr%2B4AgS2ncREZ%2F01u2vWmFJ5nAF3rcNoxdts4XnRox1omwD5AT6BLc%2FaJ8VJQ5b5REf%2B1cWR%2FVd%2FPixFdaeuDKS3tio5PiFcAwfZjctcbBClyn7EkYIWcFKoUAGPIKtfMo5xEosBCIyrcU3AGB9vMKgtFDlshhdQKuVNiRsdXh%2FgAbs8QZsi9bCNmTz7K0lW4e2Gr%2Bj5gzL%2BdeWoiqGdNEBV3IquEYu51aa%2BpjNSEUbhJ5C7C9qP5AW3F%2BYGeIJQEh5c2TahSE4W8fJ2ypRGlHuTqITPP%2FY9LTHJZV7fju6UxH3%2FYeKyI3pieilvYjE36O6MXpmcsYcYc05rf4deFEfmG68RRJoyZKyqcG0yHec5gPbqMb18HI%2BzYsZhj%2BBsA5fXatxinwr2jws0ojeto%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231229T035742Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA5VPHRUZ2VQRW4G5T%2F20231229%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=38c77a67ce82885bc13d389edd56132e77e9eb9add95aa6579a2dcdff9cfdc0e"
            target="_blank"
            className="btn-secondary"
          >
            Descargar modelo
          </Link>
        </div>
      </div>
    </SidebarLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default MassiveCreation;

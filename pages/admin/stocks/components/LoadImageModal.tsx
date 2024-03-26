import { useToast } from "@/hooks/useToast";
import { uploadImage } from "@/services/adminServices";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  symbol: string;
}

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

const LoadImageModal = ({ open, setOpen, symbol }: IProps) => {
  const [fileName, setFileName] = useState("");
  const router = useRouter();
  const [notify] = useToast();
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

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: FieldValues) => {
    const body = new FormData();
    body.append("file", data.file[0]);
    body.append("symbol", symbol);
    uploadImage(body)
      .then((resp) => {
        setOpen(false);
        notify("Imagen cargada correctamente", "success");
        router.reload();
      })
      .catch((err) => {
        console.log("ERR", err);
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
    <Modal show={open} onClose={handleClose}>
      <Modal.Body>
        <form
          id="dropzone-form"
          onSubmit={handleSubmit(onSubmit)}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center justify-center flex-wrap w-full"
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
              <p className="text-xs text-gray-500">JPEG</p>
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
          {errors.file && (
            <p className="text-red-500 text-sm">{errors.file.message}</p>
          )}
          <button type="submit" className="btn-primary mt-5">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default LoadImageModal;

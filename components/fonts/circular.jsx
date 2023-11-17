import localFont from "@next/font/local";

const circular = localFont({
  src: [
    {
      path: "../../public/fonts/circular/CircularStd-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular/CircularStd-BookItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/circular/CircularStd-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular/CircularStd-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/circular/CircularStd-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular/CircularStd-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/circular/CircularStd-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular/CircularStd-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-circular",
});

export default circular;

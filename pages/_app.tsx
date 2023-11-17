import { persistor, store } from "@/redux/store";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { NextAdapter } from "next-query-params";
import { PersistGate } from "redux-persist/integration/react";
import { QueryParamProvider } from "use-query-params";
import circular from "@/components/fonts/circular";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLocale } from "yup";
import { es } from "yup-locales";

setLocale(es);

function PersistRender({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title key="metaTitle">
          Butter | La herramienta que necesitas para administrar tus finanzas
        </title>
        <meta property="og:title" content="Bananas" key="ogtitle" />
        <meta
          property="og:description"
          content="﻿Séjournez dans des lieux de qualité pour des vacances et des weekends éco-responsables en France."
          key="ogdescription"
        />
        <meta property="title" content="Bananas" key="title" />

        <meta
          property="description"
          content="﻿Séjournez dans des lieux de qualité pour des vacances et des weekends éco-responsables en France."
          key="description"
        />
        {/* <meta
          property="og:image"
          content="https://wegogreenr-laravel.s3.eu-west-2.amazonaws.com/bloomers_eco1128.png"
          key="ogimage"
        /> */}
        <meta
          name="facebook-domain-verification"
          content="6kjmz6plkw9w0al9yweeqk8s7pw155"
        />

        {/* <script
        id="ze-snippet"
        src="https://static.zdassets.com/ekr/snippet.js?key=1ec2241c-fc21-42dc-badd-3cbf543abccb"
      >
      </script> */}
      </Head>
      {children}
      <ToastContainer style={{ zIndex: "9999999999999999" }} />
      {/* <Axeptio /> */}
    </>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryParamProvider adapter={NextAdapter}>
          <PersistRender>
            <div className={`${circular.variable}`}>
              <Component {...pageProps} />
            </div>
          </PersistRender>
        </QueryParamProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

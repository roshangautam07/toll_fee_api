// https://nextjs.org/docs/basic-features/built-in-css-support
import { useEffect, useState } from "react";
import "../public/main.css";
import Router from "next/router";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { SSRProvider } from 'react-bootstrap';


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <>
        {/* <NextNProgress /> */}
        <SSRProvider>
        <ToastContainer />
        <Component {...pageProps} />
        </SSRProvider>
      </>
    );
  }
}

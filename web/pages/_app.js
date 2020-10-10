import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const RenderHead = () => {
    return (
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>BBCDS Corona Analytics</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
    )
  }
  return (
    <>
      <RenderHead />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

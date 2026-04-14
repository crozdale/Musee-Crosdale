import React from 'react'
import Head from 'next/head'

import Script from 'dangerous-html/react'
import { useTranslations } from 'next-intl'

import Navigation from '../components/navigation'
import Footer from '../components/footer'

const Home = (props) => {
  const translate = useTranslations()
  return (
    <>
      <div className="home-container1">
        <Head>
          <title>Informal Dizzy Tapir</title>
          <meta property="og:title" content="Informal Dizzy Tapir" />
          <link rel="canonical" href="https://xdale.net/" />
        </Head>
        <Navigation locale={props?.locale ?? ''}></Navigation>
        <main className="facinations-page">
          <section className="hero-section">
            <div className="hero-video-wrapper">
              <video autoPlay={true} loop={true} muted={true} playsInline={true}
                poster="https://images.pexels.com/videos/9965968/pictures/preview-0.jpeg"
                src="https://videos.pexels.com/video-files/9965968/9965968-hd_1280_720_50fps.mp4"
                className="hero-bg-video"></video>
              <div className="hero-overlay"></div>
            </div>
          </section>
        </main>
        <Footer locale={props?.locale ?? ''}></Footer>
      </div>
    </>
  )
}

export default Home

export async function getStaticProps(context) {
  const messages = (await import('/locales/' + context.locale + '.json')).default
  return { props: { messages, ...context } }
}

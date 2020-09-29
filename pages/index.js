import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import jsdom from 'jsdom';
import ReactHtmlParser from 'react-html-parser';
const { JSDOM } = jsdom;

export default function Home({ query, pageText, headText, headerText }) {
  console.log(query);
  // const parser = new DOMParser();
  // const htmlDoc = parser.parseFromString(pageText, 'text/html');
  // console.log(htmlDoc.querySelector('html'));

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        {ReactHtmlParser(headText)}
      </Head>
      {ReactHtmlParser(headerText)}
      <section className={utilStyles.headingMd}>
        test
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const response = await fetch('https://77.autoretail.ru/callback/');
  const pageText = await response.text();
  const dom = new JSDOM(pageText);
  const headText = dom.window.document.querySelector("head").innerHTML;
  const headerText = dom.window.document.querySelector('header.header-azgaz').innerHTML;

  return {
    props: {
      query: context.query,
      pageText,
      headText,
      headerText
    }, // will be passed to the page component as props
  }
}
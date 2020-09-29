import Head from 'next/head';
import jsdom from 'jsdom';
import ReactHtmlParser from 'react-html-parser';
// import ReactJson from 'react-json-view';

const { JSDOM } = jsdom;

export default function Home({ query, pageText, headText, headerText, cars }) {
  // console.log(query);
  // const parser = new DOMParser();
  // const htmlDoc = parser.parseFromString(pageText, 'text/html');
  // console.log(htmlDoc.querySelector('html'));

  return (
    <>
      <Head>
        {ReactHtmlParser(headText)}
      </Head>
      {ReactHtmlParser(headerText)}
     {/* <ReactJson src={cars} /> */}
      <ul>
        {cars.map(car => (<li>{car.vin} - {car.model}</li>))}
      </ul>
    </>
  )
}

export async function getServerSideProps(context) {
  const response = await fetch('https://77.autoretail.ru/callback/');
  const pageText = await response.text();
  const dom = new JSDOM(pageText);
  const headText = dom.window.document.querySelector("head").innerHTML;
  const headerText = dom.window.document.querySelector('header.header-azgaz').innerHTML;

  const carsResponse = await fetch('https://cs.azgaz.dev.perx.ru/carstock/api/v1/vehicles/?dealer=5d3d9fb273a470417dd23006&per_page=10');
  const cars = await carsResponse.json(); 

  return {
    props: {
      query: context.query,
      pageText,
      headText,
      headerText,
      cars
    }, // will be passed to the page component as props
  }
}
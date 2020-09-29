import Head from 'next/head';
import jsdom from 'jsdom';
import ReactHtmlParser from 'react-html-parser';
import { useState } from 'react';
// import ReactJson from 'react-json-view';

const { JSDOM } = jsdom;

const perPage = 5;
const dealerId = '5d3d9fb273a470417dd23006'; 

async function getCars(dealerId, perPage, page) {
  const carsResponse = await fetch(`https://cs.azgaz.dev.perx.ru/carstock/api/v1/vehicles/?dealer=${dealerId}&per_page=${perPage}&page=${page}`);
  const cars = await carsResponse.json(); 

  return cars;
}


export default function Home({ query, pageText, headText, headerText, initialCars }) {
  const [cars, setCars] = useState(initialCars);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const allCarsLoaded = useState(false);

  const onClick = async () => {
    const nextPage = page + 1;

    try {
      setLoading(true);
      const nextCars = await getCars(dealerId, perPage, nextPage);
      console.log(nextCars)
      setCars([...cars, ...nextCars]);
      setPage(nextPage);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
  }, [cars, page])

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
      <div>current page: {page}</div>
      <button style={{ border: '1px solid #ccc', padding: '5px 10px' }} onClick={onClick} disabled={loading}>{loading ? 'Loading' : "Load next page"}</button>
    </>
  )
}

export async function getServerSideProps(context) {
  const response = await fetch('https://77.autoretail.ru/callback/');
  const pageText = await response.text();
  const dom = new JSDOM(pageText);
  const headText = dom.window.document.querySelector("head").innerHTML;
  const headerText = dom.window.document.querySelector('header.header-azgaz').innerHTML;

  const initialCars = await getCars(dealerId, perPage, 1); 

  return {
    props: {
      query: context.query,
      pageText,
      headText,
      headerText,
      initialCars,
    }, // will be passed to the page component as props
  }
}
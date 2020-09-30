import Head from "next/head";
import jsdom from "jsdom";
import ReactHtmlParser from "react-html-parser";
import { useState, useEffect } from "react";

const { JSDOM } = jsdom;

const perPage = 5;
const dealerId = "5d3d9fb273a470417dd23006";

async function getCars(dealerId, perPage, page) {
  const carsResponse = await fetch(
    `https://cs.azgaz.dev.perx.ru/carstock/api/v1/vehicles/?dealer=${dealerId}&per_page=${perPage}&page=${page}`
  );
  const cars = await carsResponse.json();

  return cars;
}

export default function Home({
  headText,
  headerText,
  pageHeaderText,
  initialCars,
}) {
  const [cars, setCars] = useState(initialCars);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allCarsLoaded, setAllCarLoaded] = useState(false);

  const onClick = async () => {
    const nextPage = page + 1;

    try {
      setLoading(true);
      const nextCars = await getCars(dealerId, perPage, nextPage);
      setCars([...cars, ...nextCars]);
      setPage(nextPage);
      checkAll(nextCars.length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  function checkAll(count) {
    if (count < perPage) {
      setAllCarLoaded(true);
    }
  }

  useEffect(() => {
    checkAll(cars.length);
  }, []);

  return (
    <>
      <Head>{ReactHtmlParser(headText)}</Head>
      {ReactHtmlParser(headerText)}
      <main>
        {ReactHtmlParser(pageHeaderText)}
        <div className="html-block">
          <div className="container">
            <ul>
              {cars.map((car) => (
                <li>
                  {car.vin} - {car.model}
                </li>
              ))}
            </ul>
            <div>current page: {page}</div>
            {allCarsLoaded && <div>Все тачки загружены</div>}
            <button
              style={{ border: "1px solid #ccc", padding: "5px 10px" }}
              onClick={onClick}
              disabled={loading || allCarsLoaded}
            >
              {loading ? "Loading" : "Load next page"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const response = await fetch("https://77.autoretail.ru/callback/");
  const pageText = await response.text();
  const dom = new JSDOM(pageText);
  const headText = dom.window.document.querySelector("head").innerHTML;
  const headerText = dom.window.document.querySelector("header.header-azgaz")
    .outerHTML;
  const pageHeaderText = dom.window.document.querySelector(
    "section.page-header"
  ).outerHTML;
  const initialCars = await getCars(dealerId, perPage, 1);

  return {
    props: {
      query: context.query,
      pageText,
      headText,
      headerText,
      pageHeaderText,
      initialCars,
    }, // will be passed to the page component as props
  };
}

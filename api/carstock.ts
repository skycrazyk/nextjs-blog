import axios from "axios";

const carStockApi = axios.create({
  baseURL: "https://cs.azgaz.dev.perx.ru/carstock/api/v1/",
});

/** Queries create */

type TQueriesQuery = { group: string[]; [K: string]: any };

type TQueriesCreateProps = {
  queries: TQueriesQuery[];
  metadata?: { [K: string]: any };
};

type TQueriesCreateResponse = {
  id: string;
  queries: TQueriesQuery[];
  hooks: {
    [K: string]: any;
  }[];
  metadata: {
    [K: string]: any;
  }[];
};

const queriesCreate = async (props: TQueriesCreateProps) =>
  await carStockApi.post<TQueriesCreateResponse>("queries/", props);

/** Queries getResult */

type TQueriesResultProps = {
  queryId: string;
  page?: number;
  per_page?: number;
  sort?: string[];
};

type TQueriesResultResponse = {
  id: string;
  [K: string]: any;
};

const queriesResult = async (props: TQueriesResultProps) =>
  await carStockApi.get<TQueriesResultResponse>(
    `queries/${props.queryId}/result`,
    {
      params: { page: props.page, per_page: props.per_page, sort: props.sort },
    }
  );

type TQueriesSummaryProps = {
  queryId: string;
};

type TQueriesSummaryResponse = {
  name: string;
  count: number;
}[];

/** Queries get summary */

const queriesGetSummary = async (props: TQueriesSummaryProps) =>
  carStockApi.get<TQueriesSummaryResponse>(`queries/${props.queryId}/summary`);

/**
 * Queries get values
 */

type TQueriesGetValuesProps = {
  queryId: string;
};

type TValueRange = {
  count: number;
  maxValue: number;
  minValue: number;
  name: string;
};

type TValueList = {
  name: string;
  values: {
    id: string;
    value: string;
    count: number;
  }[];
};

type TQueriesGetValuesResponse = (TValueList | TValueRange)[];

const queriesGetValues = async (props: TQueriesGetValuesProps) =>
  carStockApi.get<TQueriesGetValuesResponse>(
    `/queries/${props.queryId}/values`
  );

/**
 * При изменении параметров фильтрации.
 * Получаем queryId и следом запрашиваем список авто, их количество,
 * возможные значения фильтров
 */

// const queriesAll =

export const queries = {
  create: queriesCreate,
  result: queriesResult,
  summary: queriesGetSummary,
  values: queriesGetValues,
  all: null, // TODO
};

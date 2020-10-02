import axios from "axios";
import { config } from "../utils";

const carStockApi = axios.create({
  baseURL: config.carstokApiUrl,
});

/**
 * Queries create
 */

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

/**
 * Queries getResult
 */

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

/**
 * Queries get summary
 */

type TQueriesSummaryProps = {
  queryId: string;
};

type TQueriesSummaryResponse = {
  name: string;
  count: number;
}[];

const queriesGetSummary = async (props: TQueriesSummaryProps) =>
  carStockApi.get<TQueriesSummaryResponse>(`queries/${props.queryId}/summary`);

/**
 * Queries get values
 */

type TQueriesGetValuesProps = {
  queryId: string;
  fields: Record<string, any>;
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

type TQueriesAllProps = TQueriesCreateProps &
  Pick<TQueriesResultProps, "page" | "per_page" | "sort"> &
  Pick<TQueriesGetValuesProps, "fields">;

type TQueriesAllResponse = {
  queries: TQueriesCreateResponse;
  result: TQueriesResultResponse;
  summary: TQueriesSummaryResponse;
  filters: TQueriesGetValuesResponse;
};

const queriesAll = async (
  props: TQueriesAllProps
): Promise<TQueriesAllResponse> => {
  const queriesCreateResponse = await queriesCreate({ queries: props.queries });
  const queries = queriesCreateResponse.data;

  const queriesResultRequest = queriesResult({
    queryId: queries.id,
    page: props.page,
    per_page: props.per_page,
    sort: props.sort,
  });

  const queriesSummaryRequest = queriesGetSummary({ queryId: queries.id });

  const queriesFiltersRequest = queriesGetValues({
    queryId: queries.id,
    fields: props.fields,
  });

  const [result, summary, filters] = await Promise.all([
    queriesResultRequest,
    queriesSummaryRequest,
    queriesFiltersRequest,
  ]);

  return {
    queries,
    result: result.data,
    summary: summary.data,
    filters: filters.data,
  };
};

export const queries = {
  queries: queriesCreate,
  result: queriesResult,
  summary: queriesGetSummary,
  values: queriesGetValues,
  all: queriesAll,
};

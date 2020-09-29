export default ({ data }: { data: any }) => (
  <pre style={{ fontSize: 10 }}>{JSON.stringify(data, null, 2)}</pre>
);

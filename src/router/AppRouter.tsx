import { useRoutes } from "raviger";
import Layout from "../components/common/AppLayout";

const routes = {
  "/": () => <Layout />,
};

export default function AppRouter() {
  let route = useRoutes(routes);
  return <div>{route}</div>;
}

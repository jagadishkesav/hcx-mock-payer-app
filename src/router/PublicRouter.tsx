import { useRoutes } from "raviger";
import Login from "../components/auth/Login";
import NotFound from "../components/common/NotFound";

const routes = {
  "/": () => <Login />,
  "*": () => <NotFound />,
};

export default function PublicRouter() {
  let route = useRoutes(routes);
  return (
    <div>
      <div></div>
      {route}
    </div>
  );
}

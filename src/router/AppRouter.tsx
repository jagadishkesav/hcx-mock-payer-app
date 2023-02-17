import { useRoutes } from "raviger";
import Claims from "../components/claims";
import PreAuths from "../components/preauth";
import Layout from "../components/common/AppLayout";
import Dashboard from "../components/dashboard";
import CoverageEligibilityHome from "../components/eligibility";

const routes = {
  "/": () => <Dashboard />,
  "/coverage": () => <CoverageEligibilityHome />,
  "/claims": () => <Claims />,
  "/preauths": () => <PreAuths />,
};

export default function AppRouter() {
  let route = useRoutes(routes);
  return <Layout>{route}</Layout>;
}

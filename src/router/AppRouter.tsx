import { useRoutes } from "raviger";
import Claims from "../components/claims";
import PreAuths from "../components/preauth";
import Layout from "../components/common/AppLayout";
import Dashboard from "../components/dashboard";
import CoverageEligibilityHome from "../components/eligibility";
import CoverageDetail from "../components/eligibility/CoverageDetail";
import ClaimDetails from "../components/claims/ClaimDetails";
import PreAuthDetails from "../components/preauth/PreAuthDetails";

const routes = {
  "/": () => <Dashboard />,
  "/coverage": () => <CoverageEligibilityHome />,
  "/coverage/:id" : ({id}: any) => <CoverageDetail id={id} />,
  "/claims": () => <Claims />,
  "/claims/:id" : ({id}: any) => <ClaimDetails id={id} />,
  "/preauths": () => <PreAuths />,
  "/preauths/:id" : ({id}: any) => <PreAuthDetails id={id} />,
};

export default function AppRouter() {
  let route = useRoutes(routes);
  return <Layout>{route}</Layout>;
}

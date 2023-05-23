import { useRoutes } from "raviger";
import Claims from "../components/claims";
import PreAuths from "../components/preauth";
import Layout from "../components/common/AppLayout";
import Dashboard from "../components/dashboard";
import CoverageEligibilityHome from "../components/eligibility";
import CoverageDetail from "../components/eligibility/CoverageDetail";
import ClaimDetails from "../components/claims/ClaimDetails";
import Login from "../components/auth/Login";
import Profile from "../components/profile";

const routes = {
  "/": () => <Dashboard />,
  "/profile": () => <Profile />,
  "/coverage": () => <CoverageEligibilityHome />,
  "/coverage/:id": ({ id }: any) => <CoverageDetail id={id} />,
  "/claims": () => <Claims />,
  "/claims/:id": ({ id }: any) => (
    <ClaimDetails request_id={id} use={"claim"} />
  ),
  "/preauths": () => <PreAuths />,
  "/preauths/:id": ({ id }: any) => (
    <ClaimDetails request_id={id} use={"preauth"} />
  ),
};

export default function AppRouter() {
  let route = useRoutes(routes);
  return <Layout>{route}</Layout>;
}

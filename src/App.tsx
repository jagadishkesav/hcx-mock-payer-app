
import { lazy, useEffect, useState } from 'react';
import { Route, Routes , Navigate } from 'react-router-dom';

import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import CoverageEligibilityList from './pages/CoverageEligibility/CoverageEligibilityList';
import PreauthList from './pages/Preauth/PreauthList';
import ClaimsList from './pages/Claims/Claims';
import ClaimDetail from './pages/Claims/ClaimDetails';
import CoverageEligibilityDetails from './pages/CoverageEligibility/CoverageEligibilityDetails';
import Home from './pages/Home/Home';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  console.log("i started");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={<SignIn/>}
        >  
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<DefaultLayout />}>
        <Route
            path="/home"
            element={
              <>
                <PageTitle title="Home" />
                <Home />
              </>
            }
          />
          <Route
            path="/coverageeligibility/list"
            element={
              <>
                <PageTitle title="Coverage Eligibility" />
                <CoverageEligibilityList />
              </>
            }
          />
          <Route
            path="/coverageeligibility/details"
            element={
              <>
                <PageTitle title="Coverage Eligibility" />
                <CoverageEligibilityDetails />
              </>
            }
          />
          <Route
            path="/preauth/list"
            element={
              <>
                <PageTitle title="PreAuthorization" />
                <PreauthList claimType='preauth'/>
              </>
            }
          />
          
          <Route
            path="/preauth/detail"
            element={
              <>
                <PageTitle title="PreAuthorization" />
                <ClaimDetail claimType='preauth'/>
              </>
            }
          />
           <Route
            path="/claims/list"
            element={
              <>
                <PageTitle title="Claims" />
                <ClaimsList claimType='claim'/>
              </>
            }
          />
          <Route
            path="/claims/detail"
            element={
              <>
                <PageTitle title="Claims" />
                <ClaimDetail claimType='claim'/>
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
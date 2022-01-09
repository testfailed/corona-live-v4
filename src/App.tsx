import React, { lazy, Suspense, useEffect } from "react";

import axios from "axios";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";

import {
  CITY_PATH,
  DOMESTIC_PATH,
  SOCIAL_DISTANCING_PATH,
  VACCINE_PATH,
  WORLD_PATH,
} from "@constants/route-constants";
import { removeSlash } from "@utils/string-util";
import { globalCss } from "@styles/stitches.config";

import Layout from "@components/layout/Layout";
import MutationHandler from "@components/MutationHandler";
import FinalCasesModal from "@components/modal/Modal_FinalCases";
import NotificationModal from "@components/modal/Modal_Notification";
import AnnouncementModal from "@components/modal/Modal_Announcement";

import Domestic from "@pages/domestic/Domestic_Page";
import CityPageSkelton from "@pages/city/City_PageSkeleton";
import WorldPageSkeleton from "@pages/world/World_PageSkeleton";
import VaccinePageSkeleton from "@pages/vaccine/Vaccine_PageSkeleton";
import DomesticPageSkeleton from "@pages/domestic/Domestic_PageSkeleton";
import SamsungDarkModeAlertModal from "@components/modal/Modal_SamsungDarkMode";
import SocialDistancingPageSkeleton from "@pages/social-distancing/SocialDistancing_PageSkeleton";
import { API_URL } from "@constants/constants";

const CityPage = lazy(() => import("@pages/city/City_Page"));
const WorldPage = lazy(() => import("@pages/world/World_Page"));
const VaccinePage = lazy(() => import("@pages/vaccine/Vaccine_Page"));
const SocialDistancingPage = lazy(
  () => import("@pages/social-distancing/SocialDistancing_Page")
);

axios.defaults.baseURL = API_URL;

const pages = [
  {
    path: DOMESTIC_PATH,
    component: Domestic,
    skeleton: DomesticPageSkeleton,
  },
  {
    path: `${CITY_PATH}/:cityId`,
    component: CityPage,
    skeleton: CityPageSkelton,
  },
  {
    path: WORLD_PATH,
    component: WorldPage,
    skeleton: WorldPageSkeleton,
  },
  {
    path: SOCIAL_DISTANCING_PATH,
    component: SocialDistancingPage,
    skeleton: SocialDistancingPageSkeleton,
  },
  {
    path: VACCINE_PATH,
    component: VaccinePage,
    skeleton: VaccinePageSkeleton,
  },
];

const globalStyles = globalCss({
  body: { color: "$gray900" },
});

const App: React.FC = () => {
  globalStyles();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (window.location.hash) window.history.replaceState(null, "", " ");
  }, []);

  const Skeleton = pages.find(({ path }) =>
    path.includes(":")
      ? pathname.startsWith(path.split(":")[0])
      : removeSlash(pathname) === removeSlash(path)
  )?.skeleton;

  return (
    <>
      <Layout hideMobileHeader={pathname.startsWith("/city")}>
        <Suspense fallback={Skeleton ? <Skeleton /> : <></>}>
          <Switch location={location}>
            {pages.map((page, index) => {
              return (
                <Route
                  exact
                  path={page.path}
                  render={() => <page.component />}
                  key={index}
                />
              );
            })}
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </Layout>

      <NotificationModal />
      <AnnouncementModal />
      <FinalCasesModal />
      <SamsungDarkModeAlertModal />

      <MutationHandler />
    </>
  );
};

export default App;

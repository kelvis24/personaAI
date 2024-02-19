import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Spin } from "antd";
import {
  SideNavigation,
  TopNavigation,
  SideActions,
  AppLayout,
} from "./components";
import {
  LandingPage,
  SignUpPage,
  HomePage,
  AddDatabasePage,
  ViewDatabasePage,
  HelpPage,
} from "./pages";
import { auth } from "./lib/firebase"; // Import your Firebase auth instance

import {
  SignUpPageAction,
  SignUpPageErrorBoundary,
  SignUpPageLoader,
} from "./pages/SignUpPage/loaders";
// import { AddPageAction } from "./pages/AddPage/loaders";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    // Show loading indicator or placeholder
    return <Spin />;
  }

  const pageStyling = {
    flex: 1,
    height: "100%",
    paddingTop: "2rem",
  };

  const routesJSX = (
    <Route>
      <Route
        path="/"
        element={
          <AppLayout
            TopNavigation={null}
            SideNavigation={null}
            SideAction={null}
            PageContent={<LandingPage />}
          />
        }
      />
     <Route
        path="/signup"
        loader={SignUpPageLoader}
        action={SignUpPageAction}
        ErrorBoundary={SignUpPageErrorBoundary}
        element={
          <AppLayout
            TopNavigation={<></>}
            SideNavigation={null}
            SideAction={null}
            PageContent={
              <div style={pageStyling}>
                {!user ? <SignUpPage /> : <Navigate to="/home" replace={true} />}
              </div>
            }
          />
        }
      />

      <Route
        path="/home"
        // loader={HomePageLoader}
        // action={HomePageAction}
        element={
          <AppLayout
            TopNavigation={<TopNavigation />}
            SideNavigation={<SideNavigation />}
            SideAction={<SideActions />}
            PageContent={
              <div style={pageStyling}>
                {user ? (
                  <HomePage />
                ) : (
                  <Navigate to="/" replace={true} />
                )}
              </div>
            }
          />
        }
      />

      <Route
        path="/add-to-database"
        // loader={HomePageLoader}
        // action={HomePageAction}
        element={
          <AppLayout
            TopNavigation={<TopNavigation />}
            SideNavigation={<SideNavigation />}
            SideAction={<SideActions />}
            PageContent={
              <div style={pageStyling}>
                {user ? (
                  <AddDatabasePage />
                ) : (
                  <Navigate to="/" replace={true} />
                )}
              </div>
            }
          />
        }
      />

      <Route
        path="/view-database"
        // loader={HomePageLoader}
        // action={HomePageAction}
        element={
          <AppLayout
            TopNavigation={<TopNavigation />}
            SideNavigation={<SideNavigation />}
            SideAction={<SideActions />}
            PageContent={
              <div style={pageStyling}>
                {user ? (
                  <ViewDatabasePage />
                ) : (
                  <Navigate to="/" replace={true} />
                )}
              </div>
            }
          />
        }
      />


      <Route
        path="/help"
        // loader={HomePageLoader}
        // action={HomePageAction}
        element={
          <AppLayout
            TopNavigation={<TopNavigation />}
            SideNavigation={<SideNavigation />}
            SideAction={<SideActions />}
            PageContent={
              <div style={pageStyling}>
                {user ? (
                  <HelpPage />
                ) : (
                  <Navigate to="/" replace={true} />
                )}
              </div>
            }
          />
        }
      />


    </Route>
  );

  const routes = createRoutesFromElements(routesJSX);

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
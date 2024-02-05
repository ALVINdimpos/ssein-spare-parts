import {
  HomePage,
  NotFoundPage,
  UnAuthorizedPage,
  SingleProductPage,
  NewPartsPage,
  UsedPartsPage,
} from "../pages";

// Public Routes
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/unauthorized", element: <UnAuthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
  { path: "/single-product", element: <SingleProductPage /> },
  { path: "/new-parts", element: <NewPartsPage /> },
  { path: "/used-parts", element: <UsedPartsPage /> },
];

// Protected Routes

export { publicRoutes };

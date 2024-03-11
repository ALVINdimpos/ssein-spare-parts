import {
  HomePage,
  NotFoundPage,
  UnAuthorizedPage,
  SingleProductPage,
  NewPartsPage,
  UsedPartsPage,
  ProductUnderCategoryPage,
  ContactPage,
  LoginPage,
  CorollaPage,
  ProductListPage,
  PartsListPage,
  PartDetailPage,
} from "../pages";

// Public Routes
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/unauthorized", element: <UnAuthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
  { path: "/single-product/:id", element: <SingleProductPage /> },
  { path: "/new-parts", element: <NewPartsPage /> },
  { path: "/used-parts", element: <UsedPartsPage /> },
  { path: "/product-under-category", element: <ProductUnderCategoryPage /> },
  { path: "/contact-us", element: <ContactPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/corolla/:year/:make/:model/:engine", element: <CorollaPage /> },
  { path: "/product-list", element: <ProductListPage /> },
  {
    path: "/parts-list/:year/:make/:model/:trim/:engine/:subCategory",
    element: <PartsListPage />,
  },
  { path: "/part-detail/:id", element: <PartDetailPage /> },
];

// Protected Routes

export { publicRoutes };

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
} from "../pages";

// Public Routes
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/unauthorized", element: <UnAuthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
  { path: "/single-product", element: <SingleProductPage /> },
  { path: "/new-parts", element: <NewPartsPage /> },
  { path: "/used-parts", element: <UsedPartsPage /> },
  { path: "/product-under-category", element: <ProductUnderCategoryPage /> },
  { path: "/contact-us", element: <ContactPage /> },
  { path: "/login", element: <LoginPage /> },
];

// Protected Routes

export { publicRoutes };

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
  YarisPage,
  ToyotaCamryHybridPage,
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
  { path: "/corolla", element: <CorollaPage /> },
  { path: "/yaris", element: <YarisPage /> },
  { path: "/toyota-camry-hybrid", element: <ToyotaCamryHybridPage /> },
];

// Protected Routes

export { publicRoutes };

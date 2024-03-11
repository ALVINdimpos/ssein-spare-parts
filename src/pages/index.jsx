// eslint-disable-next-line no-unused-vars
import PropTypes from "prop-types";

import {
  Home,
  NotFound,
  UnAuthorized,
  SingleProduct,
  NewParts,
  Usedparts,
  ProductUnderCategory,
  Contact,
  Login,
  Corolla,
  ProductList,
  PartsList,
  PartDetail,
} from "../containers";

// public routes
const HomePage = () => <Home />;
const NotFoundPage = () => <NotFound />;
const UnAuthorizedPage = () => <UnAuthorized />;
const SingleProductPage = () => <SingleProduct />;
const NewPartsPage = () => <NewParts />;
const UsedPartsPage = () => <Usedparts />;
const ProductUnderCategoryPage = () => <ProductUnderCategory />;
const ContactPage = () => <Contact />;
const LoginPage = () => <Login />;
const CorollaPage = () => <Corolla />;
const ProductListPage = () => <ProductList />;
const PartsListPage = () => <PartsList />;
const PartDetailPage = () => <PartDetail />;

// export
export {
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
};

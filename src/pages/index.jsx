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
  Yaris,
  ToyotaCamryHybrid,
  Rav4,
  Rav4Hybrid,
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
const YarisPage = () => <Yaris />;
const ToyotaCamryHybridPage = () => <ToyotaCamryHybrid />;
const Rav4Page = () => <Rav4 />;
const Rav4HybridPage = () => <Rav4Hybrid />;

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
  YarisPage,
  ToyotaCamryHybridPage,
  Rav4Page,
  Rav4HybridPage,
};

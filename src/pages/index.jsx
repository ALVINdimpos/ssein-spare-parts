// eslint-disable-next-line no-unused-vars
import PropTypes from "prop-types";

import {
  Home,
  NotFound,
  UnAuthorized,
  SingleProduct,
  NewParts,
  Usedparts,
} from "../containers";

// public routes
const HomePage = () => <Home />;
const NotFoundPage = () => <NotFound />;
const UnAuthorizedPage = () => <UnAuthorized />;
const SingleProductPage = () => <SingleProduct />;
const NewPartsPage = () => <NewParts />;
const UsedPartsPage = () => <Usedparts />;
// protected pages

// export
export {
  HomePage,
  NotFoundPage,
  UnAuthorizedPage,
  SingleProductPage,
  NewPartsPage,
  UsedPartsPage,
};

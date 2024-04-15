/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-target-blank */
import PropTypes from "prop-types";

export function Footer() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow">{/* Your main content here */}</main>
    </div>
  );
}

Footer.defaultProps = {
  brandName: "Alvin Coder",
  brandLink: "https://www.alvincoder.com",
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;

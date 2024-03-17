/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-target-blank */
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex flex-wrap items-center justify-center w-full gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" />{" "}
          by{" "}
          <a
            href={brandLink}
            target="_blank"
            className="font-bold transition-colors hover:text-blue-500"
          >
            {brandName}
          </a>{" "}
        </Typography>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Alvin",
  brandLink: "https://www.alvincoder.com",
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;

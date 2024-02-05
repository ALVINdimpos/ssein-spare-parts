import { CgSpinner } from "react-icons/cg";
import PropTypes from "prop-types";

const Spinner = ({ moreStyles }) => {
  return (
    <div
      className={`w-full px-8 pt-4 ${moreStyles}  flex items-center justify-center`}
    >
      <CgSpinner size={25} className="animate-spin text-primary" />
    </div>
  );
};

export default Spinner;

// Type Checking using PropTypes
Spinner.propTypes = {
  moreStyles: PropTypes.string,
};

Spinner.defaultProps = {
  moreStyles: "min-h-[40vh]",
};

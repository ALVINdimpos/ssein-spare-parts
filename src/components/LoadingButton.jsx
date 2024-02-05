import PropTypes from "prop-types";
import { Button } from "antd";
import { ImSpinner2 } from "react-icons/im";

const LoadingButton = ({ buttonText, loading, ...restProps }) => {
  return (
    <Button
      loading={loading}
      icon={loading ? <ImSpinner2 className="animate-spin" /> : null}
      {...restProps}
    >
      {buttonText}
    </Button>
  );
};

LoadingButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LoadingButton;

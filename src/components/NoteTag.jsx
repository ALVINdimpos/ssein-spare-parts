import PropTypes from "prop-types";
import { Alert } from "antd";

const NoteTag = ({ type, text }) => (
  <Alert message={text} type={type} showIcon className="mb-[16px] mt-2" />
);

NoteTag.propTypes = {
  type: PropTypes.oneOf(["success", "info", "warning", "error"]).isRequired,
  text: PropTypes.string.isRequired,
};

export default NoteTag;

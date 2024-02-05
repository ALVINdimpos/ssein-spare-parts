import { notification } from "../utils";

const handleResponse = (response) => {
  if (response?.data?.ok) {
    notification(response.data.message, "success", "bottomLeft");
  } else {
    notification("Something went wrong!", "error", "bottomLeft");
  }
  return response.data.message;
};

export default handleResponse;

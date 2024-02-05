// dependency imports
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  // navigate
  const navigate = useNavigate();
  // handle back
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="not-found">
      <Result
        status="403"
        title="403"
        subTitle="You are not authorized to visit this page"
        extra={
          <Button type="primary" onClick={handleBack} className="antdButton">
            <span>Go to the Home Page</span>
          </Button>
        }
      />
    </div>
  );
};

export default UnAuthorized;

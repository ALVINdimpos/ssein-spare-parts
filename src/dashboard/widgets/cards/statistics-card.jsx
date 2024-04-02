import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

export function StatisticsCard({ color, icon, title, value }) {
  const cardColor = title === "Loss" ? "red" : color;

  // Format large numbers with thousands separators
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card className="border shadow-sm border-blue-gray-100">
      <CardHeader
        variant="black"
        color={cardColor}
        floated={false}
        shadow={false}
        className="absolute grid w-12 h-12 m-4 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mt-6">
          {title === "Users" || title === "Tax Documents"
            ? formattedValue
            : `${formattedValue} RWF`}
        </Typography>
      </CardBody>
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;

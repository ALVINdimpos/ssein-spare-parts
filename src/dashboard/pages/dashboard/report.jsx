import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const API_URL = "https://parts.husseinking.com";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/metrics/profit-loss-graph`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();
        setReportData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!reportData) {
    return <div>Loading...</div>;
  }

  const { profit_graph, loss_graph } = reportData;

  const mergedData = profit_graph?.map((item, index) => {
    const profit = parseFloat(item.amount);
    const loss = loss_graph[index] ? parseFloat(loss_graph[index].amount) : 0; // Providing default value for loss if loss_graph is empty
    const month = getMonthName(item.date.split("-")[1]); // Extracting and converting month to name
    const year = item.date.split("-")[0]; // Extracting year from date
    const type = Math.abs(profit) >= Math.abs(loss) ? "Profit" : "Loss"; // Selecting profit if its absolute value is greater or equal to loss
    const amount = type === "Profit" ? profit : loss; // Selecting the amount based on the type (profit or loss)
    return {
      month,
      year,
      amount,
      type,
    };
  });

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <Typography variant="h6" color="white">
            Profit and Loss Report
          </Typography>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={mergedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  name="Profit/Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const getMonthName = (monthNumber) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[parseInt(monthNumber, 10) - 1];
};

export default Reports;

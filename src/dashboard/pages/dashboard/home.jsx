import { useEffect, useState } from "react";
import axios from "axios";
import { StatisticsCard } from "../../widgets/cards";
import Tables from "./tables";
import { AiOutlineStock } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";

export function Home() {
  const [data, setData] = useState({});
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://parts.kagaba.tech/metrics/metrics",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        setData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const isAgent = userRole === "agent";
  // Calculate the sum of profit and loss
  const totalProfit = parseFloat(data.profit) || 0;
  const totalLoss = parseFloat(data.loss) || 0;
  const total = totalProfit + totalLoss;

  // Determine if the total represents a profit or loss
  const profitOrLoss = total >= 0 ? "Profit" : "Loss";

  // Icon and color for the loss/profit card
  const icon =
    profitOrLoss === "Profit" ? (
      <RiMoneyDollarCircleLine />
    ) : (
      <FaMoneyBillWave />
    );
  const color = profitOrLoss === "Profit" ? "gray" : "red";

  // Statistics data for agent users
  const statisticsData = [];
  if (userRole === "agent") {
    statisticsData.push({
      title: "Sold Today",
      value: data.sold_today || 0,
      icon: <RiExchangeDollarLine />,
      color: "gray",
    });
  }
  // Statistics data for superadmin users
  if (userRole === "superadmin") {
    statisticsData.push(
      {
        title: "In Stock",
        value: data.stock || 0,
        icon: <AiOutlineStock />,
        color: "gray",
      },
      {
        title: "Tax Documents",
        value: data.tax_docs || 0,
        icon: <IoDocumentTextOutline />,
        color: "gray",
      },
      {
        title: "Sold Today",
        value: data.sold_today || 0,
        icon: <RiExchangeDollarLine />,
        color: "gray",
      },
      {
        title: "Users",
        value: data.users || 0,
        icon: <IoDocumentTextOutline />,
        color: "gray",
      },
    );
  }

  return (
    <div className="mt-12">
      <div className="grid mb-12 gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-4">
        {!isAgent && (
          <span className="">
            <StatisticsCard
              color={color}
              icon={icon}
              title={`${profitOrLoss} / Loss`}
              value={total}
            />
          </span>
        )}
        {statisticsData.map((item, index) => (
          <StatisticsCard
            key={index}
            color={item.color}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
      <Tables />
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import axios from "axios";
import { StatisticsCard } from "../../widgets/cards";
import Tables from "./tables";
import { AiOutlineStock } from "react-icons/ai";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export function Home() {
  const [data, setData] = useState({});

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
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Define icon mappings for each key in the data object
  const iconMappings = {
    stock: <AiOutlineStock />,
    sold_today: <RiExchangeDollarLine />,
    sold: <FaExchangeAlt />,
    users: <IoIosPeople />,
    profit: <RiMoneyDollarCircleLine />,
    loss: <FaMoneyBillWave />,
    tax_docs: <IoDocumentTextOutline />,
  };

  // Define color mappings for each key in the data object
  const colorMappings = {
    stock: "gray",
    sold_today: "gray",
    sold: "gray",
    users: "gray",
    profit: "gray",
    loss: "red",
    tax_docs: "gray",
  };

  // Transform the data object into an array of objects compatible with StatisticsCard
  const statisticsData = Object.entries(data).map(([key, value]) => ({
    color: colorMappings[key],
    icon: iconMappings[key],
    title: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
    value: value,
  }));

  return (
    <div className="mt-12">
      <div className="grid mb-12 gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-4">
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

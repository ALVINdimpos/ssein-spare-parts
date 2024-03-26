import { AiOutlineStock } from "react-icons/ai";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: AiOutlineStock,
    title: "Current In Stock",
    value: "1000 RWF",
  },
  {
    color: "gray",
    icon: RiExchangeDollarLine,
    title: "Sold Today",
    value: "1000 RWF",
  },
  {
    color: "gray",
    icon: FaExchangeAlt,
    title: "Sold ",
    value: "1000 RWF",
  },
  {
    color: "gray",
    icon: IoIosPeople,
    title: "Users",
    value: "10",
  },
  {
    color: "gray",
    icon: RiMoneyDollarCircleLine,
    title: "Profit",
    value: "10 RWF",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: FaMoneyBillWave,
    title: "Loss",
    value: "10 RWF",
    footer: {
      color: "text-red-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: IoDocumentTextOutline,
    title: "Tax Documents",
    value: "10",
  },
];

export default statisticsCardsData;

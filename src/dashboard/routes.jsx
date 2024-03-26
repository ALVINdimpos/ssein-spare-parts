import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { IoIosPeople } from "react-icons/io";
import {
  Home,
  Tables,
  Notifications,
  UserTables,
  Reports,
  DebtorTable,
  CreditorTable,
} from "./pages/dashboard";
import { AiOutlineShopping } from "react-icons/ai";
import { BiSolidReport } from "react-icons/bi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <AiOutlineShopping {...icon} />,
        name: "products",
        path: "/products",
        element: <Tables />,
      },

      {
        icon: <IoIosPeople {...icon} />,
        name: "Users",
        path: "/users",
        element: <UserTables />,
      },
      {
        icon: <BiSolidReport {...icon} />,
        name: "Reports",
        path: "/reports",
        element: <Reports />,
      },
      {
        icon: <FaMoneyCheckAlt {...icon} />,
        name: "Debtors",
        path: "/debtors",
        element: <DebtorTable />,
      },
      {
        icon: <FaMoneyBillTrendUp {...icon} />,
        name: "Creditors",
        path: "/creditors",
        element: <CreditorTable />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
];

export default routes;

import { HomeIcon } from "@heroicons/react/24/solid";
import { IoIosPeople } from "react-icons/io";
import {
  Home,
  Tables,
  UserTables,
  Reports,
  DebtorTable,
  CreditorTable,
  QueriesTable,
  InquiriesTable,
  Profile,
  CarsPage,
  CashBookTable,
  ClientTables,
} from "./pages/dashboard";
import { AiOutlineShopping } from "react-icons/ai";
import { BiSolidReport } from "react-icons/bi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { LuMailQuestion } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { PiCarFill } from "react-icons/pi";
import { IoCash } from "react-icons/io5";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = (userRole) => {
  const allRoutes = [
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
          element: userRole !== "client" ? <Tables /> : <ClientTables />,
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
          icon: <MdOutlineQuestionAnswer {...icon} />,
          name: "queries",
          path: "/queries",
          element: <QueriesTable />,
        },
        {
          icon: <LuMailQuestion {...icon} />,
          name: " Product inquiries",
          path: "/inquiries",
          element: <InquiriesTable />,
        },
        {
          icon: <IoCash {...icon} />,
          name: "Cash Book",
          path: "/cash-book",
          element: <CashBookTable />,
        },
        {
          icon: <PiCarFill {...icon} />,
          name: "Cars",
          path: "/cars",
          element: <CarsPage />,
        },
        {
          icon: <ImProfile {...icon} />,
          name: "Profile",
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
  ];

  if (userRole === "superadmin" || userRole === "admin") {
    // Superadmin has access to all routes
    return allRoutes;
  } else if (userRole === "agent") {
    // Other users have restricted access
    // You can define your own logic here for restricting routes
    // For example, let's say non-superadmins can only access Home and Products
    const restrictedRoutes = allRoutes.map((route) => ({
      ...route,
      pages: route.pages.filter(
        (page) =>
          page.name === "dashboard" ||
          page.name === "products" ||
          page.name === "Debtors" ||
          page.name === "Profile",
      ),
    }));

    return restrictedRoutes;
  } else {
    // If the user is not an admin or a superadmin
    // You can define your own logic here for restricting routes
    // For example, let's say non-superadmins can only access Home and Products
    const restrictedRoutes = allRoutes.map((route) => ({
      ...route,
      pages: route.pages.filter(
        (page) => page.name === "products" || page.name === "Profile",
      ),
    }));

    return restrictedRoutes;
  }
};

export default routes;

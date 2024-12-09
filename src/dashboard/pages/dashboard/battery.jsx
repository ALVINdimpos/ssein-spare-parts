import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineTransaction } from "react-icons/ai";
import axios from "axios";
import Loader from "react-js-loader";
import { jwtDecode } from "jwt-decode";
import { FaFilePdf } from "react-icons/fa6";
import { RiPageSeparator } from "react-icons/ri";
import BatteryDismantleModal from "./BatteryDismantleModal";

export function Battery() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewBattery, setViewBattery] = useState(false);
  const [editBattery, setEditBattery] = useState(false);
  const [sellBattery, setSellBattery] = useState(false);
  const [singleBattery, setSingleBattery] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [BatteryTableData, setBatteryTableData] = useState([]);
  const [filteredBatteries, setFilteredBatteries] = useState([]);
  const [isSoldFilter, setIsSoldFilter] = useState("all");
  const [BatteryData, setBatteryData] = useState({
    cells_count: "",
    selling_price: 0,
    purchase_price: 0,
    tax: 0,
    other_expenses: 0,
    discount: 0,
    context: "",
    sold_date: "",
    is_sold: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingBatteryId, setEditingBatteryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [BatteriesPerPage] = useState(15);
  const [isDismantleModalOpen, setIsDismantleModalOpen] = useState(false);
  const [selectedBatteryIdForDismantle, setSelectedBatteryIdForDismantle] =
    useState(null);
  const [selectedBatteryCellCount, setSelectedBatteryCellCount] = useState(0);

  const API_URL = "https://test.husseinking.com";
  const handleAddBattery = () => {
    setShowAddForm(!showAddForm);
  };
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
        const response = await axios.get(` ${API_URL}/battery/full`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setBatteryTableData(response.data?.data?.batteries);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log("BatteryTableData", BatteryTableData);
  // Update the calculation of indexOfFirstBattery and indexOfLastBattery to use filteredBatteries
  const indexOfLastBattery = currentPage * BatteriesPerPage;
  const indexOfFirstBattery = indexOfLastBattery - BatteriesPerPage;
  const currentBatteries = filteredBatteries?.slice(
    indexOfFirstBattery,
    indexOfLastBattery,
  );

  const handleSellBatteries = async (id) => {
    const getBatteryResponse = await axios.get(
      `${API_URL}/battery/full/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    setSingleBattery(getBatteryResponse?.data?.data?.battery);
    setSellBattery(true);
    setEditingBatteryId(id);
    // Other logic for editing Battery...
  };

  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        cells_count,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
      } = BatteryData;

      const requestData = {
        cells_count,
        selling_price,
        purchase_price,
        tax,
        discount: 0,
        is_sold: false,
        sold_date: Date.now(),
        context: "",
        other_expenses,
      };
      await axios.post(`${API_URL}/battery/`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Battery added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage("Failed to add Battery. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDismantle = (id, cellCount) => {
    setSelectedBatteryIdForDismantle(id);
    setSelectedBatteryCellCount(cellCount);
    setIsDismantleModalOpen(true);
  };
  const handleViewEditBattery = async (id) => {
    const getBatteryResponse = await axios.get(
      `${API_URL}/battery/full/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    setSingleBattery(getBatteryResponse?.data?.data?.battery);
    setEditBattery(true);
    setEditingBatteryId(id);
  };
  const handleEditBattery = async (id) => {
    setLoading(true);
    try {
      const {
        cells_count,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
      } = BatteryData;

      const requestData = {
        cells_count,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
      };
      await axios.patch(`${API_URL}/battery/full/${id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEditBattery(false);
      setBatteryData({
        cells_count: "",
        selling_price: 0,
        purchase_price: 0,
        tax: 0,
        other_expenses: 0,
      });
      toast.success("Battery updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating Battery:", error);
      toast.error("Error updating Battery");
    }
  };
  const handleSellBattery = async () => {
    setLoading(true);
    try {
      const { discount, context, selling_price } = BatteryData;
      const requestData = {
        discount,
        context,
        is_sold: true,
        sold_fully: true,
        selling_price,
        sold_date: Date.now(),
      };
      // get Battery
      await axios.patch(
        `${API_URL}/battery/full/${editingBatteryId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      toast.success("Battery sold successfully");
      window.location.reload();
      setEditingBatteryId(null);
    } catch (error) {
      setErrorMessage("Failed to sell Battery. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handlePrintQRCodeInPdf = () => {
    const doc = new jsPDF();
    doc.addImage(Battery, "JPEG", 10, 10, 100, 100);
    doc.save("QRCode.pdf");
    toast.success("QR Code printed successfully");
  };
  const handleDeleteBattery = async (id) => {
    try {
      // Show a confirmation dialog before deleting the Battery
      const confirmed = window.confirm(
        "Are you sure you want to delete this Battery?",
      );
      if (!confirmed) {
        return; // If user cancels, do not proceed with deletion
      }
      await axios.delete(`${API_URL}/battery/full/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      window.location.reload();
      toast.success("Battery deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Deleting Battery failed:", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when search query changes
  };
  const handleSoldFilterChange = (e) => {
    const { value } = e.target;
    setIsSoldFilter(value);
  };
  console.log("singleBattery", BatteryTableData);
  useEffect(() => {
    if (isSoldFilter === "all") {
      // Show all Batteries without any additional filtering
      setFilteredBatteries(BatteryTableData);
    } else {
      // Apply filtering based on the selected filter value
      const filteredData = BatteryTableData?.filter((battery) => {
        if (isSoldFilter === "selected") {
          return battery.actions.some(
            (action) => action.action_type === "intent",
          );
        } else if (isSoldFilter === "sold") {
          return battery.is_sold;
        } else if (isSoldFilter === "inStock") {
          return !Battery.is_sold;
        } else if (isSoldFilter === "dismantled") {
          return Battery.sold_fully;
        }

        return false;
      });
      setFilteredBatteries(filteredData);
    }
    setCurrentPage(1); // Reset pagination to first page when filter changes
  }, [isSoldFilter, searchQuery, BatteryTableData]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Function to download data as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Id",
          "Cells Count",
          "Selling Price",
          "Purchase Price",
          "Tax",
          "Other Expenses",
          "Discount",
          "Context",
          "Status",
        ],
      ],
      body: filteredBatteries.map(
        ({
          id,
          cells_count,
          selling_price,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold,
        }) => [
          id,
          cells_count,
          selling_price,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold ? "Sold" : "In Stock",
        ],
      ),
    });
    doc.save("Batteries.pdf");
  };

  return (
    <div className="flex flex-col mt-12 mb-8 overflow-x-auto">
      <Card>
        <CardHeader variant="black" color="gray" className="p-4 mb-8 md:p-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography
              variant="h6"
              color="white"
              className="mb-2 md:mb-0 md:mr-4"
            >
              Batteries
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search Battery..."
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <select
                value={isSoldFilter}
                onChange={handleSoldFilterChange}
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                style={{
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="all">All</option>
                <option value="sold">Sold</option>
                <option value="inStock">In Stock</option>
                <option value="dismantled">Dismantled</option>
              </select>
              <Button
                onClick={handleAddBattery}
                color="indigo"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
                className="flex items-center gap-2 mt-2 md:mt-0"
              >
                <IoMdAddCircle className="text-xl" />
                <span className="text-base font-medium">Add New Battery</span>
              </Button>
              <Button
                color="gray"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
                onClick={handleDownloadPDF}
              >
                <FaFilePdf className="text-xl" />
              </Button>
              {/* {handleDownloadCSV()} */}
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          {filteredBatteries?.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                {/* Table headers */}
                <thead>
                  <tr>
                    {[
                      "Cells Count",
                      "Status",
                      "Selling Price",
                      "Purchase Price",
                      "Tax",
                      "Other Expenses",
                      "Discount",
                      "Context",
                      "Action",
                      "Action owner",
                      "Action date",
                    ].map((el) => (
                      <th
                        key={el}
                        className="px-5 py-3 text-left border-b border-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {filteredBatteries?.map(
                    (
                      {
                        id,
                        cells_count,
                        selling_price,
                        purchase_price,
                        tax,
                        other_expenses,
                        discount,
                        context,
                        is_sold,
                        actions,
                      },
                      key,
                    ) => {
                      const className = `py-3 px-5 ${
                        key === currentBatteries.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={id}>
                          {/* Table data */}
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {cells_count}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {is_sold ? (
                                <span className="text-red-500">Sold</span>
                              ) : (
                                <span className="text-green-500">In Stock</span>
                              )}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {selling_price} RWF
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {purchase_price} RWF
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {tax} RWF
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {other_expenses} RWF
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {discount} RWF
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {context}
                            </Typography>
                          </td>

                          <td className={className}>
                            <div className="flex justify-between gap-1">
                              {!isAgent && !is_sold && (
                                <FaEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => handleViewEditBattery(id)}
                                />
                              )}
                              {!is_sold && ( // Conditionally render the edit button
                                <AiOutlineTransaction
                                  className="text-blue-500 cursor-pointer material-icons"
                                  onClick={() => handleSellBatteries(id)}
                                />
                              )}
                              {(!isAgent || !isAdmin) && (
                                <MdAutoDelete
                                  className="ml-2 text-red-500 cursor-pointer material-icons"
                                  onClick={() => handleDeleteBattery(id)}
                                />
                              )}
                              <RiPageSeparator
                                className="ml-2 text-green-500 cursor-pointer material-icons"
                                onClick={() => handleDismantle(id, cells_count)}
                              />
                            </div>
                          </td>
                          {/* Action Type and Action Owner */}
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {actions.length > 0 && (
                                <>
                                  {actions.map((action, index) => (
                                    <div key={index}>
                                      <span className="text-blue-500">
                                        {action.action_type}
                                      </span>{" "}
                                      by {action.user_name}
                                    </div>
                                  ))}
                                </>
                              )}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {actions.length > 0 && (
                                <>
                                  {actions.map((action, index) => (
                                    <div key={index}>
                                      <span className="text-blue-500">
                                        {new Date(
                                          action.created_at,
                                        ).toLocaleString("default", {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>{" "}
                                    </div>
                                  ))}
                                </>
                              )}
                            </Typography>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
      <div className="flex items-center justify-between mt-6">
        {/* Total Batteries */}
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold"
          >
            Total Batteries: {filteredBatteries?.length}
          </Typography>
        </div>

        {/* Batteries count */}
        <div className="flex items-center gap-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold"
            >
              Showing {currentBatteries?.length} of {filteredBatteries?.length}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <ul className="flex flex-wrap gap-2">
          {Array.from(
            { length: Math.ceil(BatteryTableData?.length / BatteriesPerPage) },
            (_, i) => (
              <li key={i}>
                <Button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  } focus:outline-none`}
                  onClick={() => handlePagination(i + 1)}
                >
                  {i + 1}
                </Button>
              </li>
            ),
          )}
        </ul>
      </div>

      {showAddForm && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Battery
                </h2>
                <button
                  onClick={handleAddBattery}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Cell Count
                </label>
                <input
                  type="text"
                  placeholder="Cell Count"
                  required
                  value={BatteryData.cells_count}
                  onChange={(e) =>
                    setBatteryData({
                      ...BatteryData,
                      cells_count: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    value={BatteryData.selling_price}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        selling_price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Cost
                  </label>
                  <input
                    type="number"
                    placeholder="purchase price"
                    required
                    value={BatteryData.purchase_price}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        purchase_price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Tax
                  </label>
                  <input
                    type="number"
                    placeholder="tax"
                    required
                    value={BatteryData.tax}
                    onChange={(e) =>
                      setBatteryData({ ...BatteryData, tax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Other Expanses
                  </label>
                  <input
                    type="text"
                    placeholder="number"
                    value={BatteryData.other_expenses}
                    required={true}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        other_expenses: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              {errorMessage && (
                <div
                  className="px-4 py-3 text-red-700 bg-red-100 border-l-4 border-red-500"
                  role="alert"
                >
                  <p className="font-bold">{errorMessage}</p>
                </div>
              )}
              <Button
                color="black"
                buttonType="filled"
                size="regular"
                rounded={true}
                block={false}
                iconOnly={false}
                ripple="light"
                className="w-full"
                onClick={handleSubmit}
              >
                {loading ? (
                  <Loader type="spinner-default" bgColor={"#fff"} size={20} />
                ) : (
                  "Add Battery"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {viewBattery && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-between w-full ">
                <Typography variant="h6" color="gray">
                  QR Code
                </Typography>
                <button onClick={() => setViewBattery(false)}>
                  <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <img src={Battery} alt="QR Code" className="mb-4" />

              {/* Print button */}
              <Button
                color="black"
                buttonType="filled"
                size="regular"
                rounded={true}
                block={false}
                iconOnly={false}
                ripple="light"
                className="w-full"
                onClick={handlePrintQRCodeInPdf}
              >
                Print QR Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {sellBattery && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sell Battery
                </h2>
                <button
                  onClick={() => setSellBattery(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit Battery form */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Discount
                    </label>
                    <input
                      type="number"
                      placeholder="Discount"
                      required
                      defaultValue={singleBattery?.discount}
                      onChange={(e) =>
                        setBatteryData({
                          ...BatteryData,
                          discount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mt-2 mb-1 text-sm text-gray-600">
                      Selling Price
                    </label>
                    <input
                      type="text"
                      placeholder={`Selling Price: ${singleBattery?.selling_price} RWF`}
                      required
                      onChange={(e) =>
                        setBatteryData({
                          ...BatteryData,
                          selling_price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Context
                  </label>
                  <textarea
                    type="text"
                    placeholder="Context"
                    required
                    value={BatteryData.context}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        context: e.target.value,
                      })
                    }
                    className="w-full h-[108px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <Button
                color="black"
                buttonType="filled"
                size="regular"
                rounded={true}
                block={false}
                iconOnly={false}
                ripple="light"
                className="w-full mt-3"
                onClick={handleSellBattery}
              >
                {loading ? (
                  <Loader type="spinner-default" bgColor={"#fff"} size={20} />
                ) : (
                  "Sell Battery"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* EDIT Battery */}
      {editBattery && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Battery
                </h2>
                <button
                  onClick={() => setEditBattery(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit Battery form */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    placeholder="Selling Price"
                    required
                    defaultValue={singleBattery?.selling_price}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        selling_price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    placeholder="Purchase Price"
                    defaultValue={singleBattery?.purchase_price}
                    required
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        purchase_price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Tax
                  </label>
                  <input
                    type="text"
                    placeholder="Tax"
                    required
                    defaultValue={singleBattery?.tax}
                    onChange={(e) =>
                      setBatteryData({ ...BatteryData, tax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Other Expenses
                  </label>
                  <input
                    type="text"
                    placeholder="Other Expenses"
                    required
                    defaultValue={singleBattery?.other_expenses}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        other_expenses: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Cell Count
                  </label>
                  <input
                    type="text"
                    placeholder="Cell Count"
                    required
                    defaultValue={singleBattery?.cells_count}
                    onChange={(e) =>
                      setBatteryData({
                        ...BatteryData,
                        cells_count: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    color="black"
                    buttonType="filled"
                    size="regular"
                    rounded={true}
                    block={false}
                    iconOnly={false}
                    ripple="light"
                    className="w-full h-[60px] mt-7"
                    onClick={handleEditBattery}
                  >
                    {loading ? (
                      <Loader
                        type="spinner-default"
                        bgColor={"#fff"}
                        size={20}
                      />
                    ) : (
                      "Edit Battery"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {isDismantleModalOpen && (
        <BatteryDismantleModal
          isOpen={isDismantleModalOpen}
          onClose={() => setIsDismantleModalOpen(false)}
          batteryId={selectedBatteryIdForDismantle}
          cellCount={selectedBatteryCellCount}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default Battery;

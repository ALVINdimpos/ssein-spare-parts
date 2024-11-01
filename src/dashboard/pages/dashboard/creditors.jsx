/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from "react-js-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";
import jsPDF from "jspdf";
export function CreditorTable() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewCreditors, setViewCreditors] = useState(false);
  const [editCreditors, setEditCreditors] = useState(false);
  const [creditorsData, setCreditorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCreditorId, setEditCreditorId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusFilter, setIsStatusFilter] = useState("all");
  const [creditorsPerPage] = useState(5);
  const [filteredCreditors, setFilteredCreditors] = useState([]);

  const [newCreditorData, setNewCreditorData] = useState({
    name: "",
    contact_info: "",
    amount: 0,
    due_date: "",
    context: "",
    payment_status: "Pending",
    scope: "creditors",
  });
  const API_URL = "https://parts.husseinking.com";
  // Event handler to update the new creditor data as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCreditorData({ ...newCreditorData, [name]: value });
  };

  const handleAddDebtor = async () => {
    try {
      setLoading(true);
      await axios.post(`  ${API_URL}/management/`, newCreditorData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      });
      setLoading(false);
      toast.success("Debtor added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response.data.message);
      toast.error("Error adding debtor");
    }
  };

  // Add useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `  ${API_URL}/management/?scope=creditors`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              Accept: "application/json",
            },
          },
        );
        const { data } = response.data;
        if (data && data.records) {
          setCreditorData(data?.records);
          setFilteredCreditors(data?.records);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching creditor data");
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Filter the creditors data based on search query and isStatusFilter
    const filteredData = creditorsData.filter((creditor) => {
      const numMatchesSearch = creditor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatchesSearch = creditor.contact_info
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const statusMatchesSearch = creditor.payment_status
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const contactMatchesSearch = creditor.contact_info
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const amountMatchesSearch = creditor.amount
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const dueDateMatchesSearch = creditor.due_date
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesSearch =
        numMatchesSearch ||
        descriptionMatchesSearch ||
        statusMatchesSearch ||
        contactMatchesSearch ||
        amountMatchesSearch ||
        dueDateMatchesSearch;

      if (isStatusFilter === "all") {
        return matchesSearch;
      } else if (isStatusFilter === "paid") {
        return matchesSearch && creditor.payment_status === "paid";
      } else if (isStatusFilter === "pending") {
        return matchesSearch && creditor.payment_status === "Pending";
      } else if (isStatusFilter === "outstanding") {
        return matchesSearch && creditor.payment_status === "outstanding";
      }
      return false;
    });

    setFilteredCreditors(filteredData);
  }, [searchQuery, isStatusFilter, creditorsData]);
  const handleDeleteCreditors = async (id) => {
    try {
      await axios.delete(`${API_URL}/management/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "application/json",
        },
      });
      toast.success("Creditors deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting Creditors");
    }
  };

  const handleEditCreditors = (id) => {
    setEditCreditors(true);
    setEditCreditorId(id);
  };

  const handleEditCreditorSubmit = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${API_URL}/management/${editCreditorId}`,
        { payment_status: newCreditorData.payment_status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
          },
        },
      );
      setLoading(false);
      toast.success("Creditors updated successfully");
      window.location.reload();
      setEditCreditors(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response.data.message);
      toast.error("Error updating Creditors");
    }
  };

  const handleViewDebtor = (id) => {
    setViewCreditors(true);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "outstanding":
        return "text-red-600";
      default:
        return "text-blue-gray-600";
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastCreditor = currentPage * creditorsPerPage;
  const indexOfFirstCreditor = indexOfLastCreditor - creditorsPerPage;
  const currentCreditors = filteredCreditors.slice(
    indexOfFirstCreditor,
    indexOfLastCreditor,
  );
  const handleStatusFilterChange = (e) => {
    setIsStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  // Helper function to get payment status
  const getPaymentStatus = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "Pending":
        return "Pending";
      case "outstanding":
        return "Outstanding";
      default:
        return "Unknown";
    }
  };
  // Function to download data as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF("l", "pt", "letter");
    console.log(filteredCreditors);
    // Define column widths and row heights
    const columnWidths = [15, 100, 80, 80, 80, 80, 80];
    const rowHeight = 5;

    // Set font size and style
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.autoTable({
      head: [
        [
          "ID",
          "Name",
          "Contact Info",
          "Debt Amount",
          "Due Date",
          "Context",
          "Payment Status",
        ],
      ],
      body: filteredCreditors.map(
        ({
          id,
          name,
          contact_info,
          amount,
          due_date,
          context,
          payment_status,
        }) => [
          id,
          name,
          contact_info,
          amount,
          due_date,
          context,
          getPaymentStatus(payment_status),
        ],
      ),
      startY: 20,
      styles: {
        cellPadding: 3,
        fontSize: 8,
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
        6: { cellWidth: columnWidths[6] },
      },
      headStyles: { fillColor: [0, 0, 0] },
      margin: { top: 30 },
      theme: "grid", // Grid theme
      rowHeight: rowHeight,
    });

    doc.save("products.pdf");
  };
  // function to download data as CSV
  const handleDownloadCSV = () => {
    const csvData = filteredCreditors.map(
      ({
        id,
        name,
        contact_info,
        amount,
        due_date,
        context,
        payment_status,
      }) => [
        id,
        name,
        contact_info,
        amount,
        due_date,
        `"${context.replace(/"/g, '""')}"`,
        getPaymentStatus(payment_status),
      ],
    );

    const headers = [
      "ID",
      "Name",
      "Contact Info",
      "Debt Amount",
      "Due Date",
      "Context",
      "Payment Status",
    ];

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "products.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography variant="h6" color="white" className="mb-4 md:mb-0">
              Creditors
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search Creditors..."
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={() => setShowAddForm(true)}
                color="indigo"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
                className="flex items-center gap-2"
              >
                <IoMdAddCircle className="text-xl" />
                <span className="hidden text-base font-medium md:block">
                  Add New Creditors
                </span>
              </Button>
              <select
                value={isStatusFilter}
                onChange={handleStatusFilterChange}
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="outstanding">Outstanding</option>
              </select>
              <Button
                onClick={handleDownloadPDF}
                color="indigo"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
              >
                <FaFilePdf className="text-xl" />
              </Button>
              <Button
                onClick={handleDownloadCSV}
                color="indigo"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
              >
                <FaFileCsv className="text-xl" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          {currentCreditors.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Contact Info",
                    "Debt Amount",
                    "Due Date",
                    "Context",
                    "Payment Status",
                    "Action",
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
              <tbody>
                {currentCreditors.map(
                  (
                    {
                      id,
                      name,
                      contact_info,
                      amount,
                      due_date,
                      context,
                      payment_status,
                    },
                    key,
                  ) => {
                    const className = `py-3 px-5 ${
                      key === currentCreditors.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={id}>
                        <td className={className}>{id}</td>
                        <td className={className}>{name}</td>
                        <td className={className}>{contact_info}</td>
                        <td className={className}>{amount}</td>
                        <td className={className}>
                          {format(new Date(due_date), "dd/MM/yyyy")}
                        </td>
                        <td className={className}>{context}</td>
                        <td
                          className={`${className} ${getPaymentStatusColor(payment_status)}`}
                        >
                          {payment_status}
                        </td>
                        <td className={className}>
                          <div className="flex">
                            {/* <MdOutlineVisibility className="ml-2 text-green-500 cursor-pointer material-icons" onClick={() => handleViewDebtor(id)} /> */}
                            <FaEdit
                              className="ml-2 text-blue-500 cursor-pointer material-icons"
                              onClick={() => handleEditCreditors(id)}
                            />
                            <MdAutoDelete
                              className="ml-2 text-red-500 cursor-pointer material-icons"
                              onClick={() => handleDeleteCreditors(id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(filteredCreditors.length / creditorsPerPage) },
            (_, i) => (
              <li key={i}>
                <Button
                  className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-black" : "bg-gray-200"} focus:outline-none`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              </li>
            ),
          )}
        </ul>
      </div>
      {showAddForm && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          {/* Add Debtor Form */}
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="gray">
                Add New Creditor
              </Typography>
              <button onClick={() => setShowAddForm(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {/* Add Debtor form */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Creditor Name
              </label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={newCreditorData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Contact Information
              </label>
              <input
                type="text"
                placeholder="Contact Info"
                name="contact_info"
                value={newCreditorData.contact_info}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Cred Amount
                </label>
                <input
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={newCreditorData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={newCreditorData.due_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Context
              </label>
              <textarea
                placeholder="Context"
                name="context"
                value={newCreditorData.context}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
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
              onClick={handleAddDebtor}
              className="w-full"
              disabled={loading}
              type="submit"
              buttonType="filled"
              size="regular"
              rounded={true}
              block={false}
              iconOnly={false}
              ripple="light"
            >
              {loading ? <Loader /> : "Add Creditor"}
            </Button>
          </div>
        </div>
      )}

      {editCreditors && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          {/* Edit Creditor Form */}
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Typography variant="h6" color="gray">
                Change Creditor Status
              </Typography>
              <button onClick={() => setEditCreditors(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {/* Form fields and submit button */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Payment Status
              </label>
              <select
                name="payment_status"
                value={newCreditorData.payment_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="outstanding">Outstanding</option>
              </select>
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
              onClick={handleEditCreditorSubmit}
              className="w-full"
              disabled={loading}
              type="submit"
              buttonType="filled"
              size="regular"
              rounded={true}
              block={false}
              iconOnly={false}
              ripple="light"
            >
              {loading ? <Loader /> : "Update Status"}
            </Button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default CreditorTable;

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

  // Event handler to update the new creditor data as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCreditorData({ ...newCreditorData, [name]: value });
  };

  const handleAddDebtor = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://parts.kagaba.tech/management/",
        newCreditorData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
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
          "https://parts.kagaba.tech/management/?scope=creditors",
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
          setFilteredCreditors(data?.records); // Initialize filtered creditors with all creditors
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching creditor data");
      }
    };

    fetchData();
  }, []);

  const handleDeleteCreditors = async (id) => {
    try {
      await axios.delete(`https://parts.kagaba.tech/management/${id}`, {
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
        `https://parts.kagaba.tech/management/${editCreditorId}`,
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

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography variant="h6" color="white" className="mb-4 md:mb-0">
              Creditors
            </Typography>
            <div className="flex items-center gap-2">
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
                        <td className={className}>{due_date}</td>
                        <td className={className}>{context}</td>
                        <td
                          className={`${className} ${getPaymentStatusColor(payment_status)}`}
                        >
                          {payment_status}
                        </td>
                        <td className={className}>
                          <Button
                            onClick={() => handleViewDebtor(id)}
                            color="gray"
                            buttonType="outline"
                            rounded={false}
                            iconOnly={false}
                            ripple="light"
                          >
                            <MdOutlineVisibility className="text-lg" />
                          </Button>
                          <Button
                            onClick={() => handleEditCreditors(id)}
                            color="amber"
                            buttonType="outline"
                            rounded={false}
                            iconOnly={false}
                            ripple="light"
                          >
                            <FaEdit className="text-lg" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCreditors(id)}
                            color="red"
                            buttonType="outline"
                            rounded={false}
                            iconOnly={false}
                            ripple="light"
                          >
                            <MdAutoDelete className="text-lg" />
                          </Button>
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

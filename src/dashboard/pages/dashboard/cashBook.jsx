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
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from "react-js-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { cashBookDatas } from "../../data";
import { format } from "date-fns";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";
import jsPDF from "jspdf";

export function CashBookTable() {
  const [cashBookData, setCashBookData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEntryId, setEditEntryId] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [entriesPerPage] = useState(5);
  const [newEntryData, setNewEntryData] = useState({
    description: "",
    amount: 0,
    where_to: "",
    where_from: "",
    context: "",
  });
  const API_URL = "https://parts.kagaba.tech";

  // Event handler to update the new entry data as the user types
  const handleEntryInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntryData({ ...newEntryData, [name]: value });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserRole(decodedToken.role);
    }
  }, []);
  // Add useEffect hook to fetch data when the component mounts
  useEffect(() => {
    setCashBookData(cashBookDatas);
    // const fetchData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get(`${API_URL}/management/?scope=cashbook`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 Accept: "application/json",
    //             },
    //         });

    //         const { data } = response.data;
    //         if (data && data.records) {
    //             setCashBookData(cashBookData);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //     }
    // };

    // fetchData();
  }, []);

  useEffect(() => {
    // Filter the cash book data based on search query
    const filteredData = cashBookData.filter((entry) => {
      const descriptionMatchesSearch = entry.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const whereToMatchesSearch = entry.where_to
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const whereFromMatchesSearch = entry.where_from
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesSearch =
        descriptionMatchesSearch ||
        whereToMatchesSearch ||
        whereFromMatchesSearch;

      return matchesSearch;
    });
    setFilteredData(filteredData);
  }, [searchQuery, cashBookData]);

  const handleAddEntry = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/management/`,
        { ...newEntryData, scope: "cashbook" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
      setLoading(false);
      toast.success("Entry added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding entry:", error);
      toast.error("Error adding entry");
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/management/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "application/json",
        },
      });
      toast.success("Entry deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Error deleting entry");
    }
  };

  const handleEditEntry = (id) => {
    setEditMode(true);
    setEditEntryId(id);
  };

  const handleEditEntrySubmit = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${API_URL}/management/${editEntryId}`,
        { ...newEntryData, scope: "cashbook" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
      setLoading(false);
      toast.success("Entry updated successfully");
      window.location.reload();
      setEditMode(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating entry:", error);
      toast.error("Error updating entry");
    }
  };
  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry,
  );
  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography variant="h6" color="white" className="mb-4 md:mb-0">
              Cash Book
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search Cash Book..."
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
                  Add New Entry
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          {filteredData.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Proof",
                    "Description",
                    "Amount",
                    "Where To",
                    "Where From",
                    "Context",
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
                {currentEntries?.map(
                  (
                    {
                      id,
                      proof,
                      description,
                      amount,
                      where_to,
                      where_from,
                      context,
                    },
                    key,
                  ) => {
                    const className = `py-3 px-5 ${
                      key === currentEntries?.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {id}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                <a
                                  href={`https://test.kagaba.tech/files/download?path=${proof}`}
                                >
                                  View Proof
                                </a>
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {description}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {amount}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {where_to}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {where_from}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {context}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex">
                            <FaEdit
                              className="text-blue-500 cursor-pointer material-icons"
                              onClick={() => handleEditEntry(id)}
                            />
                            {(!isAgent || !isAdmin) && (
                              <MdAutoDelete
                                className="ml-2 text-red-500 cursor-pointer material-icons"
                                onClick={() => handleDeleteEntry(id)}
                              />
                            )}
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
            {
              length: Math.ceil(filteredData.length / entriesPerPage),
            },
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
          <div className="w-[450px] p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Entry
              </h2>
              <button onClick={() => setShowAddForm(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={newEntryData.amount}
                  onChange={handleEntryInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Where To
                </label>
                {/* select form bank and cash */}
                <select
                  name="where_to"
                  value={newEntryData.where_to}
                  onChange={handleEntryInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Where To</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Where From
                </label>
                {/* select form bank and cash, Outside */}
                <select
                  name="where_from"
                  value={newEntryData.where_from}
                  onChange={handleEntryInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Where From</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                  <option value="outside">Outside</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Proof
                </label>
                <input
                  type="file"
                  placeholder="Proof"
                  name="proof"
                  onChange={(e) => {
                    setNewEntryData({
                      ...newEntryData,
                      proof: e.target.files[0],
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={newEntryData.description}
                onChange={handleEntryInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Context
              </label>
              <textarea
                placeholder="Context"
                name="context"
                value={newEntryData.context}
                onChange={handleEntryInputChange}
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
              onClick={handleAddEntry}
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
              {loading ? <Loader /> : "Add Entry"}
            </Button>
          </div>
        </div>
      )}
      {editMode && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Entry
              </h2>
              <button onClick={() => setEditMode(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {/* Edit Entry form */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Proof</label>
              <input
                type="file"
                placeholder="Proof"
                name="proof"
                onChange={(e) => {
                  setNewEntryData({
                    ...newEntryData,
                    proof: e.target.files[0],
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={newEntryData.description}
                onChange={handleEntryInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={newEntryData.amount}
                  onChange={handleEntryInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Where To
                </label>
                {/* select form bank and cash */}
                <select
                  name="where_to"
                  value={newEntryData.where_to}
                  onChange={handleEntryInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 "
                >
                  <option value="">Select Where To</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Where From
              </label>
              {/* select form bank and cash, Outside */}
              <select
                name="where_from"
                value={newEntryData.where_from}
                onChange={handleEntryInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Where From</option>
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
                <option value="outside">Outside</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">
                Context
              </label>
              <textarea
                placeholder="Context"
                name="context"
                value={newEntryData.context}
                onChange={handleEntryInputChange}
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
              onClick={handleEditEntrySubmit}
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
              {loading ? <Loader /> : "Update Entry"}
            </Button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CashBookTable;

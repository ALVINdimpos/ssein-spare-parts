import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineTransaction } from "react-icons/ai";
import axios from "axios";
import Loader from "react-js-loader";
import { jwtDecode } from "jwt-decode";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";

export function Cells() {
  const [editCell, setEditCell] = useState(false);
  const [sellCell, setSellCell] = useState(false);
  const [singleCell, setSingleCell] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [CellTableData, setCellTableData] = useState([]);
  const [filteredCells, setFilteredCells] = useState([]);
  const [isSoldFilter, setIsSoldFilter] = useState("all");
  const [CellData, setCellData] = useState({
    cell_no: "",
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
  const [editingCellId, setEditingCellId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [CellsPerPage] = useState(15);

  const API_URL = "https://test.husseinking.com";

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
        const response = await axios.get(` ${API_URL}/battery/cell`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setCellTableData(response.data?.data?.batteries);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Update the calculation of indexOfFirstCell and indexOfLastCell to use filteredCells
  const indexOfLastCell = currentPage * CellsPerPage;
  const indexOfFirstCell = indexOfLastCell - CellsPerPage;
  const currentCells = filteredCells.slice(indexOfFirstCell, indexOfLastCell);

  const handleSellCells = async (id) => {
    const getCellResponse = await axios.get(`${API_URL}/battery/cell/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleCell(getCellResponse?.data?.data?.cell);
    setSellCell(true);
    setEditingCellId(id);
  };
  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";

  const handleViewEditCell = async (id) => {
    const getCellResponse = await axios.get(`${API_URL}/battery/cell/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleCell(getCellResponse?.data?.data?.cell);
    setEditCell(true);
    setEditingCellId(id);
  };
  const handleEditCell = async (id) => {
    setLoading(true);
    try {
      const { cell_no, selling_price, purchase_price, tax, other_expenses } =
        CellData;

      const requestData = {
        cell_no,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
        is_sold: false,
      };
      await axios.post(`${API_URL}/battery/cell/${id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEditCell(false);
      setCellData({
        cell_no: "",
        selling_price: 0,
        purchase_price: 0,
        tax: 0,
        other_expenses: 0,
      });
      toast.success("Cell updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating Cell:", error);
      toast.error("Error updating Cell");
    }
  };
  const handleSellCell = async () => {
    setLoading(true);
    try {
      const { discount, context, selling_price } = CellData;
      const requestData = {
        discount,
        context,
        is_sold: true,
        selling_price,
        sold_date: Date.now(),
      };
      // get Cell
      await axios.post(
        `${API_URL}/battery/cell/${editingCellId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      toast.success("Cell sold successfully");
      window.location.reload();
      setEditingCellId(null);
    } catch (error) {
      toast.error("Error selling Cell:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCell = async (id) => {
    try {
      // Show a confirmation dialog before deleting the Cell
      const confirmed = window.confirm(
        "Are you sure you want to delete this Cell?",
      );
      if (!confirmed) {
        return; // If user cancels, do not proceed with deletion
      }
      await axios.delete(`${API_URL}/battery/cell/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      window.location.reload();
      toast.success("Cell deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Deleting Cell failed:", error);
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

  useEffect(() => {
    if (isSoldFilter === "all") {
      // Show all Cells without any additional filtering
      setFilteredCells(CellTableData);
    } else {
      // Apply filtering based on the selected filter value
      const filteredData = CellTableData.filter((Cell) => {
        const numMatchesSearch = Cell.cell_no
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        let matchesSearch = numMatchesSearch;

        if (isSoldFilter === "selected") {
          return Cell.actions.some((action) => action.action_type === "intent");
        } else if (isSoldFilter === "sold") {
          return matchesSearch && Cell.is_sold;
        } else if (isSoldFilter === "inStock") {
          return matchesSearch && !Cell.is_sold;
        }
        return false;
      });
      setFilteredCells(filteredData);
    }
    setCurrentPage(1); // Reset pagination to first page when filter changes
  }, [isSoldFilter, searchQuery, CellTableData]);

  // Separate useEffect for handling search query
  useEffect(() => {
    const filteredData = CellTableData.filter((Cell) => {
      const numMatchesSearch = Cell.cell_no
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return numMatchesSearch;
    });
    setFilteredCells(filteredData);
  }, [searchQuery, CellTableData]);

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
          "Cell Number",
          "Selling Price",
          "Purchase Price",
          "Tax",
          "Other Expenses",
          "Discount",
          "Context",
          "Status",
        ],
      ],
      body: filteredCells.map(
        ({
          id,
          cell_no,
          selling_price,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold,
        }) => [
          id,
          cell_no,
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
    doc.save("Cells.pdf");
  };
  // Function to download data as CSV
  const handleDownloadCSV = () => {
    const headers = [
      { label: "Id", key: "id" },
      { label: "Cell Number", key: "cell_no" },
      { label: "Selling Price", key: "selling_price" },
      { label: "Purchase Price", key: "purchase_price" },
      { label: "Tax", key: "tax" },
      { label: "Other Expenses", key: "other_expenses" },
      { label: "Discount", key: "discount" },
      { label: "Context", key: "context" },
      { label: "Status", key: "status" },
    ];
    const csvData = filteredCells.map(
      ({
        id,
        cell_no,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
        discount,
        context,
        is_sold,
      }) => ({
        id,
        cell_no,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
        discount,
        context,
        status: is_sold ? "Sold" : "In Stock",
      }),
    );
    const csvReport = {
      filename: "Cells.csv",
      headers,
      data: csvData,
    };
    return (
      <CSVLink {...csvReport}>
        <FaFileCsv className="text-xl" />
      </CSVLink>
    );
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
              Cells
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search Cell..."
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
              </select>
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
              {handleDownloadCSV()}
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          {filteredCells.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                {/* Table headers */}
                <thead>
                  <tr>
                    {[
                      "Cell Number",
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
                  {filteredCells.map(
                    (
                      {
                        id,
                        cell_no,
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
                        key === currentCells.length - 1
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
                                  {cell_no}
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
                                  onClick={() => handleViewEditCell(id)}
                                />
                              )}
                              {!is_sold && ( // Conditionally render the edit button
                                <AiOutlineTransaction
                                  className="text-blue-500 cursor-pointer material-icons"
                                  onClick={() => handleSellCells(id)}
                                />
                              )}
                              {(!isAgent || !isAdmin) && (
                                <MdAutoDelete
                                  className="ml-2 text-red-500 cursor-pointer material-icons"
                                  onClick={() => handleDeleteCell(id)}
                                />
                              )}
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
        {/* Total Cells */}
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold"
          >
            Total Cells: {filteredCells.length}
          </Typography>
        </div>

        {/* Cells count */}
        <div className="flex items-center gap-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold"
            >
              Showing {currentCells.length} of {filteredCells.length}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <ul className="flex flex-wrap gap-2">
          {Array.from(
            { length: Math.ceil(CellTableData.length / CellsPerPage) },
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
      {sellCell && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sell Cell
                </h2>
                <button
                  onClick={() => setSellCell(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit Cell form */}
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
                      defaultValue={singleCell?.discount}
                      onChange={(e) =>
                        setCellData({
                          ...CellData,
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
                      placeholder={`Selling Price: ${singleCell?.selling_price} RWF`}
                      required
                      onChange={(e) =>
                        setCellData({
                          ...CellData,
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
                    value={CellData.context}
                    onChange={(e) =>
                      setCellData({
                        ...CellData,
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
                onClick={handleSellCell}
              >
                {loading ? (
                  <Loader type="spinner-default" bgColor={"#fff"} size={20} />
                ) : (
                  "Sell Cell"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* EDIT Cell */}
      {editCell && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Cell
                </h2>
                <button
                  onClick={() => setEditCell(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit Cell form */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    placeholder="Selling Price"
                    required
                    defaultValue={singleCell?.selling_price}
                    onChange={(e) =>
                      setCellData({
                        ...CellData,
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
                    defaultValue={singleCell?.purchase_price}
                    required
                    onChange={(e) =>
                      setCellData({
                        ...CellData,
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
                    defaultValue={singleCell?.tax}
                    onChange={(e) =>
                      setCellData({ ...CellData, tax: e.target.value })
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
                    defaultValue={singleCell?.other_expenses}
                    onChange={(e) =>
                      setCellData({
                        ...CellData,
                        other_expenses: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Cell Number
                  </label>
                  <input
                    type="text"
                    placeholder="Cell Number"
                    required
                    defaultValue={singleCell?.cell_no}
                    onChange={(e) =>
                      setCellData({
                        ...CellData,
                        cell_no: e.target.value,
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
                    onClick={handleEditCell}
                  >
                    {loading ? (
                      <Loader
                        type="spinner-default"
                        bgColor={"#fff"}
                        size={20}
                      />
                    ) : (
                      "Edit Cell"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}

export default Cells;

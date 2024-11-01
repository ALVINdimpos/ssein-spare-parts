/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineTransaction } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";
import jsPDF from "jspdf";
import Loader from "react-js-loader";
import { format } from "date-fns";
import axios from "axios";

export const CarsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editCar, setEditCar] = useState(false);
  const [sellCar, setSellCar] = useState(false); // Assuming this will represent deleting a car
  const [singleCar, setSingleCar] = useState({}); // Placeholder for single car data
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [carTableData, setCarTableData] = useState([]); // Placeholder for car table data
  const [filteredCars, setFilteredCars] = useState([]);
  const [isSoldFilter, setIsSoldFilter] = useState("all"); // Assuming this will represent sold or unsold cars
  const [carData, setCarData] = useState({
    vin_number: singleCar.vin_number || "",
    description: singleCar.description || "",
    make: singleCar.make || "",
    model: singleCar.model || "",
    year: singleCar.year || "",
    engine: singleCar.engine || "",
    image: null,
    dmc: null,
    assessment_doc: null,
    tax_doc: null,
    ebm_receipt: null,
    proof_of_payment: null,
    discount: singleCar.discount || "",
    context: singleCar.context || "",
    selling_price: singleCar.selling_price || "",
    transport_fees: singleCar.transport_fees || "",
    purchase_price: singleCar.purchase_price || "",
    tax: singleCar.tax || "",
    other_expenses: singleCar.other_expenses || "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingCarId, setEditingCarId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(15); // Number of cars to display per page

  const API_URL = "https://test.husseinking.com";

  const handleAddCar = () => {
    setShowAddForm(!showAddForm);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(` ${API_URL}/car-product/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
          },
        });
        if (response?.data?.data?.car_products) {
          setCarTableData(response?.data?.data?.car_products);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    // Placeholder for filtering car table data based on search query and filter options
    const filteredData = carTableData.filter((car) => {
      // Placeholder logic for filtering cars based on search query
      // const carNumberMatchesSearch = car.carNumber.toLowerCase().includes(searchQuery.toLowerCase());
      // const vinNumberMatchesSearch = car.vinNumber.toLowerCase().includes(searchQuery.toLowerCase());
      // return carNumberMatchesSearch || vinNumberMatchesSearch;

      // Assuming isSoldFilter represents sold or unsold cars
      if (isSoldFilter === "all") {
        return true; // Return all cars
      } else if (isSoldFilter === "sold") {
        return car.sold; // Return only sold cars
      } else if (isSoldFilter === "unsold") {
        return !car.sold; // Return only unsold cars
      }
    });
    setFilteredCars(filteredData);
  }, [carTableData, searchQuery, isSoldFilter]);

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Placeholder functions for handling actions on cars
  const handleDeleteCar = async (carId) => {
    try {
      const response = await axios.delete(`${API_URL}/car-product/${carId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success(`Successfully deleted car with ID ${carId}`);
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting car");
      console.error("Error deleting car:", error);
    }
  };
  const handleViewEditCar = async (id) => {
    const response = await axios.get(`${API_URL}/car-product/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleCar(response?.data?.data?.car_product);
    setEditCar(true);
    setEditingCarId(id);
  };
  const handleEditCar = async () => {
    setLoading(true);
    console.log("Editing car with ID:", singleCar);
    try {
      const formData = new FormData();

      // Append fields that are not null or undefined in the carData state
      Object.keys(carData).forEach((key) => {
        if (carData[key] !== null && carData[key] !== undefined) {
          formData.append(key, carData[key]);
        }
      });

      const response = await axios.patch(
        `${API_URL}/car-product/${editingCarId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(`Successfully updated car with ID ${editingCarId}`);
      setLoading(false);
      setEditingCarId(null);
      setEditCar(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error(`Error updating car. Please try again.`);
      setLoading(false);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when search query changes
  };

  const handleSoldFilterChange = (e) => {
    setIsSoldFilter(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Handle file uploads separately
      setCarData((prevData) => ({
        ...prevData,
        [name]: files[0], // Assuming single file uploads
      }));
    } else {
      setCarData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSellCars = async (id) => {
    const response = await axios.get(`${API_URL}/car-product/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleCar(response?.data?.data?.car_product);
    setSellCar(true);
    setEditingCarId(id);
  };
  const handleSellCar = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("is_sold", true);
      formData.append("selling_price", carData.selling_price);
      formData.append("proof_of_payment", carData.proof_of_payment);
      formData.append("ebm_receipt", carData.ebm_receipt);
      formData.append("discount", carData.discount);
      formData.append("context", carData.context);

      // Log formData to ensure file data is correctly appended
      const response = await axios.patch(
        `${API_URL}/car-product/${editingCarId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data", // Ensure proper content type for FormData
          },
        },
      );

      toast.success(`Successfully sell car with ID ${editingCarId}`);
      setLoading(false);
      setEditingCarId(null);
      setSellCar(false);
      window.location.reload();
    } catch (error) {
      console.error("Error selling car:", error); // Log the error response for debugging
      toast.error(`Error selling car. Please try again.`);
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("vin_number", carData.vin_number);
      formData.append("description", carData.description);
      formData.append("make", carData.make);
      formData.append("model", carData.model);
      formData.append("year", carData.year);
      formData.append("engine", carData.engine);
      formData.append("image", carData.image); // Add the carImage file to FormData
      formData.append("dmc", carData.dmc); // Add the dmc file to FormData
      formData.append("assessment_doc", carData.assessment_doc); // Add the assessment_document file to FormData
      formData.append("tax_doc", carData.tax_doc); // Add the tax_payment_document file to FormData
      formData.append("selling_price", carData.selling_price);
      formData.append("transport_fees", carData.transport_fees);
      formData.append("purchase_price", carData.purchase_price);
      formData.append("tax", carData.tax);
      formData.append("other_expenses", carData.other_expenses);
      formData.append("context", carData.context);

      // Log formData to ensure file data is correctly appended

      const response = await axios.post(`${API_URL}/car-product/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data", // Ensure proper content type for FormData
        },
      });

      toast.success(`Successfully added car with ID ${carData.vinNumber}`);
      setLoading(false);
      setShowAddForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding car:", error); // Log the error response for debugging
      toast.error(`Error adding car. Please try again.`);
      setLoading(false);
    }
  };

  // Function to download data as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF("l", "pt", "letter"); // 'l' for landscape orientation

    // Define column widths and row heights
    const columnWidths = [
      15, 50, 80, 30, 30, 30, 50, 50, 50, 50, 50, 50, 50, 50, 50,
    ];
    const rowHeight = 5;

    // Set font size and style
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.autoTable({
      head: [
        [
          "ID",
          "VIN Number",
          "Description",
          "Make",
          "Model",
          "Year",
          "Engine",
          "Selling Price",
          "Transport Fees",
          "Purchase Price",
          "Tax",
          "Other Expenses",
          "Discount",
          "Context",
          "Status",
        ],
      ],
      body: filteredCars.map(
        ({
          id,
          vinNumber,
          description,
          make,
          model,
          year,
          engine,
          selling_price,
          transport_fees,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold,
        }) => [
          id,
          vinNumber,
          description,
          make,
          model,
          year,
          engine,
          selling_price,
          transport_fees,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold ? "Sold" : "In Stock",
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
        7: { cellWidth: columnWidths[7] },
        8: { cellWidth: columnWidths[8] },
        9: { cellWidth: columnWidths[9] },
        10: { cellWidth: columnWidths[10] },
        11: { cellWidth: columnWidths[11] },
        12: { cellWidth: columnWidths[12] },
        13: { cellWidth: columnWidths[13] },
        14: { cellWidth: columnWidths[14] },
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
    const csvData = filteredCars.map(
      ({
        id,
        vinNumber,
        description,
        make,
        model,
        year,
        engine,
        selling_price,
        transport_fees,
        purchase_price,
        tax,
        other_expenses,
        discount,
        context,
        is_sold,
      }) => [
        id,
        vinNumber,
        `"${description.replace(/"/g, '""')}"`, // Escape double quotes
        make,
        model,
        year,
        engine,
        selling_price,
        transport_fees,
        purchase_price,
        tax,
        other_expenses,
        discount,
        `"${context.replace(/"/g, '""')}"`, // Escape double quotes
        is_sold ? "Sold" : "In Stock",
      ],
    );

    const headers = [
      "ID",
      "VIN Number",
      "Description",
      "Make",
      "Model",
      "Year",
      "Engine",
      "Selling Price",
      "Transport Fees",
      "Purchase Price",
      "Tax",
      "Other Expenses",
      "Discount",
      "Context",
      "Status",
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
    <div className="flex flex-col mt-12 mb-8 overflow-x-auto">
      <Card>
        <CardHeader variant="black" color="gray" className="p-4 mb-8 md:p-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography
              variant="h6"
              color="white"
              className="mb-2 md:mb-0 md:mr-4"
            >
              Cars
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search car..."
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
                onClick={handleAddCar}
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
                <span className="text-base font-medium">Add New Car</span>
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
              <Button
                color="gray"
                buttonType="filled"
                size="regular"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
                onClick={handleDownloadCSV}
              >
                <FaFileCsv className="text-xl" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          {filteredCars.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                {/* Table headers */}
                <thead>
                  <tr>
                    {[
                      "ID",
                      "vinNum",
                      "description",
                      "make",
                      "model",
                      "year",
                      "engine",
                      "carImage",
                      "dmc",
                      "assessment_document",
                      "tax_payment_document",
                      "selling_price",
                      "sold_date",
                      "transport_fees",
                      "purchase_price",
                      "tax",
                      "proof_of_payment_document",
                      "ebm_receipt",
                      "context",
                      "other_expenses",
                      "discount",
                      "is_sold",
                      "Actions",
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
                  {currentCars.map(
                    (
                      {
                        id,
                        vin_number,
                        description,
                        make,
                        model,
                        year,
                        engine,
                        image,
                        dmc,
                        assessment_doc,
                        tax_doc,
                        selling_price,
                        sold_date,
                        transport_fees,
                        purchase_price,
                        tax,
                        proof_of_payment,
                        ebm_receipt,
                        context,
                        other_expenses,
                        discount,
                        is_sold,
                        Actions,
                      },
                      key,
                    ) => {
                      const className = `py-3 px-5 ${
                        key === currentCars.length - 1
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
                                  {vin_number}
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
                                  {description}
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
                                  {make}
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
                                  {model}
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
                                  {year}
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
                                  {engine}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <img
                                  src={`https://test.husseinking.com/files/download?path=${image ? image[0] : ""}`}
                                  alt="Car image"
                                />
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
                                    href={`https://test.husseinking.com/files/download?path=${dmc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    View DMC
                                  </a>
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
                                  class
                                  Name="font-semibold"
                                >
                                  <a
                                    href={`https://test.husseinking.com/files/download?path=${assessment_doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    View Assessment
                                  </a>
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
                                    href={`https://test.husseinking.com/files/download?path=${tax_doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    View Tax Payment
                                  </a>
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
                                  {selling_price}
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
                                  {sold_date
                                    ? format(new Date(sold_date), "dd/MM/yyyy")
                                    : "N/A"}
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
                                  {transport_fees}
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
                                  {purchase_price}
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
                                  {tax}
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
                                    href={`https://test.husseinking.com/files/download?path=${proof_of_payment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Proof of Payment
                                  </a>
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
                                    href={`https://test.husseinking.com/files/download?path=${ebm_receipt}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View EBM Receipt
                                  </a>
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
                                  {context}
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
                                  {other_expenses}
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
                                  {discount}
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
                            <div className="flex justify-between gap-1">
                              {!isAgent && (
                                <FaEdit
                                  className="text-blue-500 cursor-pointer material-icons"
                                  onClick={() => handleViewEditCar(id)}
                                />
                              )}
                              {!is_sold && ( // Conditionally render the edit button
                                <AiOutlineTransaction
                                  className="text-blue-500 cursor-pointer material-icons"
                                  onClick={() => handleSellCars(id)}
                                />
                              )}
                              {(!isAgent || !isAdmin) && (
                                <MdAutoDelete
                                  className="ml-2 text-red-500 cursor-pointer material-icons"
                                  onClick={() => handleDeleteCar(id)}
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
            </div>
          )}
        </CardBody>
      </Card>
      <div className="flex items-center justify-between mt-6">
        {/* Total Cars */}
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold"
          >
            Total Cars: {filteredCars.length}
          </Typography>
        </div>

        {/* Cars count */}
        <div className="flex items-center gap-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold"
            >
              Showing {currentCars.length} of {filteredCars.length}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <ul className="flex flex-wrap gap-2">
          {Array.from(
            { length: Math.ceil(carTableData.length / carsPerPage) },
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
        <form encType="multipart/form-data">
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Car
                </h2>
                <button
                  onClick={handleAddCar}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Basic Information Section */}
              <div className="mb-4">
                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      VIN Number
                    </label>
                    <input
                      type="text"
                      name="vin_number"
                      placeholder="VIN Number"
                      required
                      value={carData.vin_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      required
                      value={carData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Make
                    </label>
                    <input
                      type="text"
                      name="make"
                      placeholder="Make"
                      required
                      value={carData.make}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      placeholder="Model"
                      required
                      value={carData.model}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      placeholder="Year"
                      required
                      value={carData.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Engine
                    </label>
                    <input
                      type="text"
                      name="engine"
                      placeholder="Engine"
                      required
                      value={carData.engine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              {/* Document Section */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Car Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          image: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      DMC Document
                    </label>
                    <input
                      type="file"
                      name="dmc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          dmc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Assessment Document
                    </label>
                    <input
                      type="file"
                      name="assessment_doc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          assessment_doc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Tax Payment Document
                    </label>
                    <input
                      type="file"
                      name="tax_doc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          tax_doc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      name="selling_price"
                      placeholder="Selling Price"
                      required
                      value={carData.selling_price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Transport Fees
                    </label>
                    <input
                      type="number"
                      name="transport_fees"
                      placeholder="Transport Fees"
                      value={carData.transport_fees}
                      required
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      name="purchase_price"
                      placeholder="Purchase Price"
                      value={carData.purchase_price}
                      required
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Tax
                    </label>
                    <input
                      type="number"
                      name="tax"
                      placeholder="Tax"
                      value={carData.tax}
                      required
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Other Expenses
                    </label>
                    <input
                      type="number"
                      name="other_expenses"
                      placeholder="Other Expenses"
                      value={carData.other_expenses}
                      required
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  className="px-4 py-3 text-red-700 bg-red-100 border-l-4 border-red-500"
                  role="alert"
                >
                  <p className="font-bold">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
              >
                {loading ? (
                  <Loader
                    type="ThreeDots"
                    color="#ffffff"
                    height={24}
                    width={50}
                  />
                ) : (
                  "Add Car"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {sellCar && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sell Car
                </h2>
                <button
                  onClick={() => setSellCar(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* sell Car form */}
              <div className="mb-4">
                <div className="grid w-full grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Discount
                    </label>
                    <input
                      type="number"
                      placeholder="Discount"
                      name="discount"
                      required
                      onChange={(e) =>
                        setCarData({
                          ...carData,
                          discount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Selling Price
                    </label>
                    <input
                      type="text"
                      name="selling_price"
                      placeholder={`Selling Price: ${singleCar?.selling_price} RWF`}
                      required
                      onChange={(e) =>
                        setCarData({
                          ...carData,
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
                    name="context"
                    required
                    defaultValue={carData.context}
                    onChange={(e) =>
                      setCarData({
                        ...carData,
                        context: e.target.value,
                      })
                    }
                    className="w-full h-[108px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Prove of Payment Document
                    </label>
                    <input
                      type="file"
                      name=" proof_of_payment"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          proof_of_payment: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      EBM Receipt
                    </label>
                    <input
                      type="file"
                      name="ebm_receipt"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          ebm_receipt: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
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
                className="w-full"
                onClick={handleSellCar}
              >
                {loading ? (
                  <Loader type="spinner-default" bgColor={"#fff"} size={20} />
                ) : (
                  "Sell Car"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* EDIT Car */}
      {editCar && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-lg p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  {" "}
                  Edit Car
                </h2>
                <button
                  onClick={() => setEditCar(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Basic Information Section */}
              <div className="mb-4">
                <div className="grid w-full grid-cols-5 gap-4">
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      VIN Num
                    </label>
                    <input
                      type="text"
                      name="vin_number"
                      placeholder="VIN Number"
                      required
                      defaultValue={singleCar?.vin_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Make
                    </label>
                    <input
                      type="text"
                      name="make"
                      placeholder="Make"
                      required
                      defaultValue={singleCar?.make}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      placeholder="Model"
                      required
                      defaultValue={singleCar?.model}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      placeholder="Year"
                      required
                      defaultValue={singleCar?.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Engine
                    </label>
                    <input
                      type="text"
                      name="engine"
                      required
                      defaultValue={singleCar?.engine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1 text-sm text-gray-600">
                  Description
                </label>
                <textarea
                  type="text"
                  name="description"
                  required
                  defaultValue={singleCar?.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              {/* Document Section */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Car Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          image: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      DMC Document
                    </label>
                    <input
                      type="file"
                      name="dmc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          dmc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Assessment Doc
                    </label>
                    <input
                      type="file"
                      name="assessment_doc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          assessment_doc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Tax Payment Doc
                    </label>
                    <input
                      type="file"
                      name="tax_doc"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          tax_doc: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      EBM Receipt
                    </label>
                    <input
                      type="file"
                      name="ebm_receipt"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          ebm_receipt: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Prove of Payment
                    </label>
                    <input
                      type="file"
                      name="proof_of_payment"
                      required
                      onChange={(e) => {
                        setCarData({
                          ...carData,
                          proof_of_payment: e.target.files[0],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      name="selling_price"
                      required
                      defaultValue={singleCar?.selling_price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Transport Fees
                    </label>
                    <input
                      type="number"
                      name="transport_fees"
                      required
                      defaultValue={singleCar?.transport_fees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Purchase Price
                    </label>
                    <input
                      type="number"
                      name="purchase_price"
                      required
                      defaultValue={singleCar?.purchase_price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Tax
                    </label>
                    <input
                      type="number"
                      name="tax"
                      required
                      defaultValue={singleCar?.tax}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Other Expenses
                    </label>
                    <input
                      type="number"
                      name="other_expenses"
                      required
                      defaultValue={singleCar?.other_expenses}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 text-sm text-gray-600">
                      Context
                    </label>
                    <input
                      type="text"
                      name="context"
                      required
                      defaultValue={singleCar?.context}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  className="px-4 py-3 text-red-700 bg-red-100 border-l-4 border-red-500"
                  role="alert"
                >
                  <p className="font-bold">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                onClick={handleEditCar}
              >
                {loading ? (
                  <Loader
                    type="ThreeDots"
                    color="#ffffff"
                    height={24}
                    width={50}
                  />
                ) : (
                  "Edit Car"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default CarsPage;

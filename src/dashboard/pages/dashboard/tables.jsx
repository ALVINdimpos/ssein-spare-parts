/* eslint-disable no-unused-vars */
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
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaQrcode } from "react-icons/fa";
import axios from "axios";
import Loader from "react-js-loader";
import { jwtDecode } from "jwt-decode";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileCsv } from "react-icons/fa6";

export function Tables() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [sellProduct, setSellProduct] = useState(false);
  const [product, setProduct] = useState("");
  const [singleProduct, setSingleProduct] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productTableData, setProductTableData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSoldFilter, setIsSoldFilter] = useState("all");
  const [productData, setProductData] = useState({
    num: "",
    description: "",
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
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15); // Number of products to display per page

  const API_URL = "https://test.husseinking.com";
  const handleAddProduct = () => {
    setShowAddForm(!showAddForm);
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserRole(decodedToken.role);
    }
  }, []);
  console.log("productTableData", productTableData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(` ${API_URL}/products/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setProductTableData(response.data?.data?.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Update the calculation of indexOfFirstProduct and indexOfLastProduct to use filteredProducts
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handleSellProducts = async (id) => {
    const getProductResponse = await axios.get(`${API_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleProduct(getProductResponse?.data?.data?.product);
    setSellProduct(true);
    setEditingProductId(id);
    // Other logic for editing product...
  };
  const handleViewProduct = async (id) => {
    setViewProduct(true);
    setProduct(`${API_URL}/products/qrcode/${id}`);
  };
  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        num,
        description,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
      } = productData;

      const requestData = {
        num,
        description,
        selling_price,
        purchase_price,
        tax,
        discount: 0,
        is_sold: false,
        sold_date: Date.now(),
        context: "",
        other_expenses,
      };
      const response = await axios.post(`${API_URL}/products/`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Product added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleViewEditProduct = async (id) => {
    const getProductResponse = await axios.get(`${API_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setSingleProduct(getProductResponse?.data?.data?.product);
    setEditProduct(true);
    setEditingProductId(id);
  };
  const handleEditProduct = async (id) => {
    setLoading(true);
    try {
      const {
        num,
        description,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
      } = productData;

      const requestData = {
        num,
        description,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
        is_sold: false,
      };
      const response = await axios.post(
        `${API_URL}/products/${editingProductId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setEditProduct(false);
      setProductData({
        num: "",
        description: "",
        selling_price: 0,
        purchase_price: 0,
        tax: 0,
        other_expenses: 0,
      });
      toast.success("Product updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };
  const handleSellProduct = async () => {
    setLoading(true);
    try {
      const { discount, context, selling_price } = productData;
      const requestData = {
        discount,
        context,
        is_sold: true,
        selling_price,
        sold_date: Date.now(),
      };
      // get product
      const response = await axios.post(
        `${API_URL}/products/${editingProductId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      toast.success("Product sold successfully");
      window.location.reload();
      setEditingProductId(null);
    } catch (error) {
      setErrorMessage("Failed to sell product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handlePrintQRCodeInPdf = () => {
    const doc = new jsPDF();
    doc.addImage(product, "JPEG", 10, 10, 100, 100);
    doc.save("QRCode.pdf");
    toast.success("QR Code printed successfully");
  };
  const handleDeleteProduct = async (id) => {
    try {
      // Show a confirmation dialog before deleting the product
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?",
      );
      if (!confirmed) {
        return; // If user cancels, do not proceed with deletion
      }
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      window.location.reload();
      toast.success("Product deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Deleting product failed:", error);
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
      // Show all products without any additional filtering
      setFilteredProducts(productTableData);
    } else {
      // Apply filtering based on the selected filter value
      const filteredData = productTableData.filter((product) => {
        const numMatchesSearch = product.num
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const descriptionMatchesSearch = product.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        let matchesSearch = numMatchesSearch || descriptionMatchesSearch;

        if (isSoldFilter === "selected") {
          return product.actions.some(
            (action) => action.action_type === "intent",
          );
        } else if (isSoldFilter === "sold") {
          return matchesSearch && product.is_sold;
        } else if (isSoldFilter === "inStock") {
          return matchesSearch && !product.is_sold;
        }
        return false;
      });
      setFilteredProducts(filteredData);
    }
    setCurrentPage(1); // Reset pagination to first page when filter changes
  }, [isSoldFilter, searchQuery, productTableData]);

  // Separate useEffect for handling search query
  useEffect(() => {
    const filteredData = productTableData.filter((product) => {
      const numMatchesSearch = product.num
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatchesSearch = product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return numMatchesSearch || descriptionMatchesSearch;
    });
    setFilteredProducts(filteredData);
  }, [searchQuery, productTableData]);

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
          "Product Number",
          "Description",
          "Selling Price",
          "Purchase Price",
          "Tax",
          "Other Expenses",
          "Discount",
          "Context",
          "Status",
        ],
      ],
      body: filteredProducts.map(
        ({
          id,
          num,
          description,
          selling_price,
          purchase_price,
          tax,
          other_expenses,
          discount,
          context,
          is_sold,
        }) => [
          id,
          num,
          description,
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
    doc.save("products.pdf");
  };
  // Function to download data as CSV
  const handleDownloadCSV = () => {
    const headers = [
      { label: "Id", key: "id" },
      { label: "Product Number", key: "num" },
      { label: "Description", key: "description" },
      { label: "Selling Price", key: "selling_price" },
      { label: "Purchase Price", key: "purchase_price" },
      { label: "Tax", key: "tax" },
      { label: "Other Expenses", key: "other_expenses" },
      { label: "Discount", key: "discount" },
      { label: "Context", key: "context" },
      { label: "Status", key: "status" },
    ];
    const csvData = filteredProducts.map(
      ({
        id,
        num,
        description,
        selling_price,
        purchase_price,
        tax,
        other_expenses,
        discount,
        context,
        is_sold,
      }) => ({
        id,
        num,
        description,
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
      filename: "products.csv",
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
              Products
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search product..."
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
                <option value="selected">Selected</option>
              </select>
              <Button
                onClick={handleAddProduct}
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
                <span className="text-base font-medium">Add New Product</span>
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
              {handleDownloadCSV()}
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          {filteredProducts.length === 0 ? (
            <div className="py-4 text-center">No results found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                {/* Table headers */}
                <thead>
                  <tr>
                    {[
                      "Product Number",
                      "Status",
                      "Description",
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
                  {filteredProducts.map(
                    (
                      {
                        id,
                        num,
                        description,
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
                        key === currentProducts.length - 1
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
                                  {num}
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
                              {description}
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
                                  onClick={() => handleViewEditProduct(id)}
                                />
                              )}
                              {!is_sold && ( // Conditionally render the edit button
                                <AiOutlineTransaction
                                  className="text-blue-500 cursor-pointer material-icons"
                                  onClick={() => handleSellProducts(id)}
                                />
                              )}
                              {(!isAgent || !isAdmin) && (
                                <MdAutoDelete
                                  className="ml-2 text-red-500 cursor-pointer material-icons"
                                  onClick={() => handleDeleteProduct(id)}
                                />
                              )}
                              <FaQrcode
                                className="ml-2 text-green-500 cursor-pointer material-icons"
                                onClick={() => handleViewProduct(id)}
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
                                          action.creates_at,
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
        {/* Total products */}
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold"
          >
            Total Products: {filteredProducts.length}
          </Typography>
        </div>

        {/* Products count */}
        <div className="flex items-center gap-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold"
            >
              Showing {currentProducts.length} of {filteredProducts.length}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <ul className="flex flex-wrap gap-2">
          {Array.from(
            { length: Math.ceil(productTableData.length / productsPerPage) },
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
                  Add New Product
                </h2>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Product Number
                </label>
                <input
                  type="text"
                  placeholder="Product Number"
                  required
                  value={productData.num}
                  onChange={(e) =>
                    setProductData({ ...productData, num: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Description
                </label>
                <label className="block mb-1 text-sm text-gray-600">
                  Eg: Product_name - Product_type - year - side
                </label>
                <textarea
                  type="text"
                  placeholder="Description"
                  required
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
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
                    value={productData.selling_price}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                    value={productData.purchase_price}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                    value={productData.tax}
                    onChange={(e) =>
                      setProductData({ ...productData, tax: e.target.value })
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
                    value={productData.other_expenses}
                    required={true}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {viewProduct && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-between w-full ">
                <Typography variant="h6" color="gray">
                  QR Code
                </Typography>
                <button onClick={() => setViewProduct(false)}>
                  <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <img src={product} alt="QR Code" className="mb-4" />

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

      {sellProduct && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sell product
                </h2>
                <button
                  onClick={() => setSellProduct(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit product form */}
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
                      defaultValue={singleProduct?.discount}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
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
                      placeholder={`Selling Price: ${singleProduct?.selling_price} RWF`}
                      required
                      onChange={(e) =>
                        setProductData({
                          ...productData,
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
                    value={productData.context}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                onClick={handleSellProduct}
              >
                {loading ? (
                  <Loader type="spinner-default" bgColor={"#fff"} size={20} />
                ) : (
                  "Sell Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* EDIT PRODUCT */}
      {editProduct && (
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-60">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 mb-6 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditProduct(false)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <IoIosCloseCircle className="text-gray-600" />
                </button>
              </div>
              {/* Edit product form */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    placeholder="Selling Price"
                    required
                    defaultValue={singleProduct?.selling_price}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                    defaultValue={singleProduct?.purchase_price}
                    required
                    onChange={(e) =>
                      setProductData({
                        ...productData,
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
                    defaultValue={singleProduct?.tax}
                    onChange={(e) =>
                      setProductData({ ...productData, tax: e.target.value })
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
                    defaultValue={singleProduct?.other_expenses}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        other_expenses: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    type="text"
                    placeholder="Description"
                    required
                    defaultValue={singleProduct?.description}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        description: e.target.value,
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
                    onClick={handleEditProduct}
                  >
                    {loading ? (
                      <Loader
                        type="spinner-default"
                        bgColor={"#fff"}
                        size={20}
                      />
                    ) : (
                      "Edit Product"
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

export default Tables;

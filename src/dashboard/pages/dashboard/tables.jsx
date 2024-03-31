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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import axios from "axios";
import Loader from "react-js-loader";
import { jwtDecode } from "jwt-decode";

export function Tables() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [product, setProduct] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productTableData, setProductTableData] = useState([]);
  const [productData, setProductData] = useState({
    number: "",
    description: "",
    price: 0,
    cost: 0,
    tax: 0,
    context: "",
    otherExpenses: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Number of products to display per page

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
  const handleEditProduct = (id) => {
    setEditProduct(true);
    setEditingProductId(id);
    // Other logic for editing product...
  };

  const handleViewProduct = async (id) => {
    setViewProduct(true);
    setProduct(`https://parts.kagaba.tech/products/qrcode/${id}`);
  };
  const isAgent = userRole === "agent";
  // Filter the product table data based on the search query
  const filteredProductData = productTableData?.filter((product) => {
    if (product && product.num) {
      return product.num.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false; // Return false for undefined or missing properties
  });
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProductData.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { number, description, price, cost, tax, otherExpenses } =
        productData;

      const requestData = {
        num: number,
        description,
        selling_price: price,
        purchase_price: cost,
        tax,
        discount: 0,
        is_sold: false,
        sold_date: Date.now(),
        context: "",
        other_expenses: otherExpenses,
      };
      const response = await axios.post(
        "https://parts.kagaba.tech/products/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      toast.success("Product added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://parts.kagaba.tech/products/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        setProductTableData(response.data?.data?.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSellProduct = async () => {
    setLoading(true);
    try {
      const { discount, context } = productData;
      const requestData = {
        discount,
        context,
        is_sold: true,
        sold_date: Date.now(),
      };
      const response = await axios.post(
        `https://parts.kagaba.tech/products/${editingProductId}`,
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
      const response = await axios.delete(
        `https://parts.kagaba.tech/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      window.location.reload();
      toast.success("Product deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Deleting product failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              Product Table
            </Typography>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search product..."
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={handleAddProduct}
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
                <span className="text-base font-medium">Add New Product</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
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
              {currentProducts.map(
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
                              {num}
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
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {is_sold ? (
                            <span className="text-red-500">Sold</span>
                          ) : (
                            <span className="text-green-500">In Stock</span>
                          )}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex">
                          <FaEdit
                            className="text-blue-500 cursor-pointer material-icons"
                            onClick={() => handleEditProduct(id)}
                          />
                          {!isAgent && (
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
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(productTableData.length / productsPerPage) },
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
        <form>
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
            {/* Add Product Form */}

            <div className="p-8 bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" color="gray">
                  Add New Product
                </Typography>
                <button onClick={handleAddProduct}>
                  <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {/* Add product form */}
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-600">
                  Product Number
                </label>
                <input
                  type="text"
                  placeholder="Product Number"
                  required
                  value={productData.number}
                  onChange={(e) =>
                    setProductData({ ...productData, number: e.target.value })
                  }
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
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    value={productData.price}
                    onChange={(e) =>
                      setProductData({ ...productData, price: e.target.value })
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
                    placeholder="Cost"
                    required
                    value={productData.cost}
                    onChange={(e) =>
                      setProductData({ ...productData, cost: e.target.value })
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
                    value={productData.otherExpenses}
                    required={true}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        otherExpenses: e.target.value,
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

      {editProduct && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-between w-full ">
                <Typography variant="h6" color="gray">
                  Sell product
                </Typography>
                <button onClick={() => setEditProduct(false)}>
                  <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {/* Edit product form */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Discount
                </label>
                <input
                  type="number"
                  placeholder="Discount"
                  required
                  value={productData.discount}
                  onChange={(e) =>
                    setProductData({ ...productData, discount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
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
                    setProductData({ ...productData, context: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
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
              className="w-full"
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
      )}

      <ToastContainer />
    </div>
  );
}

export default Tables;

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoIosCloseCircle, IoMdAddCircle } from "react-icons/io";

export function ClientTables() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productTableData, setProductTableData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSoldFilter, setIsSoldFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15); // Number of products to display per page
  const [selectedProducts, setSelectedProducts] = useState([]);

  const API_URL = "https://test.husseinking.com";

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

  useEffect(() => {
    // Filter the product data based on search query and isSoldFilter
    const filteredData = productTableData.filter((product) => {
      const numMatchesSearch = product.num
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatchesSearch = product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesSearch = numMatchesSearch || descriptionMatchesSearch;

      if (isSoldFilter === "all") {
        return matchesSearch;
      } else {
        return false;
      }
    });
    setFilteredProducts(filteredData);
  }, [productTableData, searchQuery, isSoldFilter]);

  // Update the calculation of indexOfFirstProduct and indexOfLastProduct to use filteredProducts
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when search query changes
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductSelection = (productId) => {
    const isSelected = selectedProducts.includes(productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleRequestSelectedProducts = async () => {
    try {
      for (const productId of selectedProducts) {
        const response = await axios.post(
          `${API_URL}/client/${productId}?scope=product`,
          {}, // No request body needed
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      }
      // Optionally clear selectedProducts state or update UI as needed
      toast.success(
        "Products requested successfully! We will get back to you soon.",
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error requesting products:", error);
      toast.error("Error requesting products. Please try again.");
    }
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
            </div>
            <Button
              color="indigo"
              buttonType="filled"
              size="regular"
              rounded={false}
              block={false}
              iconOnly={false}
              ripple="light"
              onClick={handleRequestSelectedProducts}
              disabled={selectedProducts.length === 0}
              className="flex items-center gap-2"
            >
              <IoMdAddCircle className="text-xl" />
              <span className="hidden text-base font-medium md:block">
                Request selected products
              </span>
            </Button>
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
                      "Id",
                      "Product Number",
                      "Description",
                      "Selling Price",
                      "Product",
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
                  {currentProducts.map(
                    ({ id, num, description, selling_price }, key) => {
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
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                onChange={() => handleProductSelection(id)}
                                checked={selectedProducts.includes(id)}
                                className="w-5 h-5 text-indigo-600 form-checkbox"
                              />
                            </label>
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
      <ToastContainer />
    </div>
  );
}

export default ClientTables;

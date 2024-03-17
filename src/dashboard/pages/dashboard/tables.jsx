import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { productTableData } from "../../data";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";

export function Tables() {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = () => {
    // Toggle the state to show/hide the add product form
    setShowAddForm(!showAddForm);
  };
  const handleEditProduct = (id) => {
    console.log(id);
    // Handle edit product
  };
  const handleDeleteProduct = (id) => {
    // Handle delete product
    console.log(id);
  };
  const handleViewProduct = (id) => {
    // Handle view product
    console.log(id);
  };
  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              Product Table
            </Typography>
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
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Id",
                  "Product Number",
                  "Description",
                  "Cost",
                  "Price",
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
              {productTableData.map(
                ({ Desc, No, Price, Cost, Status }, key) => {
                  const className = `py-3 px-5 ${
                    key === productTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={No}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              1
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
                              {No}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Desc}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Price}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Cost}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Status}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex">
                          <FaEdit
                            className="text-blue-500 cursor-pointer material-icons"
                            onClick={() => handleEditProduct(No)}
                          />
                          <MdAutoDelete
                            className="ml-2 text-red-500 cursor-pointer material-icons"
                            onClick={() => handleDeleteProduct(No)}
                          />
                          <MdOutlineVisibility
                            className="ml-2 text-green-500 cursor-pointer material-icons"
                            onClick={() => handleViewProduct(No)}
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
      {showAddForm && (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">Cost</label>
                <input
                  type="text"
                  placeholder="Cost"
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
              onClick={handleAddProduct}
              className="w-full"
            >
              Add Product
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;

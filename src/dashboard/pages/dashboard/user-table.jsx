/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from "react-js-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function UserTables() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [userTableData, setUserTableData] = useState([]);
  const [editUserData, setEditUserData] = useState(false);
  const [editUserId, setEditUserId] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUser = (id) => {
    setEditUserData(true);
    setEditUserId(id);
  };
  const handleEditUserSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://parts.kagaba.tech/users/${editUserId}`,
        { role: newUserData.role }, // Only include the role field in the request body
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setEditUserData(false);
      toast.success("User status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user status:", error);
      setErrorMessage("Error updating user status. Please try again.");
      setLoading(false);
    }
  };

  const handleViewUser = (id) => {
    // Handle view User
    console.log(id);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("https://parts.kagaba.tech/users/", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserTableData(response.data?.data?.users);
        setLoading(false);
      } catch (error) {
        console.error("Fetching user table data failed:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async () => {
    setShowAddForm(true);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://parts.kagaba.tech/users/",
        newUserData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("User added successfully");
      window.location.reload();
      // Reset the newUserData state to clear the form fields
      setNewUserData({
        name: "",
        email: "",
        role: "",
        password: "",
      });
      // Hide the add user form
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage("Error adding user. Please try again.");
      setLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `https://parts.kagaba.tech/users/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("User deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };
  // Filter the user table data based on the search query
  const filteredUserData = userTableData?.filter((user) => {
    if (user && user.name && user.email && user.role) {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return false; // Return false for undefined or missing properties
  });
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUserData.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              User Table
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
                <span className="text-base font-medium">Add New User</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Id", "Name", "Email", "Role", "Action"].map((el) => (
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
              {currentUsers?.map(({ id, name, email, role }, key) => {
                const className = `py-3 px-5 ${
                  key === currentUsers?.length - 1
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
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {role}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex">
                        <FaEdit
                          className="text-blue-500 cursor-pointer material-icons"
                          onClick={() => handleEditUser(id)}
                        />
                        <MdAutoDelete
                          className="ml-2 text-red-500 cursor-pointer material-icons"
                          onClick={() => handleDeleteUser(id)}
                        />
                        {/* <MdOutlineVisibility
                                                        className="ml-2 text-green-500 cursor-pointer material-icons"
                                                        onClick={() => handleViewUser(id)}
                                                    /> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(userTableData.length / usersPerPage) },
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
          {/* Add User Form */}
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="gray">
                Add New User
              </Typography>
              <button onClick={() => setShowAddForm(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {/* Add User form */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={newUserData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  {" "}
                  Role
                </label>
                {/* select user role user and admin */}
                <select
                  name="role"
                  value={newUserData.role}
                  onChange={handleInputChange}
                  defaultValue="agent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select role</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
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
              onClick={handleAddUser}
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
              {loading ? <Loader /> : "Add User"}
            </Button>
          </div>
        </div>
      )}
      {editUserData && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          {/* Edit Creditor Form */}
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Typography variant="h6" color="gray">
                Change User Status
              </Typography>
              <button onClick={() => setEditUserData(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            {/* Form fields and submit button */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600"> Role</label>
              {/* select user role user and admin */}
              <select
                name="role" // Make sure the name attribute matches the state variable
                value={newUserData.role}
                onChange={handleInputChange}
                defaultValue="agent"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select role</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
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
              onClick={handleEditUserSubmit}
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

export default UserTables;

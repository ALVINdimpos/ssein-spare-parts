/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
import { MdSecurity } from "react-icons/md"; // Added for permission icon
import Loader from "react-js-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

export function UserTables() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [userTableData, setUserTableData] = useState([]);
  const [editUserData, setEditUserData] = useState(false);
  const [editUserId, setEditUserId] = useState();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const API_URL = "https://test.husseinking.com";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUser = (id) => {
    setEditUserData(true);
    setEditUserId(id);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  // Mock permission management functions
  const handlePermissionClick = (user) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  const handlePermissionSave = () => {
    // Mock saving permissions
    const updatedUsers = userTableData.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          permissions: selectedUser.permissions,
        };
      }
      return user;
    });
    setUserTableData(updatedUsers);
    toast.success("Permissions updated successfully!");
    setShowPermissionModal(false);
  };

  const handlePermissionChange = (permission) => {
    setSelectedUser((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleEditUserSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_URL}/users/${editUserId}`,
        { role: newUserData.role },
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

  const isAdmin = userRole === "admin";
  const isSuperAdmin = userRole === "superadmin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/users/`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const usersWithPermissions = response.data?.data?.users.map((user) => ({
          ...user,
          permissions: {
            canEdit: false,
            canDelete: false,
            canView: true,
          },
        }));
        setUserTableData(usersWithPermissions);
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
      const response = await axios.post(`${API_URL}/users/`, newUserData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("User added successfully");
      window.location.reload();
      setNewUserData({
        name: "",
        email: "",
        role: "",
        password: "",
      });
      setShowAddForm(false);
    } catch (error) {
      setErrorMessage("Error adding user. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("User deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const filteredUserData = userTableData?.filter((user) => {
    if (user && user.name && user.email && user.role) {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return false;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUserData.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-4 mb-8 md:p-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <Typography variant="h6" color="white" className="mb-4 md:mb-0">
              Users Management
            </Typography>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <input
                type="text"
                placeholder="Search user..."
                className="w-full px-3 py-2 mb-2 text-black border border-gray-300 rounded-md md:w-auto focus:outline-none focus:border-indigo-500 md:mb-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={() => setShowAddForm(true)}
                color="white"
                className="flex items-center gap-2 text-blue-gray-600"
              >
                <IoMdAddCircle className="text-xl" />
                <span className="text-base font-medium text-blue-gray-600">
                  Add New User
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Id", "Name", "Email", "Role", "Permissions", "Actions"].map(
                  (el) => (
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {currentUsers?.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === currentUsers?.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={user.id}>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {user.id}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {user.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.role}
                      </Typography>
                    </td>
                    <td className={className}>
                      {isSuperAdmin && (
                        <Button
                          color="blue"
                          size="sm"
                          className="flex items-center gap-2 text-blue-gray-600"
                          onClick={() => handlePermissionClick(user)}
                        >
                          <MdSecurity />
                          Permissions
                        </Button>
                      )}
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        {(isSuperAdmin || user.permissions?.canEdit) && (
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleEditUser(user.id)}
                          />
                        )}
                        {(isSuperAdmin || user.permissions?.canDelete) &&
                          !isAdmin && (
                            <MdAutoDelete
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeleteUser(user.id)}
                            />
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ul className="flex flex-wrap space-x-2">
          {Array.from(
            { length: Math.ceil(filteredUserData.length / usersPerPage) },
            (_, i) => (
              <li key={i}>
                <Button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1 ? "bg-black" : "bg-gray-200"
                  } focus:outline-none`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && selectedUser && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg w-96">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" color="blue-gray">
                Manage Permissions: {selectedUser.name}
              </Typography>
              <button onClick={() => setShowPermissionModal(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <Typography className="font-medium">
                    Edit Permission
                  </Typography>
                  <Typography variant="small" color="gray">
                    Allow user to edit product
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUser.permissions?.canEdit}
                    onChange={() => handlePermissionChange("canEdit")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div
                className="px-4 py-3 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500"
                role="alert"
              >
                <p className="font-bold">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                color="gray"
                onClick={() => setShowPermissionModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                color="blue"
                onClick={handlePermissionSave}
                className="flex-1 text-blue-gray-600"
                disabled={loading}
              >
                {loading ? <Loader /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="gray">
                Add New User
              </Typography>
              <button onClick={() => setShowAddForm(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
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
                <label className="block mb-1 text-sm text-gray-600">Role</label>
                <select
                  name="role"
                  value={newUserData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select role</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>
            <Button
              color="blue"
              onClick={handleAddUser}
              className="w-full text-gray-600"
              disabled={loading}
            >
              {loading ? <Loader /> : "Add Role"}
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Form Modal */}
      {editUserData && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="gray">
                Edit User Role
              </Typography>
              <button onClick={() => setEditUserData(false)}>
                <IoIosCloseCircle className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-600">Role</label>
              <select
                name="role"
                value={newUserData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select role</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </select>
            </div>
            <Button
              color="blue"
              onClick={handleEditUserSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? <Loader /> : "Update Role"}
            </Button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UserTables;

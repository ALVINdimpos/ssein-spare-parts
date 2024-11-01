import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { ImEye } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns";
export function InquiriesTable() {
  const [queryData, setQueryData] = useState([]);
  const API_URL = "https://parts.husseinking.com";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/inquiry/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setQueryData(response?.data?.data?.inquiries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDeleteQuery = async (id) => {
    try {
      await axios.delete(`${API_URL}/inquiry/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "application/json",
        },
      });
      toast.success("Query deleted successfully");
      setQueryData(queryData.filter((query) => query.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting query:", error);
      toast.error("Error deleting query");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        // Handle case when access token is missing
        console.error("Access token is missing");
        return;
      }

      await axios.patch(`${API_URL}/inquiry/${id}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      toast.success("Query marked as read successfully");
      setQueryData(
        queryData.map((query) =>
          query.id === id ? { ...query, read: true } : query,
        ),
      );
      Window.location.reload();
    } catch (error) {
      console.error("Error marking query as read:", error);
      toast.error("Error marking query as read");
    }
  };

  const handleSortChange = (e) => {
    const sortByValue = e.target.value;

    if (sortByValue === "read") {
      const readQueries = queryData.filter((query) => query.read);
      setQueryData(readQueries);
    } else if (sortByValue === "unread") {
      const unreadQueries = queryData.filter((query) => !query.read);
      setQueryData(unreadQueries);
    } else {
      // If sorting by "all", reset the queryData to the original data
      setQueryData(queryData);
    }
  };

  const filteredQueryData = queryData.filter(
    (query) => query.context === "product",
  );
  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader variant="black" color="gray" className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white">
              Product inquiries
            </Typography>
            <div className="flex items-center gap-2">
              <select
                onChange={handleSortChange}
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                style={{
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "2.5rem", // Adjust according to the width of the arrow icon
                }}
              >
                <option value="all">All</option>
                <option value="read">Sort by Read</option>
                <option value="unread">Sort by Unread</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <div className="overflow-y-auto max-h-80">
            {filteredQueryData.length === 0 ? (
              <div className="py-4 text-center">No queries found.</div>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2"> Product Id</th>

                    <th className="px-4 py-2">Read</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueryData.map(
                    ({
                      id,
                      name,
                      email,
                      phone,
                      message,
                      created_at,
                      product_id,
                      read,
                    }) => (
                      <tr key={id}>
                        <td className="px-4 py-2 border">{id}</td>
                        <td className="px-4 py-2 border">{name}</td>
                        <td className="px-4 py-2 border">{email}</td>
                        <td className="px-4 py-2 border ">{phone}</td>
                        <td className="px-4 py-2 border">{message}</td>
                        <td className="px-4 py-2 border">
                          {format(new Date(created_at), "dd-MM-yyyy")}
                        </td>
                        <td className="px-4 py-2 border">{product_id}</td>
                        <td className="px-4 py-2 border">{read.toString()}</td>
                        <td className="px-4 py-2 border">
                          <div className="flex items-center space-x-2">
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content="Mark as Read!"
                            >
                              <FaEdit
                                className="text-blue-500 cursor-pointer"
                                onClick={() => handleMarkAsRead(id)}
                              />
                            </a>
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content="View Product!"
                            >
                              <ImEye
                                className="text-blue-500 cursor-pointer"
                                onClick={() => console.log(product_id)}
                              />
                            </a>
                            <MdAutoDelete
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeleteQuery(id)}
                            />
                          </div>
                          <Tooltip id="my-tooltip" />
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardBody>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default InquiriesTable;

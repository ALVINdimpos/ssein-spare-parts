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
import { format } from "date-fns";

export function ReminderTable() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editReminderId, setEditReminderId] = useState(0);
  const [editReminders, setEditReminders] = useState(false);
  const [remindersData, setRemindersData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [remindersPerPage] = useState(5);
  const [isStatusFilter, setIsStatusFilter] = useState("all");

  const [newReminderData, setNewReminderData] = useState({
    assignees: [],
    title: "",
    description: "",
    start_date: "",
    due_date: "",
    priority: 0,
    recurring: false,
    recurrence_type: "daily",
    recurrence_end: "",
    status: "active",
  });

  const API_URL = "https://test.husseinking.com";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/reminder/created`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.data.status === 200) {
          setRemindersData(response.data.data.reminders || []);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching reminders");
        console.error("Error fetching reminders:", error);
      }
    };
    fetchReminders();
  }, []);

  useEffect(() => {
    const filteredData = remindersData.filter((reminder) => {
      const titleMatches = reminder.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatches = reminder.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const assignorMatches = reminder.assignor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const assigneeMatches = reminder.assignees.some((assignee) =>
        assignee.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      let matchesSearch =
        titleMatches ||
        descriptionMatches ||
        assignorMatches ||
        assigneeMatches;

      if (isStatusFilter === "all") {
        return matchesSearch;
      } else {
        return matchesSearch && reminder.status === isStatusFilter;
      }
    });
    setFilteredReminders(filteredData);
  }, [searchQuery, isStatusFilter, remindersData]);
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString();
  };
  const formatAssignees = (assignees) => {
    return assignees.map((assignee) => assignee.name).join(", ");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "assignees") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
        Number(option.value),
      );
      setNewReminderData((prev) => ({
        ...prev,
        assignees: selectedOptions,
      }));
    } else {
      setNewReminderData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const prepareReminderData = () => {
    return {
      ...newReminderData,
      start_date: formatDateForAPI(newReminderData.start_date),
      due_date: formatDateForAPI(newReminderData.due_date),
      recurrence_end: newReminderData.recurring
        ? formatDateForAPI(newReminderData.recurrence_end)
        : null,
      priority: Number(newReminderData.priority),
    };
  };

  const handleAddReminder = async () => {
    try {
      setLoading(true);
      const formattedData = prepareReminderData();
      await axios.post(`${API_URL}/reminder/`, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      toast.success("Reminder added successfully");
      window.location.reload();
      setShowAddForm(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding reminder:", error);
      toast.error("Error adding reminder");
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await axios.delete(`${API_URL}/reminder/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Reminder deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Error deleting reminder");
    }
  };

  const handleEditReminder = async () => {
    try {
      setLoading(true);
      const formattedData = prepareReminderData();
      await axios.patch(
        `${API_URL}/reminder/${editReminderId}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      );
      setLoading(false);
      toast.success("Reminder updated successfully");
      window.location.reload();
      setEditReminders(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating reminder:", error);
      toast.error("Error updating reminder");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const currentReminders = filteredReminders.slice(
    indexOfFirstReminder,
    indexOfLastReminder,
  );

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader
          variant="gradient"
          color="blue"
          className="p-6 mb-8 bg-slate-500"
        >
          <div className="flex flex-col justify-between items-center md:flex-row">
            <Typography variant="h6" color="white">
              Reminders
            </Typography>
            <div className="flex flex-col gap-2 items-center md:flex-row">
              <input
                type="text"
                placeholder="Search Reminders..."
                className="px-3 py-2 text-black rounded-md border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex gap-2 items-center"
              >
                <IoMdAddCircle className="text-xl" />
                Add New Reminder
              </Button>
              <select
                value={isStatusFilter}
                onChange={(e) => setIsStatusFilter(e.target.value)}
                className="px-3 py-2 text-black rounded-md border border-gray-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader />
            </div>
          ) : currentReminders.length > 0 ? (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Title",
                    "Description",
                    "Assignees",
                    "Start Date",
                    "Due Date",
                    "Priority",
                    "Recurring",
                    "Action Owner",
                    "Action Date",
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
                {currentReminders.map((reminder) => (
                  <tr key={reminder.id}>
                    <td className="p-4">{reminder.title}</td>
                    <td className="p-4">{reminder.description}</td>
                    <td className="p-4">
                      {formatAssignees(reminder.assignees)}
                    </td>
                    <td className="p-4">
                      {format(
                        new Date(reminder.start_date),
                        "dd-MM-yyyy HH:mm",
                      )}
                    </td>
                    <td className="p-4">
                      {format(new Date(reminder.due_date), "dd-MM-yyyy HH:mm")}
                    </td>
                    <td className="p-4">
                      {reminder.priority === 0
                        ? "Low"
                        : reminder.priority === 1
                          ? "Medium"
                          : "High"}
                    </td>
                    <td className="p-4">
                      {reminder.recurring ? (
                        <div>
                          ({reminder.recurrence_type})
                          <br />
                          <span className="text-xs text-gray-500">
                            Ends:{" "}
                            {format(
                              new Date(reminder.recurrence_end),
                              "dd-MM-yyyy",
                            )}
                          </span>
                        </div>
                      ) : (
                        "No"
                      )}
                    </td>
                    {/* Action Type and Action Owner */}
                    <td className="p-4">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {reminder.actions.length > 0 && (
                          <>
                            {reminder.actions.map((action, index) => (
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
                    <td className="p-4">
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {reminder.actions.length > 0 && (
                          <>
                            {reminder.actions.map((action, index) => (
                              <div key={index}>
                                <span className="text-blue-500">
                                  {new Date(action.created_at).toLocaleString(
                                    "default",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>{" "}
                              </div>
                            ))}
                          </>
                        )}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <FaEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => {
                            setEditReminderId(reminder.id);
                            setEditReminders(true);
                            // Transform the data for the form
                            setNewReminderData({
                              ...reminder,
                              assignees: reminder.assignees.map((a) => a.id),
                            });
                          }}
                        />
                        <MdAutoDelete
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center p-8">
              <Typography variant="h6" color="gray">
                No reminders found
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editReminders) && (
        <div className="flex fixed top-0 left-0 justify-center items-center w-full h-full bg-black bg-opacity-60">
          <div className="p-8 w-96 bg-white rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">
                {editReminders ? "Edit Reminder" : "Add New Reminder"}
              </Typography>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditReminders(false);
                }}
              >
                <IoIosCloseCircle className="text-xl text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newReminderData.title}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded border"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Description</label>
                <textarea
                  name="description"
                  value={newReminderData.description}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded border"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Assignees</label>
                <select
                  name="assignees"
                  multiple
                  value={newReminderData.assignees}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded border"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Start Date</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={newReminderData.start_date}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded border"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Due Date</label>
                  <input
                    type="datetime-local"
                    name="due_date"
                    value={newReminderData.due_date}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded border"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm">Priority</label>
                <select
                  name="priority"
                  value={newReminderData.priority}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded border"
                >
                  <option value={0}>Low</option>
                  <option value={1}>Medium</option>
                  <option value={2}>High</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={newReminderData.recurring}
                  onChange={handleInputChange}
                />
                <label className="text-sm">Recurring</label>
              </div>

              {newReminderData.recurring && (
                <>
                  <div>
                    <label className="block mb-1 text-sm">
                      Recurrence Type
                    </label>
                    <select
                      name="recurrence_type"
                      value={newReminderData.recurrence_type}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded border"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">
                      Recurrence End Date
                    </label>
                    <input
                      type="datetime-local"
                      name="recurrence_end"
                      value={newReminderData.recurrence_end}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded border"
                    />
                  </div>
                </>
              )}

              <Button
                color="blue"
                onClick={editReminders ? handleEditReminder : handleAddReminder}
                className="w-full text-white bg-slate-800"
                disabled={loading}
              >
                {loading ? (
                  <Loader />
                ) : editReminders ? (
                  "Update Reminder"
                ) : (
                  "Add Reminder"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredReminders.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {Array.from(
              {
                length: Math.ceil(filteredReminders.length / remindersPerPage),
              },
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  color={currentPage === i + 1 ? "blue" : "gray"}
                  size="sm"
                  className="bg-slate-500"
                >
                  {i + 1}
                </Button>
              ),
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

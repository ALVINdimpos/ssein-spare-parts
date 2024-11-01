/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Card, Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "rsuite";
import { FaFaceRollingEyes } from "react-icons/fa6";
import { AiTwotoneEyeInvisible } from "react-icons/ai";
export function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState(null);
  const API_URL = "https://test.husseinking.com";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }
      const userData = response.data;
      setFormData(userData?.data?.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    try {
      axios.post(`${API_URL}/users/me`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Successfully updated user data");
    } catch (error) {
      toast.error("Failed to update user data");
      setError(error.message);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <Card className="w-full px-8 py-6 mx-auto md:w-2/3 lg:w-1/2">
        <h1 className="mb-8 text-3xl font-semibold text-center">My Profile</h1>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Name:</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            disabled={!editing}
            color="blue"
            size="regular"
            outline={editing}
            fullWidth
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Email:</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={!editing}
            color="blue"
            size="regular"
            outline={editing}
            fullWidth
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Password:</label>
          <div className="relative">
            <Input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              disabled={!editing}
              color="blue"
              size="regular"
              outline={editing}
              fullWidth
            />
            <button
              className="absolute transform -translate-y-1/2 right-4 top-1/2 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiTwotoneEyeInvisible className="w-6 h-6 text-gray-400" />
              ) : (
                <FaFaceRollingEyes className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-black"
            onClick={editing ? handleSaveClick : handleEditClick}
          >
            {loading ? (
              <Loader type="spinner-default" bgColor={"#fff"} size={20} />
            ) : editing ? (
              "Save"
            ) : (
              "Edit"
            )}
          </Button>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default Profile;

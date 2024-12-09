import { useState } from "react";
import PropTypes from "prop-types";
import { IoIosCloseCircle } from "react-icons/io";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "react-js-loader";

const BatteryDismantleModal = ({ isOpen, onClose, batteryId, cellCount }) => {
  const [imageFile, setImageFile] = useState(null);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [cellNumbers, setCellNumbers] = useState(
    Array(parseInt(cellCount)).fill(""),
  );
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleCellNumberChange = (index, value) => {
    const updatedCellNumbers = [...cellNumbers];
    updatedCellNumbers[index] = value;
    setCellNumbers(updatedCellNumbers);
  };

  const handleSubmitDismantle = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Previous validation logic remains the same

    const formData = new FormData();
    formData.append("files", imageFile);

    try {
      const imageUploadResponse = await axios.post(
        "https://test.husseinking.com/files/?scope=other",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      // Correctly extract the image path
      const imageUrl = imageUploadResponse.data.data.files[0].path;

      const dismantleRequestData = {
        image_url: imageUrl,
        selling_price: parseFloat(sellingPrice),
        cell_nos: cellNumbers,
      };

      await axios.post(
        `https://test.husseinking.com/battery/dismantle/${batteryId}`,
        dismantleRequestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      toast.success("Battery dismantled successfully");
      onClose();
    } catch (error) {
      console.error("Dismantle error:", error);
      toast.error("Failed to dismantle battery");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Dismantle Battery
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <IoIosCloseCircle className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmitDismantle}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">
              Upload Battery Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imageFile && (
              <p className="mt-2 text-sm text-green-600">
                {imageFile.name} selected
              </p>
            )}
          </div>

          {/* Selling Price */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">
              Selling Price
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Enter selling price"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cell Numbers */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">
              Cell Numbers (Total: {cellCount})
            </label>
            <div className="grid grid-cols-4 gap-2">
              {cellNumbers.map((cell, index) => (
                <input
                  key={index}
                  type="text"
                  value={cell}
                  onChange={(e) =>
                    handleCellNumberChange(index, e.target.value)
                  }
                  placeholder={`Cell ${index + 1}`}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            color="black"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <Loader type="spinner-default" bgColor={"#fff"} size={20} />
            ) : (
              "Dismantle Battery"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

BatteryDismantleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  batteryId: PropTypes.string.isRequired,
  cellCount: PropTypes.number.isRequired,
};

export default BatteryDismantleModal;

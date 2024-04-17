import { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-js-loader";
const PartDetail = () => {
  const { id } = useParams();
  const [partData, setPartData] = useState([]);
  const [fitments, setFitments] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false); // Step 1

  useEffect(() => {
    fetch(`https://parts.kagaba.tech/parts/${id}?scope=parts`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPartData(data);
        setFitments(data?.data?.fitments);
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const toggleInquiryForm = () => {
    setShowInquiryForm(!showInquiryForm); // Step 2
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingProduct(true); // Set loading to true when form is submitted
    try {
      const response = await fetch("https://test.kagaba.tech/inquiry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          context: "product",
          product_id: id,
        }),
      });
      if (response.ok) {
        // Handle success, maybe show a success message
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        toast.success("Message sent successfully");
        setLoadingProduct(false);
      } else {
        // Handle error, maybe show an error message
        toast.error("Failed to send inquiry");
      }
    } catch (error) {
      setLoadingProduct(false); // Set loading to false when error occurs
      toast.error("Failed to send inquiry");
    }
  };

  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl px-4 py-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="mb-4 text-3xl font-semibold">
            {partData?.data?.part?.name}
          </h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {partData?.data?.part?.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${partData?.data?.part?.name} Image ${index + 1}`}
                    className="object-cover w-full mb-4 rounded"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-gray-700">
                {partData?.data?.part?.description}
              </p>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Fitments</h2>
                {loading ? (
                  <p>Loading fitments...</p>
                ) : (
                  <ul className="pl-4 list-disc">
                    {fitments?.map((fitment, index) => (
                      <li key={index}>
                        <strong>
                          {fitment.year} {fitment.make} {fitment.model}
                        </strong>{" "}
                        - Trims: {fitment.trims.join(", ")}, Engines:{" "}
                        {fitment.engines.join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Other Names</h2>
                <ul className="pl-4 list-disc">
                  {partData?.data?.part?.other_names?.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Brands</h2>
                <div className="flex space-x-2">
                  {partData?.data?.part?.brands?.map((brand, index) => (
                    <img
                      key={index}
                      src={brand}
                      alt={`Brand ${index}`}
                      className="w-8 h-8"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={toggleInquiryForm}
                className="px-4 py-2 font-bold text-white rounded bg-primary hover:bg-primary-700"
              >
                Make Inquiry
              </button>
              {showInquiryForm && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Your Phone
                    </label>
                    <input
                      type="phone"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white rounded bg-primary hover:bg-primary"
                  >
                    {loadingProduct ? (
                      <Loader
                        type="spinner-circle"
                        bgColor={"#fff"}
                        size={20}
                      />
                    ) : (
                      "Send Inquiry"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PartDetail;

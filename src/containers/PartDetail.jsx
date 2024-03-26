import { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

const PartDetail = () => {
  const { id } = useParams();
  const [partData, setPartData] = useState([]);
  const [fitments, setFitments] = useState();
  const [loading, setLoading] = useState(false);
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
                <form>
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
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your email"
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
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white rounded bg-primary hover:bg-primary"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PartDetail;

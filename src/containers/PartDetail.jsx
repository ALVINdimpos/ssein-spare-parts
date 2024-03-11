/* eslint-disable no-unused-vars */
// Inside your React component (e.g., PartDetail.js)
import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

const PartDetail = () => {
  const { id } = useParams();
  console.log(id);
  const [partData, setPartData] = useState([]);
  const [fitments, setFitments] = useState();
  const [loading, setLoading] = useState(false);

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
              {/* <div className="flex items-center justify-between">
                                <span className="font-semibold text-green-600">{partData.data.part.price}</span>
                                <span className="text-gray-500">{partData.data.part.condition}</span>
                            </div> */}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PartDetail;

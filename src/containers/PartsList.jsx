/* eslint-disable no-unused-vars */
// Inside your React component
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
const PartsList = () => {
  const { model, year, trim, engine, subCategory } = useParams();
  const [parts, setParts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    fetch(
      `https://parts.husseinking.com/parts/?model=${model}&make=Toyota&year=${year}&trim=${trim}&engine=${engine}&sub_cat=${subCategory}&scope=parts`,
      {
        method: "GET",
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setParts(data);
      })
      .catch((error) => console.log(error));
  }, [model, year, trim, engine, subCategory]);
  return (
    <>
      <Nav />
      <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 lg:grid-cols-3">
        {parts?.data?.parts?.map((part) => (
          <div
            key={part.id}
            className="p-4 bg-white rounded shadow cursor-pointer"
            onClick={() => navigate(`/part-detail/${part.id}`)}
          >
            <h2 className="mb-2 text-lg font-semibold">{part.name}</h2>
            <div className="mb-4">
              {part.other_names && (
                <p className="text-gray-600">
                  Also known as: {part.other_names.join(", ")}
                </p>
              )}
            </div>
            <img
              src={part.images[0]}
              alt={`${part.name} Image`}
              className="object-cover w-full mb-4 rounded"
            />
            <p className="mb-4 text-gray-700">{part.description}</p>
            {/* <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-600">{part.price}</span>
                        <span className="text-gray-500">{part.condition}</span>
                    </div> */}
            <div className="flex space-x-2">
              {part.brands.map((brand, index) => (
                <img
                  key={index}
                  src={brand}
                  alt={`Brand ${index}`}
                  className="w-8 h-8"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default PartsList;

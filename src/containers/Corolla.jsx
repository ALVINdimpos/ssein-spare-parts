/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
// Inside Corolla.js
import React, { useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Corolla = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [parts, setParts] = useState([]);
  const openModal = (part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };
  const { year, make, model, engine } = useParams();
  const data = {
    year,
    make,
    model,
    engine,
  };
  // Use regex to separate trim and engine
  const engineRegex = /(.+)\s+([\d.]+L\s+[A-Za-z0-9\-\ ]+)/;
  const [, trim, engineWithoutTrim] = engine.match(engineRegex) || [];
  const engineWithTrim = engineWithoutTrim || engine;

  const closeModal = () => {
    setSelectedPart(null);
    setIsModalOpen(false);
  };
  useEffect(() => {
    fetch(
      `https://parts.husseinking.com/categories/?model=${model}&make=Toyota&year=${year}&trim=${trim}&engine=${engineWithTrim}&scope=parts`,
      {
        method: "GET",
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
      })

      .catch((error) => console.log(error));
  }, [model, year, trim, engine, engineWithTrim, data?.model, data?.year]);

  const handleSubCategoryClick = (subCategory) => {
    // Navigate to the PartsListPage with the selected subcategory
    navigate(
      `/parts-list/${year}/${make}/${model}/${trim}/${engineWithTrim}/${subCategory}`,
    );
  };
  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="container mx-auto">
          <h1 className="mb-4 text-3xl font-semibold">
            Our Best {model} Parts
          </h1>
          <p className="mb-8 text-gray-600">
            Here are some of our best products. We have a wide range of products
            to choose from.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category?.data?.parts_categories?.map((category, index) => (
              <div key={index} className="p-4 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold">
                  {category.category}
                </h2>
                <ul>
                  {category.sub_categories.map((subCategory, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-gray-700"
                      onClick={() => handleSubCategoryClick(subCategory)}
                    >
                      {subCategory}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h1 className="p-4 mt-4 text-3xl font-semibold">
            Our Best {model} accessories
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category?.data?.acc_categories?.map((category, index) => (
              <div key={index} className="p-4 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold">
                  {category.category}
                </h2>
                <ul className="cursor-pointer">
                  {category.sub_categories.map((subCategory, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-gray-700 cursor-pointer hover:text-blue-500"
                      onClick={() => handleSubCategoryClick(subCategory)}
                    >
                      {subCategory}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Corolla;

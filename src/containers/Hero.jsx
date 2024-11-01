import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { heroPic } from "../assets";

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shopByVehicle");
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [trimEngine, setTrimEngine] = useState([]);
  // fetch model
  // fetch years
  // trip and engine
  const [selectedInputs, setSelectedInputs] = useState({
    year: "",
    make: "",
    model: "",
    engine: "",
  });
  useEffect(() => {
    const allInputsSelected =
      selectedInputs.year &&
      selectedInputs.make &&
      selectedInputs.model &&
      selectedInputs.engine;

    if (allInputsSelected) {
      // Navigate to the relevant page based on the selected model
      navigate(
        `/corolla/${selectedInputs.year}/${selectedInputs.make}/${selectedInputs.model}/${selectedInputs.engine}`,
      );
    }
  }, [selectedInputs, navigate]);
  useEffect(() => {
    fetch("https://parts.husseinking.com/cars/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    fetch(`https://parts.husseinking.com/cars/?model=${selectedInputs.model}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setYears(data);
      })
      .catch((error) => console.log(error));
  }, [selectedInputs.model]);

  useEffect(() => {
    fetch(
      `https://parts.husseinking.com/cars/?model=${selectedInputs.model}&year=${selectedInputs.year}`,
      {
        method: "GET",
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setTrimEngine(data);
      })

      .catch((error) => console.log(error));
  }, [selectedInputs.model, selectedInputs.year]);
  const handleInputChange = (field, value) => {
    setSelectedInputs((prevSelectedInputs) => ({
      ...prevSelectedInputs,
      [field]: value,
    }));
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "shopByVehicle":
        return (
          <div className="relative flex gap-2 p-2 bg-white rounded-md shadow-sm h-30">
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label>Make:</label>
              <select
                className="input-dropdown"
                onChange={(e) => handleInputChange("make", e.target.value)}
              >
                <option selected></option>
                <option value="Toyota">Toyota</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label>Model:</label>
              <select
                className="input-dropdown"
                onChange={(e) => handleInputChange("model", e.target.value)}
              >
                <option selected></option>
                {models?.data?.models?.map((model) => (
                  <option key={model.id} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label htmlFor="year" className="mr-2">
                Year:
              </label>
              <select
                id="year"
                className=""
                onChange={(e) => handleInputChange("year", e.target.value)}
              >
                <option selected></option>
                {years?.data?.years?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label>Engine:</label>
              <select
                className="input-dropdown"
                onChange={(e) => handleInputChange("engine", e.target.value)}
              >
                <option selected></option>
                {trimEngine?.data?.trims_and_engines?.map((engine) => (
                  <option key={engine.id} value={engine}>
                    {engine}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "searchByPart":
        return (
          <div className="relative flex gap-2 p-2 bg-white rounded-md shadow-sm h-30">
            <div className="flex justify-between w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label className="m-auto text-sm font-medium text-left text-gray-700 ">
                Part Number:
              </label>
              <input
                type="text"
                className="w-2/3 px-2 py-1 mr-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 text-white transition duration-200 ease-in-out bg-red-600 rounded-sm ">
                Find Part
              </button>
            </div>
          </div>
        );
      case "searchByVin":
        return (
          //
          <div className="relative flex p-2 bg-white rounded-md shadow-sm h-30">
            <div className="flex w-2/3 gap-1 px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500">
              <label className="m-auto text-sm font-medium text-left text-gray-700 ">
                Vin:
              </label>
              <input
                type="text"
                className="w-2/3 px-2 py-1 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 text-white transition duration-200 ease-in-out bg-red-600 rounded-sm ">
                Find Part
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-white mt-[-30px] dark:bg-white">
      <div className="grid max-w-screen-xl h-[100vh] px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-black">
            We are your one-stop shop for all your Toyota original spare parts
            needs.
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            With our extensive inventory and commitment to quality, we make it
            easy for you to find and order the parts you need to keep your
            Toyota running smoothly.
          </p>

          <div className="flex mb-4 space-x-4">
            <button
              className={`tab nav-link bg-red-600 text-white rounded-sm transition duration-200 ease-in-out px-4 py-2 uppercase text-center font-semibold hover:bg-red-800 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200${activeTab === "shopByVehicle" ? "active" : ""}`}
              onClick={() => setActiveTab("shopByVehicle")}
            >
              SHOP BY VEHICLE
            </button>
            <button
              className={`tab nav-link bg-red-600 text-white rounded-sm transition duration-200 ease-in-out px-4 py-2 uppercase text-center font-semibold hover:bg-red-800 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 ${activeTab === "searchByPart" ? "active" : ""}`}
              onClick={() => setActiveTab("searchByPart")}
            >
              SEARCH BY PART
            </button>
            <button
              className={`tab nav-link bg-red-600 text-white rounded-sm transition duration-200 ease-in-out px-4 py-2 uppercase text-center font-semibold hover:bg-red-800 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 ${activeTab === "searchByVin" ? "active" : ""}`}
              onClick={() => setActiveTab("searchByVin")}
            >
              SEARCH BY VIN
            </button>
          </div>

          <div className="tab-content">{renderTabContent()}</div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex w-[100%] h-[100%]">
          <img src={heroPic} alt="mockup" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

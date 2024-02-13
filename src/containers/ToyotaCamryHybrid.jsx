import Nav from "./Nav";
import Footer from "./Footer";

const ToyotaCamryHybrid = () => {
  // Array of ToyotaCamryHybrid parts
  const ToyotaCamryHybridParts = [
    {
      id: 1,
      name: "Air & Fuel Delivery",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/air-intake-category.webp",
      details: "Description for Air & Fuel Delivery part",
    },
    {
      id: 4,
      name: "Filters",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/filters-category.webp",
      details: "Description for Body part",
    },
    {
      id: 5,
      name: "Brakes",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/brakes-category.webp",
      details: "Description for Brakes part",
    },
    {
      id: 6,
      name: "Gasket",
      imageUrl:
        "	https://cdn.revolutionparts.com/assets/categories/gasket-category.webp",
      details: "Description for Cargo Management part",
    },
    {
      id: 8,
      name: "Cooling System",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/cooling-systems-category.webp",
      details: "Description for Cooling System part",
    },
    {
      id: 13,
      name: "Engine",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/engines-components-category.webp",
      details: "Description for Engine part",
    },
    {
      id: 15,
      name: "Exterior",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/exterior-category.webp",
      details: "Description for Exterior part",
    },
    {
      id: 18,
      name: "Ignition Systems",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/ignition-systems-category.webp",
      details: "Description for HVAC part",
    },
    {
      id: 19,
      name: "Interior",
      imageUrl:
        "	https://cdn.revolutionparts.com/assets/categories/interior-category.webp",
      details: "Description for Interior part",
    },
    {
      id: 20,
      name: "Lighting & Lamps",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/lighting-category.webp",
      details: "Description for Maintenance & Lubrication part",
    },
    {
      id: 25,
      name: "Suspension & Steering",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/suspension-category.webp",
      details: "Description for Suspension part",
    },
    {
      id: 26,
      name: "Wheels, Tires & Parts",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/wheels-category.webp",
      details: "Description for Transmission part",
    },
  ];

  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="container mx-auto">
          <h1 className="mb-4 text-3xl font-semibold">
            Our Best ToyotaCamryHybrid Parts
          </h1>
          <p className="mb-8 text-gray-600">
            Here are some of our best products. We have a wide range of products
            to choose from.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ToyotaCamryHybridParts.map((part) => (
              <div key={part.id} className="p-6 bg-white rounded-lg shadow-md">
                <img
                  className="object-contain w-full h-40 mb-4 rounded"
                  src={part.imageUrl}
                  alt={`Product ${part.id}`}
                />
                <h3 className="mb-2 text-xl font-semibold">{part.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToyotaCamryHybrid;

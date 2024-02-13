import Nav from "./Nav";
import Footer from "./Footer";

const Yaris = () => {
  // Array of Yaris parts
  const YarisParts = [
    {
      id: 1,
      name: "Air & Fuel Delivery",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/fuel-system.webp",
      details: "Description for Air & Fuel Delivery part",
    },
    {
      id: 2,
      name: "Automatic Transmission",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/automatic-transmission.webp",
      details: "Description for Automatic Transmission part",
    },
    {
      id: 3,
      name: "Belts & Cooling",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/cooling-system.webp",
      details: "Description for Belts & Cooling part",
    },
    {
      id: 4,
      name: "Body",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/body.webp",
      details: "Description for Body part",
    },
    {
      id: 5,
      name: "Brakes",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/brakes.webp",
      details: "Description for Brakes part",
    },
    {
      id: 6,
      name: "Cargo Management",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/cargo-management.webp",
      details: "Description for Cargo Management part",
    },
    {
      id: 7,
      name: "Clutch",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/clutch.webp",
      details: "Description for Clutch part",
    },
    {
      id: 8,
      name: "Cooling System",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/cooling-system.webp",
      details: "Description for Cooling System part",
    },
    {
      id: 9,
      name: "Driveline & Axles",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/front-drive-axle.webp",
      details: "Description for Driveline & Axles part",
    },
    {
      id: 10,
      name: "Electrical",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/electrical.webp",
      details: "Description for Electrical part",
    },
    {
      id: 11,
      name: "Electronics",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/electronics.webp",
      details: "Description for Electronics part",
    },
    {
      id: 12,
      name: "Emission System",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/emission-system.webp",
      details: "Description for Emission System part",
    },
    {
      id: 13,
      name: "Engine",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/engine.webp",
      details: "Description for Engine part",
    },
    {
      id: 14,
      name: "Exhaust",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/exhaust-system.webp",
      details: "Description for Exhaust part",
    },
    {
      id: 15,
      name: "Exterior",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/exterior.webp",
      details: "Description for Exterior part",
    },
    {
      id: 16,
      name: "Front Drive Axle",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/front-drive-axle.webp",
      details: "Description for Front Drive Axle part",
    },
    {
      id: 17,
      name: "Fuel System",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/fuel-system.webp",
      details: "Description for Fuel System part",
    },
    {
      id: 18,
      name: "HVAC",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/hvac.webp",
      details: "Description for HVAC part",
    },
    {
      id: 18,
      name: "Ignition",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/security.webp",
      details: "Description for HVAC part",
    },
    {
      id: 19,
      name: "Interior",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/interior.webp",
      details: "Description for Interior part",
    },
    {
      id: 20,
      name: "Maintenance & Lubrication",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/maintenance-and-lubrication.webp",
      details: "Description for Maintenance & Lubrication part",
    },
    {
      id: 21,
      name: "Manual Transmission",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/manual-transmission.webp",
      details: "Description for Manual Transmission part",
    },
    {
      id: 22,
      name: "Performance",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/performance.webp",
      details: "Description for Performance part",
    },
    {
      id: 23,
      name: "Serviceable Components",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/serviceable-components.webp",
      details: "Description for Serviceable Components part",
    },
    {
      id: 24,
      name: "Steering",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/steering.webp",
      details: "Description for Steering part",
    },
    {
      id: 25,
      name: "Suspension",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/front-suspension.webp",
      details: "Description for Suspension part",
    },
    {
      id: 26,
      name: "Transmission",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/manual-transmission.webp",
      details: "Description for Transmission part",
    },
    {
      id: 27,
      name: "Vehicles, Equipment, Tools, & Supplies",
      imageUrl:
        "https://cdn.revolutionparts.com/assets/categories/default.webp",
      details: "Description for Vehicles, Equipment, Tools, & Supplies part",
    },
    {
      id: 28,
      name: "Wheels",
      imageUrl: "https://cdn.revolutionparts.com/assets/categories/wheels.webp",
      details: "Description for Wheels part",
    },
  ];

  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="container mx-auto">
          <h1 className="mb-4 text-3xl font-semibold">Our Best Yaris Parts</h1>
          <p className="mb-8 text-gray-600">
            Here are some of our best products. We have a wide range of products
            to choose from.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {YarisParts.map((part) => (
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

export default Yaris;

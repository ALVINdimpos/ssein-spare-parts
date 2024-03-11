const corollaParts = [
  {
    id: 1,
    name: "Air & Fuel Delivery",
    imageUrl:
      "https://cdn.revolutionparts.com/assets/categories/fuel-system.webp",
    subCategory: [
      {
        id: 1,
        name: "Gaskets & Sealing Systems",
      },
    ],
  },
  {
    id: 2,
    name: "Automatic Transmission",
    imageUrl:
      "https://cdn.revolutionparts.com/assets/categories/automatic-transmission.webp",
    subCategory: [
      {
        id: 1,
        name: "Automatic Transmission",
      },
      {
        id: 2,
        name: "Gear Shift Control",
      },
    ],
  },
  {
    id: 3,
    name: "Belts & Cooling",
    imageUrl:
      "https://cdn.revolutionparts.com/assets/categories/cooling-system.webp",
    subCategory: [
      {
        id: 1,
        name: "Gaskets & Sealing Systems",
      },
      {
        id: 2,
        name: "Hoses & Pipes",
      },
      {
        id: 3,
        name: "Thermostat & Housing",
      },
    ],
  },
  {
    id: 4,
    name: "Body",
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/body.webp",
    subCategory: [
      { id: 1, name: "Bumper & Components - Front" },
      { id: 2, name: "Bumper & Components - Rear" },
      { id: 3, name: "Center Console" },
      { id: 4, name: "Center Pillar & Rocker" },
      { id: 5, name: "Cluster & Switches" },
      { id: 6, name: "Cowl" },
      { id: 7, name: "Door & Components" },
      { id: 8, name: "Doors" },
      { id: 9, name: "Driver Seat Components" },
      { id: 10, name: "Ducts" },
      { id: 11, name: "Exterior Trim - Fender" },
      { id: 12, name: "Exterior Trim - Front Door" },
      { id: 13, name: "Exterior Trim - Pillars" },
      { id: 14, name: "Exterior Trim - Rear Door" },
      { id: 15, name: "Exterior Trim - Roof" },
      { id: 16, name: "Exterior Trim - Trunk" },
      { id: 17, name: "Fender & Components" },
      { id: 18, name: "Floor & Rails" },
      { id: 19, name: "Front Door" },
      { id: 20, name: "Glass & Hardware - Back" },
      { id: 21, name: "Glass - Front Door" },
      { id: 22, name: "Glass - Rear Door" },
      { id: 23, name: "Glass - Windshield" },
      { id: 24, name: "Glove Box" },
      { id: 25, name: "Grille & Components" },
      { id: 26, name: "Hinge Pillar" },
      { id: 27, name: "Hood & Components" },
      { id: 28, name: "Inner Structure" },
      { id: 29, name: "Instrument Panel" },
      { id: 30, name: "Instrument Panel Components" },
      { id: 31, name: "Interior Trim - Front Door" },
      { id: 32, name: "Interior Trim - Pillars" },
      { id: 33, name: "Interior Trim - Quarter Panels" },
      { id: 34, name: "Interior Trim - Rear Body" },
      { id: 35, name: "Interior Trim - Rear Door" },
      { id: 36, name: "Interior Trim - Roof" },
      { id: 37, name: "Interior Trim - Trunk" },
      { id: 38, name: "Jack & Components" },
      { id: 39, name: "Labels" },
      { id: 40, name: "Lid & Components" },
      { id: 41, name: "Lock & Hardware" },
      { id: 42, name: "Master Cylinder - Components On Dash Panel" },
      { id: 43, name: "Outside Mirrors" },
      { id: 44, name: "Passenger Seat Components" },
      { id: 45, name: "Quarter Panel & Components" },
      { id: 46, name: "Radiator Support" },
      { id: 47, name: "Rear Body" },
      { id: 48, name: "Rear Door" },
      { id: 49, name: "Rear Floor & Rails" },
      { id: 50, name: "Rear Seat Components" },
      { id: 51, name: "Reveal Moldings" },
      { id: 52, name: "Roof & Components" },
      { id: 53, name: "Seat Belt" },
      { id: 54, name: "Sound System" },
      { id: 55, name: "Splash Shields" },
      { id: 56, name: "Spoiler" },
      { id: 57, name: "Structural Components & Rails" },
      { id: 58, name: "Sunroof" },
      { id: 59, name: "Trunk" },
      { id: 60, name: "Wiper & Washer Components" },
    ],
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
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/exterior.webp",
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
    id: 19,
    name: "Interior",
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/interior.webp",
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
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/steering.webp",
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
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/default.webp",
    details: "Description for Vehicles, Equipment, Tools, & Supplies part",
  },
  {
    id: 28,
    name: "Wheels",
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/wheels.webp",
    details: "Description for Wheels part",
  },
];

export default corollaParts;

const ProductParts = [
  {
    id: 1,
    name: "Cover Front Bumper L P",
    imageUrl:
      "https://dz310nzuyimx0.cloudfront.net/strapr1/c03e0…fbf6650704c5/f941dc6110c9152ca7358a48edd5373b.png",
    details: "Description for Air & Fuel Delivery part",
  },
  {
    id: 2,
    name: "Bumper Cover Support Rail Clip",
    imageUrl:
      "https://s3.amazonaws.com/rp-part-images/assets/46b6a0ab360d674b767111bb020c9cff.webp",
    details: "Description for Automatic Transmission part",
  },
  {
    id: 3,
    name: "Clip, Pin Hold",
    imageUrl:
      "https://dz310nzuyimx0.cloudfront.net/strapr1/c03e0…fbf6650704c5/c4df9d6e868aa2cb48d624c40b87b26a.png",
    details: "Description for Belts & Cooling part",
  },
  {
    id: 4,
    name: "Side Retainer",
    imageUrl:
      "https://dz310nzuyimx0.cloudfront.net/strapr1/c03e0…fbf6650704c5/f56cde4132d53ce46f0049450a97acab.png",
    details: "Description for Body part",
  },
  {
    id: 5,
    name: "Fog Light Trim",
    imageUrl:
      "https://dz310nzuyimx0.cloudfront.net/strapr1/c03e0…fbf6650704c5/c47401b255cb4736d28a96fb21cc1850.png",
    details: "Description for Brakes part",
  },
  {
    id: 6,
    name: "Fog Lamp Assembly Screw",
    imageUrl:
      "https://dz310nzuyimx0.cloudfront.net/strapr1/c03e0…fbf6650704c5/8aa6ea395da5034fa1bd4d7c452b06b9.png",
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
    id: 17,
    name: "Universals & Rear Axle",
    imageUrl:
      "	https://cdn.revolutionparts.com/assets/categories/universals-and-rear-axle.webp",
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
    imageUrl: "https://cdn.revolutionparts.com/assets/categories/security.webp",
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
      "https://cdn.revolutionparts.com/assets/categories/transmission.webp",
    details: "Description for Transmission part",
  },
  {
    id: 26,
    name: "Trailering ",
    imageUrl:
      "https://cdn.revolutionparts.com/assets/categories/trailering.webp",
    details: "Description for Transmission part",
  },
  {
    id: 26,
    name: "Transfer Case",
    imageUrl:
      "	https://cdn.revolutionparts.com/assets/categories/transfer-case-assembly.webp",
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

export default ProductParts;

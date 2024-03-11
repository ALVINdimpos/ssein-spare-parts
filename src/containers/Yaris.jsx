import Nav from "./Nav";
import Footer from "./Footer";
import YarisParts from "../helpers/YarisParts";
import { useNavigate } from "react-router-dom";
const Yaris = () => {
  const navigate = useNavigate();
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
              <div
                key={part.id}
                className="p-6 bg-white rounded-lg shadow-md cursor-pointer"
                onClick={() => navigate(`/single-product/${part.id}`)}
              >
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

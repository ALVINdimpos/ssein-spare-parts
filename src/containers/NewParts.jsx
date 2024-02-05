import Nav from "./Nav";
import Footer from "./Footer";
const NewParts = () => {
  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl  px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 ">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Our Best Products</h1>
          <p className="text-gray-600 mb-8">
            Here are some of our best products. We have a wide range of products
            to choose from.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                View Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                View Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                View Details
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                className="w-full h-40 object-cover mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-700 mb-4">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NewParts;

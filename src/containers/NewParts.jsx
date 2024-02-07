import Nav from "./Nav";
import Footer from "./Footer";
const NewParts = () => {
  return (
    <div>
      <Nav />
      <section className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 ">
        <div className="container mx-auto">
          <h1 className="mb-4 text-3xl font-semibold">Our Best New Parts</h1>
          <p className="mb-8 text-gray-600">
            Here are some of our best products. We have a wide range of products
            to choose from.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded bg-primary">
                View Details
              </button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded bg-primary">
                View Details
              </button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded-md bg-primary">
                View Details
              </button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded-md bg-primary">
                View Details
              </button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded-md bg-primary">
                View Details
              </button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <img
                className="object-cover w-full h-40 mb-4 rounded-md"
                src="https://trudelauto.com/en/image/1187437"
                alt="Product 1"
              />
              <h3 className="mb-2 text-xl font-semibold">Product 1</h3>
              <p className="mb-4 text-gray-700">
                Description of Product 1. Add some compelling details here.
              </p>
              <button className="px-4 py-2 text-white rounded-md bg-primary">
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

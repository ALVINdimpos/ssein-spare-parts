const categorySection = () => {
  return (
    <div className="max-w-screen-xl  px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 ">
      <h1 className="text-3xl font-semibold mb-4">Shop By Category</h1>
      <p className="text-gray-600 mb-8">
        Sagittis Purus Sit Amet Ultrices Dui Volutpat Consequat Mauris.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="flex flex-col   rounded-xl dark:bg-white dark:border-bg-black ">
          <img
            className="w-full h-auto rounded-t-xl"
            src="https://trudelauto.com/en/image/1181755"
            alt="Image Description"
          />
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-black dark:text-black">
              Card title
            </h3>
          </div>
        </div>
        <div className="flex flex-col   rounded-xl dark:bg-white dark:border-bg-black ">
          <img
            className="w-full h-auto rounded-t-xl"
            src="https://trudelauto.com/en/image/1181755"
            alt="Image Description"
          />
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-black dark:text-black">
              Card title
            </h3>
          </div>
        </div>
        <div className="flex flex-col   rounded-xl dark:bg-white dark:border-bg-black ">
          <img
            className="w-full h-auto rounded-t-xl"
            src="https://trudelauto.com/en/image/1181755"
            alt="Image Description"
          />
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-black dark:text-black">
              Card title
            </h3>
          </div>
        </div>
        <div className="flex flex-col   rounded-xl dark:bg-white dark:border-bg-black ">
          <img
            className="w-full h-auto rounded-t-xl"
            src="https://trudelauto.com/en/image/1181755"
            alt="Image Description"
          />
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-black dark:text-black">
              Card title
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default categorySection;

import Nav from "./Nav";
import Footer from "./Footer";
import "./singleProduct.css";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const SingleProduct = () => {
  const navigate = useNavigate();
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=62814142579980");
  };

  const handlePhone = () => {
    window.open("tel:+62814142579980");
  };

  return (
    <div>
      <Nav />
      <main id="products">
        <div className="container">
          <div className="producat_wrapper">
            <div className="producat_image">
              <div className="img_thumbnail">
                <img src="https://trudelauto.com/image/1165058" alt="" />
                <div className="img_small">
                  <img
                    src="https://trudelauto.com/image/1165058"
                    alt=""
                    className="active"
                  />
                  <img src="https://trudelauto.com/image/1165058" alt="" />
                  <img src="https://trudelauto.com/image/1165058" alt="" />
                  <img src="https://trudelauto.com/image/1165058" alt="" />
                </div>
              </div>
            </div>
            <div className="producat_content">
              <h3 className="company_txt">Sneaker Company</h3>
              <p className="producat_des">
                These low-profile sneakers are your perfect casual wear
                companion. Featuring a durable rubber outer sole, they’ll
                withstand everything the weather can offer.
              </p>
              <div className="">
                <div className="mb-8 flex w-full max-w-[400px]">
                  <div className="bg-primary/5 text-primary mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded sm:h-[70px] sm:max-w-[70px] cursor-pointer">
                    <FaPhoneVolume onClick={handlePhone} />
                  </div>
                  <div className="w-full ">
                    <h4 className="mb-1 text-xl font-bold text-dark dark:text-black">
                      Phone Number
                    </h4>
                    <p className="text-base text-body-color dark:text-dark-6">
                      (+62)81 414 257 9980
                    </p>
                  </div>
                </div>
                <div className="mb-8 flex w-full max-w-[370px]">
                  <div className="bg-primary/5 text-primary mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded sm:h-[70px] sm:max-w-[70px] cursor-pointer">
                    <FaWhatsapp onClick={handleWhatsApp} />
                  </div>
                  <div className="w-full">
                    <h4 className="mb-1 text-xl font-bold text-dark dark:text-black">
                      Whatsap Number
                    </h4>
                    <p className="text-base text-body-color dark:text-dark-6">
                      +62 81 414 257 9980
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="w-full px-4 py-2 font-bold text-white rounded bg-primary xl:px-6 xl:py-3"
                    onClick={() => navigate("/contact-us")}
                  >
                    Make Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SingleProduct;

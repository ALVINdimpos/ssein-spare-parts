import Nav from "./Nav";
import Footer from "./Footer";
import "./singleProduct.css";

const SingleProduct = () => {
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SingleProduct;

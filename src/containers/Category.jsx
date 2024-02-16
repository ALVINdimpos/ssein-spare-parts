import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
  {
    title: "Corolla",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b2/2010_Toyota_Corolla_CE%2C_Front_Left.jpg",
    link: "/corolla",
  },
  {
    title: "Yaris",
    imageUrl:
      "https://www.thedrive.com/uploads/2022/11/22/2007_10_08_yaris_liftback01.jpg?auto=webp&crop=16%3A9&auto=webp&optimize=high&quality=70&width=3840",
    link: "/yaris",
  },
  {
    title: "Toyota camry ",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg",
    link: "/toyota-camry",
  },
  {
    title: "Toyota camry hybrid",
    imageUrl:
      "https://cimg0.ibsrv.net/ibimg/hgm/400x225-1/100/610/2018-toyota-camry-hybrid-le-willamette-valley-oregon-june-2017_100610816.jpg",
    link: "/toyota-camry-hybrid",
  },
  {
    title: "RAV4",
    imageUrl: "	https://autotras.com/images/1312/toyota-rav4-specs.jpg",
    link: "/rav4",
  },
  {
    title: "Rav 4 hybrid",
    imageUrl:
      "https://media.ed.edmunds-media.com/toyota/rav4-hybrid/2022/oem/2022_toyota_rav4-hybrid_4dr-suv_se_fq_oem_1_600.jpg",
    link: "/rav4-hybrid",
  },
  {
    title: "Toyota vigo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg",
    link: "/vigo",
  },
  {
    title: "Toyota Highlander ",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Toyota_Highlander_Hybrid_%28XU70%29_1X7A6356.jpg",
    link: "/highlander-hybrid",
  },
  {
    title: "Toyota Highlander Hybrid",
    imageUrl:
      "https://cdn-efgbn.nitrocdn.com/lmgYxzPPAGrXVSprhVzBBdYvBOErIXLC/assets/images/optimized/rev-839abf7/hightechtexan.com/wp-content/uploads/2021/06/2021-Toyota-Highlander-Hybrid-Review.jpg",
    link: "/highlander-hybrid",
  },
];
const CategorySection = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
      <h1 className="mb-4 text-3xl font-semibold">Shop By Category</h1>
      <p className="mb-8 text-gray-600">
        Sagittis Purus Sit Amet Ultrices Dui Volutpat Consequat Mauris.
      </p>

      <Slider {...settings} className="mb-8">
        {categories.map((category, index) => (
          <div key={index}>
            <div
              className="flex flex-col p-4 mr-4 cursor-pointer rounded-xl dark:bg-white dark:border-bg-black"
              onClick={() => {
                navigate(`${category.link}`);
              }}
            >
              <img
                className="object-cover w-full h-40 rounded-t-xl"
                src={category.imageUrl}
                alt="Image Description"
              />
              <div>
                <h3 className="text-lg font-bold text-black dark:text-black">
                  {category.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySection;

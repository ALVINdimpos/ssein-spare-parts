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
    title: "Toyota camry hybrid",
    imageUrl:
      "https://cimg0.ibsrv.net/ibimg/hgm/400x225-1/100/610/2018-toyota-camry-hybrid-le-willamette-valley-oregon-june-2017_100610816.jpg",
    link: "/toyota-camry-hybrid",
  },

  {
    title: "Rav 4 hybrid",
    imageUrl:
      "https://media.ed.edmunds-media.com/toyota/rav4-hybrid/2022/oem/2022_toyota_rav4-hybrid_4dr-suv_se_fq_oem_1_600.jpg",
    link: "/rav4",
  },
  {
    title: "Toyota vigo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg",
    link: "/vigo",
  },
  {
    title: "Toyota Highlander Hybrid",
    imageUrl:
      "https://cdn-efgbn.nitrocdn.com/lmgYxzPPAGrXVSprhVzBBdYvBOErIXLC/assets/images/optimized/rev-839abf7/hightechtexan.com/wp-content/uploads/2021/06/2021-Toyota-Highlander-Hybrid-Review.jpg",
    link: "/highlander",
  },
  // {
  //   title: "Cressida",
  //   imageUrl:
  //     "https://hips.hearstapps.com/hmg-prod/images/1981-toyota-cressida-104-6441661cc24d5.jpg?crop=0.708xw:0.527xh;0.188xw,0.348xh&resize=1200:*",
  // },
  // {
  //   title: "Echo",
  //   imageUrl:
  //     "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR-OEI8FO1owZUz4C0Hv33e-eVhSVW5BHrVX6ZmIudhLhDBqoEe",
  // },
  // {
  //   title: "FJ Cruiser",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/a/af/2011_Toyota_FJ_Cruiser_%28GSJ15R%29_wagon_%282011-11-08%29_01.jpg",
  // },
  // {
  //   title: "GR Supra",
  //   imageUrl:
  //     "https://cdn.motor1.com/images/mgl/0eeJ2W/s1/2023-toyota-supra-with-manual-gearbox-europe.webp",
  // },
  // {
  //   title: "GR86",
  //   imageUrl:
  //     "https://86speed.com/images/thumbs/w_6_0022497_artisan-spirits-sports-line-black-label-gt-full-widebody-2022-toyota-gr86.jpeg",
  // },
  // {
  //   title: "Land Cruiser",
  //   imageUrl:
  //     "https://imgd.aeplcdn.com/664x374/n/cw/ec/139739/land-cruiser-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
  // },
  // {
  //   title: "Matrix",
  //   imageUrl:
  //     "https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/d48b16f0-4fdb-4cb3-812a-9fec8dbfdf3f/1b17c8af-1497-4bfb-8701-7a0caddfc2d7.png",
  // },
  // {
  //   title: "Mirai",
  //   imageUrl:
  //     "https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Mirai/2421/1648822281719/front-left-side-47.jpg?tr=w-664",
  // },
  // {
  //   title: "MR2",
  //   imageUrl:
  //     "https://www.motortrend.com/uploads/2023/07/Toyota-Sports-EV-Concept.jpg?fit=around%7C875:492",
  // },
  // {
  //   title: "MR2 Spyder",
  //   imageUrl:
  //     "https://hips.hearstapps.com/hmg-prod/images/2003-mr2-spyder-2-1599224809.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*",
  // },
  // {
  //   title: "Paseo",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/1/1a/Toyota_Paseo_--_09-07-2009.jpg",
  // },
  // {
  //   title: "Pickup",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/0/02/Ford_F-150_crew_cab_--_05-28-2011.jpg",
  // },
  // {
  //   title: "Previa",
  //   imageUrl:
  //     "https://ymimg1.b8cdn.com/resized/car_model/2987/pictures/2782376/webp_listing_main_thumb.webp",
  // },
  // {
  //   title: "Prius",
  //   imageUrl:
  //     "https://www.freep.com/gcdn/presto/2023/04/03/PDTF/3f656094-eea6-4739-a74f-55bce1990759-IMG_5353.JPEG?width=1320&height=990&fit=crop&format=pjpg&auto=webp",
  // },
  // {
  //   title: "Prius AWD-e",
  //   imageUrl:
  //     "https://www.motortrend.com/uploads/sites/5/2019/04/2019-Toyota-Prius-AWD-e-front-side-view-parked.jpg?fit=around%7C875:492",
  // },
  // {
  //   title: "Prius C",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/b/b8/2012_Toyota_Prius_c_%28NHP10R%29_hatchback_%282015-07-03%29_01.jpg",
  // },
  // {
  //   title: "Prius Plug-In",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/5/54/2019_Toyota_Prius_Business_Edition%2B_PHEV_1.8.jpg",
  // },
  // {
  //   title: "Prius Prime",
  //   imageUrl:
  //     "https://hips.hearstapps.com/hmg-prod/images/2023-toyota-prius-prime-xse-474-647f7e6f0b72e.jpg?crop=0.606xw:0.511xh;0.335xw,0.465xh&resize=1200:*",
  // },
  // {
  //   title: "Prius V",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/0/02/2012_Toyota_Prius_v_--_03-21-2012.JPG",
  // },
  // {
  //   title: "RAV4",
  //   imageUrl: "https://trudelauto.com/en/image/rav4",
  // },
  // {
  //   title: "RAV4 Prime",
  //   imageUrl: "https://trudelauto.com/en/image/rav4-prime",
  // },
  // {
  //   title: "Sequoia",
  //   imageUrl: "https://trudelauto.com/en/image/sequoia",
  // },
  // {
  //   title: "Sienna",
  //   imageUrl: "https://trudelauto.com/en/image/sienna",
  // },
  // {
  //   title: "Solara",
  //   imageUrl: "https://trudelauto.com/en/image/solara",
  // },
  // {
  //   title: "Starlet",
  //   imageUrl: "https://trudelauto.com/en/image/starlet",
  // },
  // {
  //   title: "Supra",
  //   imageUrl: "https://trudelauto.com/en/image/supra",
  // },
  // {
  //   title: "T100",
  //   imageUrl: "https://trudelauto.com/en/image/t100",
  // },
  // {
  //   title: "Tacoma",
  //   imageUrl: "https://trudelauto.com/en/image/tacoma",
  // },
  // {
  //   title: "Tercel",
  //   imageUrl: "https://trudelauto.com/en/image/tercel",
  // },
  // {
  //   title: "Tundra",
  //   imageUrl: "https://trudelauto.com/en/image/tundra",
  // },
  // {
  //   title: "Van",
  //   imageUrl: "https://trudelauto.com/en/image/van",
  // },
  // {
  //   title: "Venza",
  //   imageUrl: "https://trudelauto.com/en/image/venza",
  // },

  // {
  //   title: "Yaris iA",
  //   imageUrl: "https://trudelauto.com/en/image/yaris-ia",
  // },
  // {
  //   title: "All Toyota Models",
  //   imageUrl: "https://trudelauto.com/en/image/all-toyota-models",
  // },
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

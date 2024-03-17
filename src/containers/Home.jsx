/* eslint-disable no-unused-vars */
import React from "react";
import Nav from "./Nav";
import HeroSection from "./Hero";
import Footer from "./Footer";
import BestProducts from "./Product";
import About from "./About";
const Home = () => {
  return (
    <div>
      <Nav />
      <HeroSection />
      {/* <CategorySection /> */}
      <BestProducts />
      <About />
      <Footer />
    </div>
  );
};

export default Home;

import { Navbar, Main, Product, Footer } from "../components";
import HotProduct from "../components/HotProduct";
import LastProduct from "../components/LastProduct";
import TopRatingProduct from "../components/TopRatingProduct";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <LastProduct />

      <HotProduct/>

      <TopRatingProduct/>
      <Footer />
    </>
  )
}

export default Home
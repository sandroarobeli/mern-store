import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

export default function CarouselSlideshow({ products }) {
  const navigate = useNavigate();

  return (
    <Carousel
      className="mb-4 bg-gray-100"
      onClickItem={(index) => {
        navigate(`/product/${products.find((product, i) => index === i).slug}`);
      }}
      showThumbs={false}
      autoPlay
      infiniteLoop
      useKeyboardArrows
      showStatus={false}
      ariaLabel="Featured products slideshow"
    >
      {products?.map((product) => (
        <div key={product.id}>
          <img
            src={product.image}
            alt={product.name}
            className="h-[350px] w-full object-contain"
          />
        </div>
      ))}
    </Carousel>
  );
}

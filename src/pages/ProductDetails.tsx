import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  return <h1>Product Details for Product ID: {id}</h1>;
};

export default ProductDetails;
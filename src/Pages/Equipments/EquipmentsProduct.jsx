import React, { useState } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import "../../css/Cares.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../Redux/Slice/CartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarsCustom from "../../Components/StarsCustom/StarsCustom";
import { getCookie } from "../../Routers/ProtectedRoute";

// EquipmentsProduct Component: Represents an individual equipment product card
const EquipmentsProduct = (product) => {
  const dispatch = useDispatch();
  const id = getCookie("id");

  // Function to add the product to the cart
  const addToCart = async () => {
    try {
      await dispatch(
        addItemToCart({
          id: id,
          items: [
            {
              id: product.id,
              name: product.name,
              pictureUrl: product.pictureUrl,
              category: product.category,
              price: product.price,
              quantity: 1,
            },
          ],
        })
      );

      toast.success("Product added Successfully"); // Success toast
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product"); // Error toast
    }
  };

  const [showDetails, setShowDetails] = useState(false); // State for showing details
  const toggleDetails = () => {
    setShowDetails(!showDetails); // Toggle details visibility
    window.scrollTo(0, 0); // Scroll to top
  };

  const [userRating, setUserRating] = useState(0); // State for user rating

  return (
    <div>
      <div className="container">
        <Row>
          <Col>
            <Card
              style={{
                height: "560px",
                width: "18rem",
              }}
              id="card-one"
            >
              <div className="card-body">
                <div className="icon">
                  <FontAwesomeIcon
                    icon={faCartPlus}
                    className="iconCarts"
                    onClick={addToCart}
                  />
                </div>
                <div className="img">
                  <img
                    whileHover={{ scale: 1.1 }}
                    src={product.pictureUrl}
                    alt="CaresImage"
                    className="cardImage"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="divider"></div>
                <h3>{product.name}</h3>

                <div className="text">
                  <p className="text__one">{product.price} EGP</p>
                  <p className="text__two">
                    <span className="text__two__span">
                      {Math.ceil(product.price - product.price * 0.3)}{" "}
                      <del>30%</del>
                    </span>
                  </p>
                </div>

                <div className="star">
                  <StarsCustom
                    totalStars={5}
                    initialRating={userRating}
                    onChange={(rating) => setUserRating(rating)}
                  />
                </div>
                <h4
                  style={{
                    paddingBottom: "10px",
                  }}
                  className="text__three"
                >
                  Available in:
                </h4>
                <div className="available__pharmacy h-7 w-full">
                  {product.pharmacies?.map((pharmacy, index) => (
                    <span className="text-sm text-center" key={index}>
                      ⚕ {pharmacy}
                    </span>
                  ))}
                </div>
                {/* Add the button to toggle details */}
                <Link to={`/product/${product.id}`}>
                  <button
                    whileHover={{ scale: 1.1 }}
                    onClick={toggleDetails}
                    className="showDetails sm:w-30 sm:h-8 sm:text-sm"
                  >
                    {" "}
                    Show Details{" "}
                  </button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EquipmentsProduct;

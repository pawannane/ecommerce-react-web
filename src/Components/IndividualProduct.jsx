import React from 'react'
import {NotificationContainer} from 'react-notifications';
const IndividualProduct = ({individualProduct, addToCart}) => {
    // console.log(individualProduct)
    const handleAddToCart = () => {
      addToCart(individualProduct);
    }

  return (
    <div>
            <div className="product">
                <div className="product-img">
                    <img src={individualProduct.url} alt="product-img" />
                </div>
                <div className="product-text title">{individualProduct.title}</div>
                <div className="product-text description">{individualProduct.description}</div>
                <div className="product-text price">₹ {individualProduct.price}</div>
                <div className="btn btn-danger btn-md cart-btn" onClick={handleAddToCart}>ADD TO CART</div>
                <NotificationContainer />
            </div>
    </div>
  )
}

export default IndividualProduct
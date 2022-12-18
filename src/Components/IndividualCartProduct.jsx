import React from 'react'
import Icon from 'react-icons-kit'
import { plus, minus } from 'react-icons-kit/feather'
import { auth, fs } from '../Config/Config'
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const IndividualCartProduct = ({ cartProduct, cartProductIncrease, cartProductDecrease }) => {
  const handleProductDecrease = () => {
    cartProductDecrease(cartProduct)
  }

  const handleProductIncrease = () => {
    cartProductIncrease(cartProduct);
  }

  const handleCartProductDelete = () => {
    auth.onAuthStateChanged(user => {
      if(user){
        fs.collection('Cart ' + user.uid).doc(cartProduct.ID).delete().then(()=>{
          console.log("Successfully deleted!")
        })
        NotificationManager.error(`Your ${cartProduct.title} has been deleted from Add to Cart Successfully!`, 'Product Deleted!')
      }
    })
  }

  return (
    <div className='product'>
      <div className="product-img">
        <img src={cartProduct.url} alt="product-img" />
      </div>
      <div className="product-text title">{cartProduct.title}</div>
      <div className="product-text description">{cartProduct.description}</div>
      <div className="product-text price">₹ {cartProduct.price}</div>
      <span>Quantity</span>
      <div className="product-text quantity-box">
        <div className="action-btns minus" onClick={handleProductDecrease}>
          <Icon icon={minus} size={20} />
        </div>
        <div>{cartProduct.qty}</div>
        <div className="action-btns plus" onClick={handleProductIncrease}>
          <Icon icon={plus} size={20} />
        </div>
      </div>
      <div className="product-text cart-price">₹ {cartProduct.TotalProductPrice}</div>
      <div className="btn btn-danger btn-md cart-btn" onClick={handleCartProductDelete}>DELETE</div>
      <NotificationContainer />
    </div>
  )
}

export default IndividualCartProduct
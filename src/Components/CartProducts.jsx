import React from 'react'
import IndividualCartProduct from './IndividualCartProduct'

const CartProducts = ({cartProducts, cartProductIncrease, cartProductDecrease}) => {
    // console.table(cartProducts)
  return (
    cartProducts.map((cartProduct) => (
        <IndividualCartProduct key={cartProduct.ID} cartProduct={cartProduct} cartProductIncrease={cartProductIncrease} cartProductDecrease={cartProductDecrease} />
    ))
  )
}

export default CartProducts
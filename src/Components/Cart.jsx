import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";
import Navbar from "./Navbar";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "./Modal";

const Cart = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);

    // show modal state
    const [showModal, setShowModal] = useState(false)

    const triggerModal = () => {
        setShowModal(true)
    }

    // hide modal
    const hideModal = () => {
        setShowModal(false)
    }
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    // getting current user function
    const GetCurrentUser = () => {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    fs.collection("users")
                        .doc(user.uid)
                        .get()
                        .then((snapshot) => {
                            setUser(snapshot.data().FullName);
                        });
                } else {
                    setUser(null);
                }
            });
        }, []);
        return user;
    };
    const user = GetCurrentUser();

    // state of cart products
    const [cartProducts, setCartProducts] = useState([]);

    // getting cart products from firestore collection and updating the state
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
                    const newCartProduct = snapshot.docs.map((doc) => ({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProduct);
                });
            } else {
                console.log("User is not signed in to retrieve cart");
            }
        });
    }, []);

    // state of totalProducts
    const [totalProducts, setTotalProducts] = useState(0);
    // getting cart products
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                });
            }
        });
    }, []);

    // global varibale
    let Product;

    // cart product increase function
    const cartProductIncrease = (cartProduct) => {
        // console.log(cartProduct)
        Product = cartProduct;
        Product.qty = Product.qty + 1;
        Product.TotalProductPrice = Product.qty * Product.price;

        //update in database
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection("Cart " + user.uid)
                    .doc(cartProduct.ID)
                    .update(Product)
                    .then(() => {
                        console.log("Increment added!!");
                    });
            }
        });
    };

    const cartProductDecrease = (cartProduct) => {
        Product = cartProduct;
        if (Product.qty > 1) {
            Product.qty = Product.qty - 1;
            Product.TotalProductPrice = Product.qty * Product.price;

            //update in database
            auth.onAuthStateChanged((user) => {
                if (user) {
                    fs.collection("Cart " + user.uid)
                        .doc(cartProduct.ID)
                        .update(Product)
                        .then(() => {
                            console.log("Decrement added!!");
                        });
                }
            });
        }
    };
    // console.table(cartProducts)

    // getting the qty from cartProducts in separate arrays
    const qty = cartProducts.map((cartProduct) => {
        return cartProduct.qty;
    });

    // reducing the qty in a single value
    const reducerOfQty = (accumulator, currentValue) =>
        accumulator + currentValue;
    const totalQty = qty.reduce(reducerOfQty, 0);
    // console.log(totalQty)

    // getting the total price from cartProducts in separate array
    const price = cartProducts.map((cartProduct) => {
        return cartProduct.TotalProductPrice;
    });

    const reducerOfPrice = (accumulator, currentValue) =>
        accumulator + currentValue;
    const totalPrice = price.reduce(reducerOfPrice, 0);
    // console.log(totalPrice)

    // charging payment
    const handleToken = async (token) => {
        // console.table(token)
        const cart = { name: "All Products", totalPrice };
        const response = await axios.post('http://localhost:8080/checkout', {
            token,
            cart,
        });
        console.warn(response)
        let {status} = response.data;
        if(status === 'success'){
            navigate('/');
            toast.success('Your order has been placed successfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined
            })

            const uid = auth.currentUser.uid;
            const carts = await fs.collection('Cart ' + uid).get();
            for (const snap of carts.docs) {
                fs.collection('Cart ' + uid).doc(snap.id).delete()
            }
        }
        else{
            alert('Something went wrong on checkout')
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="loader">
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                    />
                </div>
            ) : (
                <>
                    <Navbar user={user} totalProducts={totalProducts} />
                    <br />
                    {cartProducts.length > 0 && (
                        <div className="container-fluid">
                            <h1 className="text-center">Cart</h1>
                            <div className="products-box cart">
                                <CartProducts
                                    cartProducts={cartProducts}
                                    cartProductIncrease={cartProductIncrease}
                                    cartProductDecrease={cartProductDecrease}
                                />
                            </div>
                            <div className="summary-box">
                                <h5>Cart Summary</h5>
                                <br />
                                <div>
                                    Total No. of Products: <span>{totalQty}</span>
                                </div>
                                <div>
                                    Total Price to Pay: <span>??? {totalPrice}</span>
                                </div>
                                <br />
                                <StripeCheckout
                                    stripeKey="pk_test_51MHLVESArcYCAO09kF6fQxdpzaX1qZt2MDNT8FMEu6NYQSOsgU64fTRpY9Idz40dGuvtpLpXiNPKv8EbTQej0wRP00CAmukoWz"
                                    token={handleToken}
                                    billingAddress
                                    shippingAddress
                                    name="All Products"
                                    amount={totalPrice * 100}
                                />
                                <ToastContainer />
                                <h6 className="text-center" style={{marginTop: "7px"}}>OR</h6>
                                <button className="btn btn-secondary btn-md" onClick={() => triggerModal()} >Cash on Delivery</button>
                            </div>
                        </div>
                    )}
                    {cartProducts.length < 1 && (
                        <div className="container-fluid">No products to show</div>
                    )}

                    {showModal === true && (
                        <Modal totalPrice={totalPrice} totalQty={totalQty} hideModal={hideModal} />
                    )}
                </>
            )}
        </>
    );
};

export default Cart;

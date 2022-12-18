import React, { useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { auth, fs } from '../Config/Config';
import CartProducts from './CartProducts';
import Navbar from './Navbar'

const Cart = () => {

    const [isLoading, setIsLoading] = useState(true);

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
    const [cartProducts, setCartProducts] = useState([])

    // getting cart products from firestore collection and updating the state
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot => {
                    const newCartProduct = snapshot.docs.map((doc) => ({
                        ID: doc.id,
                        ...doc.data(),
                    }))
                    setCartProducts(newCartProduct)
                })
            }
            else {
                console.log('User is not signed in to retrieve cart')
            }
        })

    }, [])

    // global varibale
    let Product

    // cart product increase function
    const cartProductIncrease = (cartProduct) => {
        // console.log(cartProduct)
        Product = cartProduct
        Product.qty =  Product.qty + 1
        Product.TotalProductPrice = Product.qty * Product.price

        //update in database
        auth.onAuthStateChanged((user) => {
            if(user){
                fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
                    console.log("Increment added!!")
                })
            }
        })
    }

    const cartProductDecrease = (cartProduct) => {
        Product = cartProduct
        if(Product.qty > 1){
            Product.qty =  Product.qty - 1
            Product.TotalProductPrice = Product.qty * Product.price
            
            //update in database
            auth.onAuthStateChanged((user) => {
                if(user){
                    fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
                        console.log("Decrement added!!")
                    })
                }
            })
        }

    }
    // console.table(cartProducts)

    return (
        <>{
            isLoading ? (
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
            ) :
                (<>
                    <Navbar user={user} />
                    <br />
                    {cartProducts.length > 0 && (
                        <div className="container-fluid">
                            <h1 className='text-center'>Cart</h1>
                            <div className="products-box">
                                <CartProducts cartProducts={cartProducts} cartProductIncrease={cartProductIncrease} cartProductDecrease={cartProductDecrease} />
                            </div>
                        </div>
                    )}
                    {cartProducts.length < 1 && (
                        <div className="container-fluid">No products to show</div>
                    )}
                </>)
        }</>
    )
}

export default Cart
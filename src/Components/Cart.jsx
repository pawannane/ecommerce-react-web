import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config';
import CartProducts from './CartProducts';
import Navbar from './Navbar'

const Cart = () => {

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
        if(user){
            fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                const newCartProduct = snapshot.docs.map((doc)=>({
                    ID: doc.id,
                    ...doc.data(),
                }))
                setCartProducts(newCartProduct)
            })
        }
        else{
            console.log('User is not signed in to retrieve cart')
        }
      })
    
    }, [])

    // console.table(cartProducts)

    return (
        <>
            <Navbar user={user} />
            <br />
            {cartProducts.length > 0 && (
                <div className="container-fluid">
                    <h1 className='text-center'>Cart</h1>
                    <div className="products-box">
                        <CartProducts cartProducts={cartProducts} />
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className="container-fluid">No products to show</div>
            )}
        </>
    )
}

export default Cart
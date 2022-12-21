import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { auth, fs } from "../Config/Config";
import Navbar from "./Navbar";
import Products from "./Products";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

  // getting current user uid
  const GetUserUid = () => {
    const [uid, setUid] = useState(null)
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if(user){
          setUid(user.uid);
        }
      })
    
    }, [])
    return uid;
  }
  const uid = GetUserUid();

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
  // console.log(user)

  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState([])

  // getting products 
  const getProducts = async () => {
    const products = await fs.collection('Products').get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data
      })
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray)
      }
    }
  }

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0)
  // getting cart products
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user){
        fs.collection('Cart ' + user.uid).onSnapshot(snapshot =>{
          const qty = snapshot.docs.length;
          setTotalProducts(qty)
        })
      }
    })
  }, [])
  // console.log(totalProducts)
  
  const navigate = useNavigate();
  let Product;

  useEffect(() => {
    getProducts();

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const addToCart = (product) => {
    if(uid !== null){
      // console.table(product)
      Product = product
      Product['qty'] = 1
      Product['TotalProductPrice'] = Product['qty'] * Product.price
      fs.collection('Cart ' + uid).doc(product.ID).set(Product).then(()=>{
        // console.log("Successfully added to cart!!")
        toast.success(`Your ${product.title} has been added to your cart Successfully!`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined
            })
      })
    }
    else{
      navigate('/login')
    }
  }

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
        <div>
          <Navbar user={user} totalProducts={totalProducts} />
          <br />
          {products.length > 0 && (
            <div className="container-fluid">
              <h1 className="text-center">Products</h1>
              <div className="products-box">
                <Products products={products} addToCart={addToCart}/>
                <ToastContainer />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

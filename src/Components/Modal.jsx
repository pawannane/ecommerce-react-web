import React from 'react'
import { useState } from 'react'
import { auth, fs } from '../Config/Config'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({totalPrice, totalQty, hideModal}) => {
    const [cell, setCell] = useState(null)
    const [residentialAddress, setResidentialAddress] = useState('')
    const [cartQty] = useState(totalPrice)
    const [cartPrice] = useState(totalQty)

    const navigate = useNavigate()

    const handleCashOnDelivery = async(e) => {
        e.preventDefault();
        // console.log(cell, residentialAddress, cartQty, cartPrice)
        const uid = auth.currentUser.uid;
        const userData = await fs.collection('users').doc(uid).get();
        await fs.collection('Buyer-Personal-Info').add({
            Name: userData.data().FullName,
            Email: userData.data().Email,
            CellNo: cell,
            ResidentialAddress: residentialAddress,
            CartPrice: cartPrice,
            CartQty: cartQty
        })
        const cartData = await fs.collection('Cart ' + uid).get();
        for (var snap of cartData.docs) {
            var data = snap.data();
            data.ID = snap.id;
            await fs.collection('Buyer-Cart ' + uid).add(data);
            await fs.collection('Cart ' + uid).doc(snap.id).delete();
        }
        hideModal()
        navigate('/')
        toast.success('Your order has been placed successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined
        })
    }

    const handleCloseModal = () => {
        hideModal();
    }

  return (
    <div className='shade-area'>
        <div className="modal-container">
            <form className="form-group" onSubmit={handleCashOnDelivery}>
                <input type="number" className='form-control' placeholder='Cell No' required onChange={(e) => setCell(e.target.value)} value={cell}/>
                <br />
                <input type="text" className='form-control' placeholder='Residentail Address' required onChange={(e) => setResidentialAddress(e.target.value)} value={residentialAddress}/>
                <br />
                <label>Total Quantity</label>
                <input type="text" className='form-control' readOnly value={cartQty}/>
                <br />
                <label>Total Price</label>
                <input type="text" className='form-control' readOnly value={cartPrice}/>
                <br />
                <button type="submit" className='btn btn-success btn-md'>Submit</button>
            </form>
            <div className="delete-icon" onClick={handleCloseModal}>x</div>
            <ToastContainer />
        </div>
    </div>
  )
}

export default Modal
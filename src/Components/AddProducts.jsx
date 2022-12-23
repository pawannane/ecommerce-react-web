import React, { useRef, useState } from 'react'
import { fs, storage } from '../Config/Config'

const AddProducts = () => {
    const [successMsg, setSuccessMsg] = useState('')
    const [uploadError, setUploadError] = useState('')
    const [imageError, setImageError] = useState('')

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)

    const file = useRef();

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG']

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile)
                setImageError('')
            }
            else {
                setImage(null);
                setImageError('Please select a valid image file type (png or jpg)')
            }
        }
        else {
            console.log("Please select your file")
            setUploadError("Please select your file")
        }
    }

    const handleAddProduct = (e) => {
        e.preventDefault()
        // console.log(title, description, price);
        // console.log(category)
        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(progress);
        }, error => setUploadError(error.message), () => {
            storage.ref('product-images').child(image.name).getDownloadURL().then(url => {
                fs.collection('Products').add({
                    title,
                    description,
                    category,
                    price: Number(price),
                    url
                }).then(() => {
                    setSuccessMsg("Product Added Successfully")
                    setTitle('')
                    setDescription('')
                    setPrice('')
                    file.current.value = ''
                    setImageError('')
                    setUploadError('')
                    setTimeout(() => {
                        setSuccessMsg('')
                    }, 2000);
                }).catch(error => { setUploadError(error.message) })
            })
        })
    }

    return (
        <div className='container'>
            <br />
            <br />
            <h1>Add Products</h1>
            <hr />
            {
                successMsg && <>
                    <br />
                    <div className="success-msg">{successMsg}</div>
                    <br />
                </>
            }
            <form className='form-group' autoComplete='off' onSubmit={handleAddProduct}>
                <label>Product Title</label>
                <input type="text" className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} required />
                <br />
                <label>Product Description</label>
                <input type="text" className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} required />
                <br />
                <label>Product Price</label>
                <input type="number" className='form-control' value={price} onChange={(e) => setPrice(e.target.value)} required />
                <br />
                <label>Product Category</label>
                <select className='form-control' placeholder='Select Product Category' value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Electronic Devices">Electronic Devices</option>
                    <option value="Mobile Accessories" selected>Mobile Accessories </option>
                    <option value="TV & Home Appliances">TV & Home Appliances</option>
                    <option value="Sports & outdoors">Sports & outdoors</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Watches, bags & Jewellery">Watches, bags & Jewellery</option>
                    <option value="Groceries">Groceries</option>
                </select>
                <br />
                <label>Upload Product Image</label>
                <input type="file" ref={file} className='form-control' onChange={handleProductImg} required />
                <br />
                {
                    imageError && <>
                        <br />
                        <div className="error-msg">{imageError}</div>
                    </>
                }
                <br />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type='submit' className="btn btn-success btn-md">SUBMIT</button>
                </div>
            </form>
            {
                uploadError && <>
                    <br />
                    <div className="error-msg">{uploadError}</div>
                </>
            }
        </div>
    )
}

export default AddProducts
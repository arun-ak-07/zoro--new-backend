const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const Product = require('../model/productModel')


const getUser = async (req, res) => {
    try {
        const getUs = await User.find()
        // console.log(getUs)
        res.json(getUs)
    }
    catch (error) {
        res.json({ message: error.message })
        console.log(error)
    }
}

const editUser = async (req, res) => {
    try {
        // const {userID} = req.params
        const { username, userID, email } = req.body
        const updateUser = await User.findByIdAndUpdate(userID, { username, email }, { new: true })
        res.json(updateUser)
        console.log(updateUser)
    }
    catch (err) {
        console.log(err)
    }
}
const editUserEmail = async (req, res) => {
    try {
        const { userID, email } = req.body
        const updateUser = await User.findByIdAndUpdate(userID, { email }, { new: true })
        res.json(updateUser)
        console.log(updateUser)
    }
    catch (err) {
        console.log(err)
    }
}

const userRegister = async (req, res) => {
    try {
        const { username, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, email, password: hashedPassword })
        await user.save()
        res.status(201).json("User registered successfully")
    } catch (error) {
        res.status(400).json({ message: error.message || "Registration Failed" })
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1hr" })


                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                     sameSite: 'None',
                    maxAge: 1000 * 60 * 60,
                })
                res.setHeader("Authorization", token)
                console.log(token, "requested token")
                
                res.status(200).json({ message: "Welcome user", token, user })


            }else {
                res.status(401).send("Invalid email or password")
            }
        
    }
    catch (error) {
        // Send the actual error message received from the catch block
        res.status(400).json({ message: error.message || "Login Failed" })
        console.log(error)
    }
}


// BAN USER

const banUser = async (req, res) => {
    try {
        const { userId, banned } = req.body;
        console.log(userId)
        // Find the user by ID
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const banUsers = await User.findByIdAndUpdate(userId, { bannedUser: banned }, { new: true })
        res.status(200).json({ message: 'User banned successfully', banUsers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ADD TO CART

const addToCart = async (req, res) => {
    try {
        const { id, userID, name, price, image, qty, size } = req.body;
        // console.log("userid", userID);
        const user = await User.findOne({ _id: userID });
        // console.log("user", user);
        const existingItem = user.cart.find(item => item.id === id && item.size === size);

        if (existingItem) {
            return res.status(400).json({ message: "already added" });
            // existingItem.qty += qty
        } else {
            user.cart.push({
                id,
                name,
                price,
                image,
                qty,
                size
            });
            await user.save();
            res.status(200).json({ message: "successfully added to cart", user });
        }
    } catch (error) {
        res.status(400).json({ message: "unable to add", error });
    }
};


const increeementQty = async (req, res) => {
    try {
        const { userID, cart } = req.body
        const { id } = req.params

        // console.log("first",userID,id)
        // console.log("cart",cart)
        const updatedCart = cart.map(data => {
            if (data.id === id) {
                data.qty
            }
            return data
        })

        // console.log("Updated Cart",updatedCart)
        // console.log("Quantity",ItemQty)
        await User.findByIdAndUpdate(userID, { cart: updatedCart })

        res.send({ success: "true" })
    }
    catch (err) {
        console.log(err)
    }
}

const removeCart = async (req, res) => {
    try {
        const { userID, size } = req.body;
        const { id } = req.params;
        // console.log("userid", userID);
        const user = await User.findOne({ _id: userID });
        // console.log("user", user);
        const existingItem = user.cart.find(item => item.id === id && item.size === size);

        if (existingItem) {

        }
        const users = await User.findByIdAndUpdate(
            userID,
            {
                $pull: {
                    cart: { id, size } 
                }
            },
            {
                new: true 
            }
        );

        if (users) {
            res.status(200).json({ message: "Product successfully removed from cart", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Unable to remove product from cart", error });
    }
};



const getCart = async (req, res) => {
    const userID = req.body.UserId
    try {
        const getCart = await User.findOne({ _id: userID })
        // console.log(getCart)
        res.json(getCart)
    }
    catch (err) {
        console.log(err)
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { id, userID, name, price, image } = req.body
        const user = await User.findOne({ _id: userID })
        // console.log("user",user)
        const existingItem = user.wishlist.find(item => item.id === id);

        if (existingItem) {
            return res.status(400).json({ message: "already added" })
        }
        else {
            user.wishlist.push({
                id, name, price, image
            })
            await user.save()
            res.status(200).json({ message: "successfully added to wishlist", user })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: 'unable to add', err })
    }
}

const removeWishlist = async (req, res) => {
    try {
        const { userID } = req.body;
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            userID,
            {
                $pull:
                {
                    wishlist: { id }
                }
            },
            {
                new: true
            }
        )
        // Check if the user exists and return the updated user object
        if (user) {
            res.status(200).json({ message: "Product successfully removed from wishlist", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        // Handle any errors that occur during the removal process
        console.error(error);
        res.status(400).json({ message: "Unable to remove product from wishlist", error });
    }
}

const getWishlist = async (req, res) => {
    try {
        const userID = req.body.UserId
        const getWishlist = await User.findOne({ _id: userID })
        // console.log(getWishlist)
        res.json(getWishlist)
    }
    catch (err) {
        console.log(err)
    }
}

//     const{ name,price,image } = req.body
//     console.log("Request recieved :", req.body);

//     try{
//         const user = await User.findOne({_id : userId})
//         console.log("user",user)

//         if(!user) {
//             return res.status(400).json( { msg : "User not found" })
//         }

//         const existingUser = await user.cart.find(item => item.id === id)

//         if(existingUser) {

//         }
//         else{
//             user.cart.push({ name,price,image})
//         }
//         await user.save()
//     }
//     catch (error){
//         console.log(error)
//         res.status(500).json({ error : 'Internal server error'})
//     }
// }


const getCategoryWise = async (req, res) => {
    try {
        const category = req.params.category; // Extract category from request parameters

        // Assuming you have a model named Product representing your products
        // You need to import the Product model at the beginning of your file

        // Find products matching the category using a case-insensitive search
        const categoryProducts = await Product.find({
            category: { $regex: new RegExp(category, "i") }
        });

        res.json(categoryProducts); // Send the products as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// const searchItem = async (req,res) => {
//     try{

//     }
//     catch (err) {
//         console.log(err)
//     }
// }

const addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("UserId", userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { pincode, locality, address, city, state, landmark, addressType, phone } = req.body;
        const newAddress = { pincode, locality, address, city, state, landmark, addressType, phone };
        user.address.push(newAddress);
        await user.save(); // Save the updated user object to the database

        res.status(201).json({ message: 'Address added successfully', address: newAddress });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAddress = async (req, res) => {
    const userID = req.body.UserId
    try {
        const getAdd = await User.findOne({ _id: userID })
        // console.log(getCart)
        res.json(getAdd)
    }
    catch (err) {
        console.log(err)
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { index } = req.params;
        const { userId } = req.body;

        // Check if userId is provided and valid
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }

        // Find the user by userId
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the index is valid
        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }

        // Delete the address object at the specified index
        user.address.splice(index, 1);

        // Save the updated user object to the database
        await user.save();

        return res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { index } = req.params; // Get the index of the address to update from the request parameters
        const { pincode, locality, address, city, state, landmark, addressType, phone, userId } = req.body;
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the index is within the range of addresses
        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: 'Invalid address index' });
        }

        // Create a new address object with the updated values
        const updatedAddress = {
            pincode,
            locality,
            address,
            city,
            state,
            landmark,
            addressType,
            phone
        };

        // Update the address at the specified index
        user.address[index] = updatedAddress;

        // Save the updated user object to the database
        await user.save();
        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAddressByIndex = async (req, res) => {
    try {
        const { userId } = req.body;
        const { index } = req.params;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the index is within the range of addresses
        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: 'Invalid address index' });
        }

        // Get the address at the specified index
        const address = user.address[index];

        // Return the address
        res.status(200).json({ address });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const myOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const { cart } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Loop through each item in the cart
        cart.forEach(async (item) => {
            const { id, name, price, image, qty, size } = item;

            // Add the item to myOrders
            user.myOrders.push({ id, name, price, image, qty, size });

            // Find the index of the item in the cart and remove it
            const cartItemIndex = user.cart.findIndex(cartItem => cartItem.id === id && cartItem.size === size);
            if (cartItemIndex !== -1) {
                user.cart.splice(cartItemIndex, 1);
            }
        });

        // Save the updated user object after processing all cart items
        await user.save();

        res.status(200).json({ message: "Successfully added to myOrders and removed from cart" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteMyOrders = async (req, res) => {
    try {
        const { index } = req.params;
        const { userId } = req.body;

        // Check if userId is provided and valid
        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }

        // Find the user by userId
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the index is valid
        if (index < 0 || index >= user.myOrders.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }

        // Delete the address object at the specified index
        user.myOrders.splice(index, 1);

        // Save the updated user object to the database
        await user.save();

        return res.json({ message: 'MyOrders deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getUser, userRegister, loginUser, addToCart, getCart, removeCart,
    addToWishlist, getWishlist, removeWishlist, increeementQty, editUser, editUserEmail
    , getCategoryWise, addAddress, deleteAddress, getAddress, updateAddress, getAddressByIndex, banUser, myOrders, deleteMyOrders
}
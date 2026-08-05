const mongoose = require('mongoose');
const { User } = require('./src/models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/rammys-radiance');
  const user = await User.findOne();
  console.log('User ID:', user._id);
  console.log('Original Wishlist:', user.wishlist);
  
  const productId = '66f4b6d0e9196b0558bb9213'; // Some product ID
  const objId = new mongoose.Types.ObjectId(productId);
  
  const alreadyInWishlist = user.wishlist.some((id) => id.toString() === productId.toString());
  console.log('Already in wishlist:', alreadyInWishlist);
  
  const updateOp = alreadyInWishlist 
    ? { $pull: { wishlist: objId } }
    : { $push: { wishlist: objId } };
    
  const updatedUser = await User.findByIdAndUpdate(user._id, updateOp, { new: true });
  console.log('Updated Wishlist:', updatedUser.wishlist);
  
  await mongoose.disconnect();
}
test().catch(console.error);

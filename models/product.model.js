import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
    },
    image: {
      type: String, // store URL or file path
      required: [true, 'Please provide a product image'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

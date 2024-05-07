const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");

class productController {
  add_product = async (req, res) => {
    const { id } = req;

    // Create a formidable form instance
    const form = formidable({ multiples: true });

    // Parse the form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 500, { error: "Error parsing form data" });
        return;
      }

      // Extract fields and files
      let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        shopName,
        brand,
      } = fields;
      let { images } = files;

      // Check if name is provided
      name = name ? name.trim() : "";
      const slug = name.split(" ").join("-");

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        // Initialize an array for uploaded image URLs
        let allImageUrl = [];

        // Check if images is provided
        if (images) {
          // Check if images is an array
          if (Array.isArray(images)) {
            // Upload each image in the array
            for (let i = 0; i < images.length; i++) {
              const result = await cloudinary.uploader.upload(
                images[i].filepath,
                {
                  folder: "products",
                }
              );
              allImageUrl.push(result.url);
            }
          } else {
            // Upload a single image file
            const result = await cloudinary.uploader.upload(images.filepath, {
              folder: "products",
            });
            allImageUrl.push(result.url);
          }
        }

        // Create a new product
        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category: category.trim(),
          description: description.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          brand: brand.trim(),
        });

        responseReturn(res, 201, { message: "Product Added Successfully" });
      } catch (error) {
        // Handle any errors during the process
        responseReturn(res, 500, { error: error.message });
      }
    });
  };
  /// end method

  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {}
  };

  // End Method
  product_update = async (req, res) => {
    let { name, description, stock, price, discount, brand, productId } =
      req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");

    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        stock,
        price,
        discount,
        brand,
        productId,
        slug,
      });
      const product = await productModel.findById(productId);
      responseReturn(res, 200, {
        product,
        message: "Product Updated Successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, field, files) => {
      console.log(field);
      console.log(files);
    });
  };
  // End Method
}

module.exports = new productController();

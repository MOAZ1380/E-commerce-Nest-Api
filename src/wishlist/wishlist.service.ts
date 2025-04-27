import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/product/entities/product.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}


  /**
   * * Adds a product to the user's wishlist.
   * @param product 
   * @param req 
   * @returns 
   */
  async create(product: string, req: Request) {
    
    const productObjectId = new Types.ObjectId(product);
    
    const existingProduct = await this.ProductModel.findById(productObjectId).exec();
    if (!existingProduct) {
      throw new BadRequestException('Product not found');
    }

    const userId = req['InfUser']._id as UserDocument;
    const user = await this.UserModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isProductInWishlist = user.wishlist.some((item) => item.equals(productObjectId));
    if (isProductInWishlist) {
      throw new BadRequestException('Product already in wishlist');
    }

    const wishlist = await this.UserModel.findByIdAndUpdate(
      user._id,
      { $push: { wishlist: productObjectId } },
      { new: true }
    ).populate('wishlist');

    if (!wishlist) {
      throw new BadRequestException('Error adding product to wishlist');
    }

    return { message: "Product added to wishlist" };
  } 


  /**
   * Fetches all products in the user's wishlist.
   * @param req 
   * @returns 
  */
  async findAll(req: Request) {
    const userId = req['InfUser']._id as UserDocument;
    const user = await this.UserModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const wishlist = await this.UserModel.findById(user._id).populate('wishlist').exec();
    if (!wishlist) {
      throw new BadRequestException('Error fetching wishlist');
    }
    console.log(wishlist);
    
    return wishlist.wishlist

  }

  /**
   * Removes a product from the user's wishlist.
   * @param productId 
   * @param req 
   * @returns 
  */
  async remove(productId: string, req: Request) {
    const user = req['InfUser']._id as UserDocument;
    const productObjectId = new Types.ObjectId(productId);
    await this.UserModel.findByIdAndUpdate(
      user._id,
      { $pull: { wishlist: productObjectId } },
      { new: true }
    ).populate('wishlist').exec()

    return { message: "Product removed from wishlist" };
  }

}

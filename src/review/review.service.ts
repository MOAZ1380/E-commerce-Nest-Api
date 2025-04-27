import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { Product, ProductDocument } from 'src/product/entities/product.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
   ) {}


  /**
    * Create a new review for a product
    * @param createReviewDto - The review data to create
    * @param productId - The ID of the product to review
    * @param req - The request object containing user information
    * @returns The created review and a success message
  */
  async create(createReviewDto: CreateReviewDto, productId: string , req: Request) {
    const existingProduct = await this.ProductModel.findById(productId);
    if (!existingProduct) {
      throw new BadRequestException('Product not found');
    }

    const userId = req['InfUser']._id as UserDocument;
    const user = await this.UserModel.findById(userId).exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const newReview = await this.ReviewModel.create({
      ...createReviewDto,
      userId: user._id,
      productId: existingProduct._id,
    });
    if (!newReview) {
      throw new BadRequestException('Error creating review');
    }
    const product = await this.ProductModel.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview._id } },
      { new: true }
    );
    if (!product) {
      throw new BadRequestException('Error updating product with review');
    }
    await this.UserModel.findByIdAndUpdate(
      user._id,
      { $push: { reviews: newReview._id } },
      { new: true }
    );
    if (!user) {
      throw new BadRequestException('Error updating user with review');
    }

    return {"message": "Review created successfully", review: newReview };
  }

  /**
   * Find all reviews for a product
   * @param productId - The ID of the product to find reviews for
   * @returns An array of reviews for the product
  */
  async findAll(productId: string) { // error here
    console.log(productId);

    const productObjectId = new Types.ObjectId(productId);
    if (!productObjectId) {
      throw new BadRequestException('Invalid product ID format');
    }

    
    const product = await this.ProductModel.findById(productObjectId).exec();
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const reviews = await this.ReviewModel.find({ productId: productObjectId }).exec();

    if (!reviews || reviews.length === 0) {
      throw new BadRequestException('No reviews found for this product');
    }

    return reviews;
  }
  


  /**
   * Find a review by its ID
   * @param id - The ID of the review to find
   * @returns The review object if found, otherwise throws an error
   */
  async findOne(id: string) {
    const review = await this.ReviewModel.findById(id).exec();
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return review; 
  }

  /**
   * Update a review by its ID
   * @param id - The ID of the review to update
   * @param updateReviewDto - The updated review data
   * @returns The updated review object if found, otherwise throws an error
   */
  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.ReviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      { new: true }
    ).exec(); 

    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return review;
  }

  /**
   * Delete a review by its ID
   * @param id - The ID of the review to delete
   * @returns A success message if the review is deleted, otherwise throws an error
   */
  async remove(id: string) {
    const deleteReview = await this.ReviewModel.findByIdAndDelete(id)
      if (!deleteReview) {
        throw new BadRequestException('Review not found');
      }
      return { message: 'Review deleted successfully' };
    }
}

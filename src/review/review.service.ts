import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  
  async create(createReviewDto: CreateReviewDto, req: Request) {
    const existingProduct = await this.ProductModel.findById(createReviewDto.productId);
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
      createReviewDto.productId,
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

  findAll(productId: string) {
    console.log(productId);
    return this.ReviewModel.find({ productId: productId.toString() }). populate('userId').exec();
  }  

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;


@Schema({ timestamps: true })
export class Product {
    @Prop({
        required: [true, 'title is required'],
        trim: true,
        minlength: [3, 'title must be at least 3 characters'],
        maxlength: [50, 'title must be at most 50 characters'],
    })
    title: string;

    @Prop({
        lowercase: true,
        trim: true,
    })
    slug?: string;

    @Prop({
        required: [true, 'description is required'],
        trim: true,
        minlength: [3, 'description must be at least 3 characters'],
        maxlength: [500, 'description must be at most 500 characters'],
    })
    description: string;

    @Prop({
        required: [true, 'quantity is required']
    })
    quantity: number;

    @Prop({
        default: 0,
    })
    sold: number;

    @Prop({
        required: [true, 'price is required'],
        min: [0, 'price must be at least 0'],
        trim: true,
    })
    price: number;

    @Prop()
    priceAfterDiscount?: number;

    @Prop()
    colors?: string[];

    @Prop({
        required: [true, 'category is required']
    })
    imageCover: string;

    @Prop({ 
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'subcategory must belong to parent category']
    })
    category: Types.ObjectId;

    @Prop({
        type: [Types.ObjectId],
        ref: 'SubCategory', 
        required: [true, 'subcategory is required'] 
    })
    subcategory: Types.ObjectId[];

    @Prop({
        type: Types.ObjectId,
        ref: 'Brand'
    })
    brand?: Types.ObjectId;

    @Prop({
        min: 0,
        max: 5,
        default: 0
    })
    ratingsAverage?: number;

    @Prop({
        default: 0
    })
    ratingsQuantity?: number;   

    @Prop({
        type: [Types.ObjectId],
        ref: 'Review'
    })
    reviews?: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre<Product>('save', function (next) {
    this.slug = this.title.toLowerCase().replace(/ /g, '-');
    next();
});


ProductSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as Partial<Product>;
    if (update.title) {
      update.slug = update.title.toLowerCase().replace(/ /g, '-');
    }
    next();
});

ProductSchema.pre('findOne', function (next) {
    this.populate('category').populate('subcategory').populate('brand').populate('reviews');
    next();
});



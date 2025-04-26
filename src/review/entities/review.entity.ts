import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
    @Prop({
        required: [true, 'title is required'],
        trim: true,
        minlength: [3, 'title must be at least 3 characters'],
        maxlength: [100, 'title must be at most 100 characters'],
    })
    title: string;

    @Prop({
        required: [true, "ratings is required"],
        min: [1, "ratings must be at least 1"],
        max: [5, "ratings must be at most 5"],
    })
    ratings: number;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required'],
    })
    user: Types.ObjectId; 

    @Prop({
        type: Types.ObjectId,
        ref: 'Product',
        required: [true, 'product is required'],
    })
    Product: Types.ObjectId
     
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
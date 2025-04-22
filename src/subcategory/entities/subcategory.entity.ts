
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types  } from 'mongoose';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
    @Prop({ 
        required: [true, 'Name is required'],
        unique: [true, 'Name must be unique'],
        minLength : [2, 'Name must be at least 2 characters'],
        maxLength: [50, 'Name must be at most 50 characters'],
        trim: true
    })  
    name: string;

    @Prop()
    slug: string;

    @Prop({ 
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'subcategory must belong to parent category']
    })
    category: Types.ObjectId;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

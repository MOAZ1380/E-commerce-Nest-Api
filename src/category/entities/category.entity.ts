
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: [true, 'Name is required'] ,
            unique: [true, 'Name must be unique'],
            minLength : [3, 'Name must be at least 3 characters'],
            maxLength: [50, 'Name must be at most 50 characters'],
            trim: true
        })  
    name: string;

    @Prop({
        lowercase: true,
    })
    slug: string;

    @Prop()
    image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

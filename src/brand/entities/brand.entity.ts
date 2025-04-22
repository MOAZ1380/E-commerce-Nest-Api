import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ 
        required: [true, 'Name is required'] ,
        unique: [true, 'Name must be unique'],
        minLength : [3, 'Name must be at least 3 characters'],
        maxLength: [50, 'Name must be at most 50 characters'],
        trim: true
    })  
    name: string;

    @Prop()
    slug?: string;

    @Prop()
    image?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    next();
});
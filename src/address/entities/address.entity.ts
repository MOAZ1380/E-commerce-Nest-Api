import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
    @Prop({
        required: [true, 'Street is required'],
        trim: true,
        minLength: [2, 'Street must be at least 2 characters'],
        maxLength: [50, 'Street must be at most 50 characters']
    })
    street: string;

    @Prop({
        required: [true, 'City is required'],
        trim: true,
        minLength: [2, 'City must be at least 2 characters'],
        maxLength: [50, 'City must be at most 50 characters']
    })
    city: string;

    @Prop({
        required: [true, 'State is required'],
        trim: true,
        minLength: [2, 'State must be at least 2 characters'],
        maxLength: [50, 'State must be at most 50 characters']
    })
    state: string;

    @Prop({
        required: [true, 'Country is required'],
        trim: true,
        minLength: [2, 'Country must be at least 2 characters'],
        maxLength: [50, 'Country must be at most 50 characters']
    })
    country: string;

    @Prop({
        required: [true, 'Zip code is required'],
        trim: true,
        minLength: [5, 'Zip code must be at least 5 characters'],
        maxLength: [10, 'Zip code must be at most 10 characters']
    })
    zipCode: string;

}

export const AddressSchema = SchemaFactory.createForClass(Address);
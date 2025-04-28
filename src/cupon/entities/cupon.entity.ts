import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CuponDocument = HydratedDocument<Cupon>;

@Schema({ timestamps: true })
export class Cupon {
    @Prop({ 
        required: [true, 'Code is required'] ,
        unique: [true, 'Code must be unique'],
        trim: true
    })  
    code: string;

    @Prop({
        required: [true, 'expire is required'] ,
    })
    expire: Date;

    @Prop({
        required: [true, 'Discount is required'] ,
        min: [0, 'Discount must be at least 0'],
        max: [100, 'Discount must be at most 100']
    })
    discount: number;
}

export const CuponSchema = SchemaFactory.createForClass(Cupon);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
   @Prop({
    required: [true, 'Name is required'],
    trim: true,
    minLength: [3, 'Name must be at least 3 characters'],
    maxLength: [50, 'Name must be at most 50 characters']
   })
   name: string;

   @Prop()
   slug?: string;

   @Prop({
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
    trim: true,
    lowercase: true,
   })
   email: string;

   @Prop({
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters']
   })
    password: string;

    @Prop()
    phone?: string;

    @Prop()
    profileImg?: string;

    @Prop({
    required: [true, 'Role is required'],
    enum: ['admin', 'manager', 'user'],
    default: 'user'
    })
    role: string;

    @Prop({
      default: true,  
    })
    isActive: boolean;

    @Prop()
    passwordChangeAt: Date;

    @Prop()
    passwordResetCode: string;

    @Prop({ type: Date, default: null })
    passwordResetExpires: Date | null;;

    @Prop()
    passwordResetVerified: boolean;



}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);

  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }

  next();
});

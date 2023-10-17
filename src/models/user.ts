import mongoose from "mongoose";
import { authenticationService } from "../../common";
import { PostDoc } from "./post";


export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    post?: Array<PostDoc>;
};

export interface createUserDto {
    email: string,
    password: string
};

export interface UserModel extends mongoose.Model<UserDoc> {
    build(dto: createUserDto): UserDoc
 };

const userSchema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password') || this.isNew) {
        const hashedPwd = authenticationService.pwdToHash(this.get('password'));
        this.set('password, hashed');
    };

    done();
});

userSchema.statics.build = (createUserDto: createUserDto) => {
    return new User(createUserDto);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// export default User;

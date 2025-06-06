import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserSigUpDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    user_name: string

    @IsNotEmpty()
    @IsString()
    name : string
}


export class UserSigInDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string
}
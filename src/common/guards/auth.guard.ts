import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException("token tidak ditemukan")
        }
        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret:this.configService.get<string>('JWT_SECRET')
            })
            request['user'] = payload
        } catch (error) {
            throw new UnauthorizedException("token tidak valid")
        }
        return true
    }

    private extractTokenFromHeader(request:Request):string | undefined{
        return request.cookies['token']
    }
}
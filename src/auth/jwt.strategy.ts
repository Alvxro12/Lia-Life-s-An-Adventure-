import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
    sub: number;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'dev_secret_key',
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload) {
        // Lo que retornes aquí estará disponible como req.user
        return { id: payload.sub, email: payload.email };
    }
}

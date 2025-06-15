import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { configService } from '../config/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      try {
        const payload = this.jwtService.verify(token, {
          secret: configService.getJwtSecret(),
        });
        req['user'] = payload;
      } catch (error) {
        // Token is invalid or expired, but we'll continue the request
        // The protected routes will be handled by the JwtAuthGuard
      }
    }
    
    next();
  }
}
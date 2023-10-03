import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {User} from '../../../src/domain/entity/export';
import SqliteUser from '../../sqlite/userSqlite';

const repositoryUser = new SqliteUser();

class MiddlewareAuth{

    private static secretKey = 'cisbaftokensecurity';

    private static verifyToken(token: string): User | null {
        try {
          const decoded = jwt.verify(token, MiddlewareAuth.secretKey) as JwtPayload;
          
          const userId = decoded.userId as number;
          if (userId) {
            return repositoryUser.GetUser(userId);
          }
      
          return null;
        } catch (error) {
          return null;
        }
      };

    static setToken(userId: number) {
        const token = jwt.sign({userId: userId}, MiddlewareAuth.secretKey, { expiresIn: '15d' });
        return token;
    }
    
    static PermissionUser(req: Request, res: Response, next: NextFunction){
        const auth = req.headers.authorization;
        if(!auth){
            res.status(401);
            return res.json({"error": "Não autenticado!"})
        }
        const user = MiddlewareAuth.verifyToken(auth);
        if(!user){
            res.status(401);
            return res.json({"error": "Não autenticado!"})
        }
        req.user = user;
        next();
    }

} export default MiddlewareAuth;
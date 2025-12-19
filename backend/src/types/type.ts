import {UserEntity} from "../models/user.entity";
declare global{
    namespace Express{
        interface Request{
            userId?: UserEntity;
        }
    }
}
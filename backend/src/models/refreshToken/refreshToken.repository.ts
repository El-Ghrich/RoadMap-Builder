import { RefreshTokenEntity } from "./refreshToken.entity";
import { AppDataSource } from "../../config/dbConfig";
import { Repository } from "typeorm";


export class RefreshTokenRepository {

    private repo : Repository<RefreshTokenEntity>;
    constructor(){
        this.repo = AppDataSource.getDataSource().getRepository(RefreshTokenEntity);
    }
    async create(data: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
    const token = this.repo.create(data);
    return await this.repo.save(token);
  }
  async findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    return await this.repo.findOne({
      where: { tokenHash }
    });
  }
  async save(token: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    return await this.repo.save(token);
  }
}
import { User } from "@ports/domain/entities/user.entity";
import { RepositoryProtocol } from "./repository.protocol";

export interface UsersRepositoryProtocol extends RepositoryProtocol<User> {
    getByEmail(email: string): Promise<User | null>
}
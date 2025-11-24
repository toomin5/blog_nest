import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
export declare class LikesService {
    create(createLikeDto: CreateLikeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateLikeDto: UpdateLikeDto): string;
    remove(id: number): string;
}

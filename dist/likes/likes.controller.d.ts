import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    create(createLikeDto: CreateLikeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateLikeDto: UpdateLikeDto): string;
    remove(id: string): string;
}

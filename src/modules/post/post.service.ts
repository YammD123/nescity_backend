import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { MediaRepository } from '../media/media.repository';
import { MediaService } from '../media/media.service';
import { MediaDto } from '../media/media.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly repository: PostRepository,
    private readonly mediaService: MediaService,
  ) {}

  public async createPost(
    dto: CreatePostDto,
    user_id: string,
    files: Express.Multer.File[],
    base_url: string,
  ) {
    const post = await this.repository.createPost(dto.caption, user_id);
    if (!files || files.length == 0) {
      dto.media = [];
    } else {
      dto.media = files.map((file) => {
        const media = new MediaDto();
        media.url = `${base_url}/upload/${file.filename}`;
        media.type = file.mimetype;
        return media;
      });
    }
    if (dto.media && dto.media.length > 0) {
      const media = await this.mediaService.saveMediaToPost(post.id, dto.media);
    }
    return post;
  }

  public async getPostsMe(user_id: string) {
    const postsMe = await this.repository.getPostsMe(user_id);
    return {
      message: 'Data post ditemukan',
      data: postsMe,
    };
  }

  public async getAllPostsByDesc() {
    const posts = await this.repository.getAllPostsByDesc();
    return {
      message: 'Data post ditemukan',
      data: posts,
    };
  }

  public async getPostById(id: string) {
    const post = await this.repository.getPostById(id);
    return {
      message: 'Data post ditemukan',
      data: post,
    };
  }

  public async getUserIdPosts(id: string) {
    const posts = await this.repository.getUserIdPosts(id);
    return {
      message: 'Data post ditemukan',
      data: posts,
    };
  }

  public async deletePost(user_id: string, id: string) {
    const post = await this.repository.deletePost(user_id, id);
    return {
      message: 'Post berhasil dihapus',
      data: post,
    };
  }

  public async updatePostMedia(
    dto: UpdatePostDto,
    user_id: string,
    files: Express.Multer.File[],
    base_url: string,
  ) {
    const post = await this.repository.updatePost(
      user_id,
      dto.caption,
      dto.post_id,
    );
    const mediaToAdd: MediaDto[] = [];

    //jika ada media baru maka ini akan di jalankan
    if (files?.length) {
      for (const file of files) { //media bersifat array karena interceptor di post.controller.ts dia jamak ,oleh sebab itu ini dijalanakan dengan loop untuk membentuk object
        mediaToAdd.push({ //memasukan ke variable mediaToAdd yang bersifat array
          url: `${base_url}/upload/${file.filename}`,
          type: file.mimetype,
        });
      }
    }
    const mediaChanges = await this.mediaService.updateMediaForPost(
      dto.post_id,
      {
        mediaToAdd,
        mediaToDelete: dto.deletedMediaIds,
      },
    );

    return {
      message: 'Post berhasil diupdate',
      data: post,
      mediaChanges
    }
  }
}

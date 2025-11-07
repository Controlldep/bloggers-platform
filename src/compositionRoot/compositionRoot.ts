import "reflect-metadata";
import {Container} from "inversify";
import {UsersController} from "../users/handlers/usersController";
import {UsersService} from "../users/service/userService";
import {UsersRepository} from "../users/repositories/usersRepository";
import {BlogController} from "../blogs/controllers/blogController";
import {BlogsRepository} from "../blogs/repositories/blogsRepository";
import {BlogsService} from "../blogs/services/blogService";
import {BlogsQueryRepository} from "../blogs/repositories/blogsQueryRepository";
import {PostsController} from "../posts/controllers/postsController";
import {PostsService} from "../posts/service/postService";
import {PostRepository} from "../posts/repositories/postRepository";
import {PostQueryRepository} from "../posts/repositories/postQueryRepository";
import {AuthController} from "../authorization/controllers/authController";
import {AuthService} from "../authorization/service/authService";
import {EmailService} from "../authorization/service/emailService";
import {JwtService} from "../authorization/service/jwtService";
import {RefreshTokenRepositories} from "../authorization/repositories/refreshTokenRepositories";
import {SecurityDevicesController} from "../securityDevices/controllers/securityDevicesController";
import {SessionService} from "../securityDevices/service/sessionService";
import {SessionRepositories} from "../securityDevices/repositories/sessionRepositories";
import {CommentsController} from "../comments/controllers/commentsController";
import {CommentsService} from "../comments/service/commentsService";
import {CommentsQueryRepository} from "../comments/repositories/commentsQueryRepository";
import {CommentsRepository} from "../comments/repositories/commentsRepository";
import {LikeCommentsRepository} from "../commentsLike/repositories/likeCommentsRepository";
import {LikeService} from "../commentsLike/service/likeService";
import {PostLikeService} from "../postsLike/service/postLikeService";
import {PostLikeRepositories} from "../postsLike/repositories/postLikeRepositories";


export const container:Container = new Container();

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)

container.bind(BlogController).to(BlogController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostRepository).to(PostRepository)
container.bind(PostQueryRepository).to(PostQueryRepository)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)
container.bind(EmailService).to(EmailService)
container.bind(JwtService).to(JwtService)
container.bind(RefreshTokenRepositories).to(RefreshTokenRepositories)

container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(SessionService).to(SessionService)
container.bind(SessionRepositories).to(SessionRepositories)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)

container.bind(LikeService).to(LikeService)
container.bind(LikeCommentsRepository).to(LikeCommentsRepository)

container.bind(PostLikeService).to(PostLikeService)
container.bind(PostLikeRepositories).to(PostLikeRepositories)
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  hashDjangoPassword,
  verifyDjangoPassword,
} from '../common/django-password';
import {
  AdminUserUpdateDto,
  LoginDto,
  ProfileUpdateDto,
  RegisterDto,
} from './auth.dto';
import { serializeUser } from '../orders/order.serializer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
  ) {}

  private tokens(user: User) {
    const payload = { sub: user.id, user_id: user.id };
    return {
      access: this.jwt.sign(payload, { expiresIn: '4h' }),
      refresh: this.jwt.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({
      where: { username: dto.username },
    });
    if (exists) {
      throw new BadRequestException({ username: ['Ce nom existe déjà.'] });
    }

    const user = this.users.create({
      username: dto.username,
      password: hashDjangoPassword(dto.password),
      firstName: '',
      lastName: '',
      role: dto.role,
      phone: dto.phone ?? '',
      email: '',
      isVerified: false,
      isActive: true,
      isStaff: dto.role === 'admin',
      isSuperuser: false,
      dateJoined: new Date(),
      lastLogin: null,
    });
    await this.users.save(user);

    return {
      message: 'Utilisateur créé',
      user: serializeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: { username: dto.username },
    });
    if (!user || !verifyDjangoPassword(dto.password, user.password)) {
      throw new BadRequestException({
        non_field_errors: ['Identifiants invalides'],
      });
    }
    const { access, refresh } = this.tokens(user);
    return {
      user: serializeUser(user),
      access,
      refresh,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: number; user_id?: number }>(
        refreshToken,
      );
      const id = payload.user_id ?? payload.sub;
      const user = await this.users.findOne({ where: { id } });
      if (!user) throw new UnauthorizedException();
      return { access: this.jwt.sign({ sub: user.id, user_id: user.id }, { expiresIn: '4h' }) };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async listLivreurs() {
    const list = await this.users.find({
      where: { role: 'livreur' },
      order: { username: 'ASC' },
    });
    return list.map(serializeUser);
  }

  async listClients() {
    const list = await this.users.find({
      where: { role: 'client' },
      order: { username: 'ASC' },
    });
    return list.map(serializeUser);
  }

  async listUsers() {
    const list = await this.users.find({ order: { username: 'ASC' } });
    return list.map(serializeUser);
  }

  async updateUser(id: number, dto: AdminUserUpdateDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException();

    if (dto.username !== undefined && dto.username !== user.username) {
      const exists = await this.users.findOne({ where: { username: dto.username } });
      if (exists) {
        throw new BadRequestException({ username: ['Ce nom existe déjà.'] });
      }
      user.username = dto.username;
    }
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) {
      user.role = dto.role;
      user.isStaff = dto.role === 'admin';
    }
    if (dto.password) user.password = hashDjangoPassword(dto.password);

    await this.users.save(user);
    return serializeUser(user);
  }

  async deleteUser(id: number) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    try {
      await this.users.delete(id);
    } catch {
      throw new BadRequestException({
        detail: ['Impossible de supprimer ce compte (données liées).'],
      });
    }
    return { message: 'Utilisateur supprimé' };
  }

  async updateProfile(user: User, dto: ProfileUpdateDto) {
    if (dto.username !== undefined) user.username = dto.username;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.email !== undefined) user.email = dto.email;
    await this.users.save(user);
    return serializeUser(user);
  }
}

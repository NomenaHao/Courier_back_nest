import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_app_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ length: 150, unique: true })
  username: string;

  @Column({ name: 'first_name', length: 150, default: '' })
  firstName: string;

  @Column({ name: 'last_name', length: 150, default: '' })
  lastName: string;

  @Column({ length: 20, default: 'client' })
  role: string;

  @Column({ length: 30, default: '' })
  phone: string;

  @Column({ default: '' })
  email: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_staff', default: false })
  isStaff: boolean;

  @Column({ name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'date_joined', type: 'datetime' })
  dateJoined: Date;

  @Column({ name: 'last_login', type: 'datetime', nullable: true })
  lastLogin: Date | null;
}

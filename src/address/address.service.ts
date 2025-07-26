import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  create(createAddressDto: CreateAddressDto, user: User): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    return this.addressRepository.save(address);
  }

  findAllForUser(user: User): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOneForUser(id: number, user: User): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
    user: User,
  ): Promise<Address> {
    // This check ensures the user owns the address before attempting to update
    const address = await this.findOneForUser(id, user);

    const updatedAddress = Object.assign(address, updateAddressDto);

    return this.addressRepository.save(updatedAddress);
  }

  async remove(id: number, user: User): Promise<void> {
    // This will delete the address only if it belongs to the provided user
    const result = await this.addressRepository.delete({ id, user: { id: user.id } });

    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
  }
}
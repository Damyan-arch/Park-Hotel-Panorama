import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from './site-settings.entity';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

// These match the values the public site used to hardcode before this
// table existed, so the first read after deploy changes nothing visually.
const DEFAULT_SETTINGS = {
  phoneNumber: '+359 897 820 065',
  address: 'Tryavna, Bulgaria',
  restaurantHoursDays: 'Mon – Sun',
  restaurantHoursText: 'From 7:00 PM to 10:30 PM',
};

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings) private readonly settings: Repository<SiteSettings>,
  ) {}

  async get(): Promise<SiteSettings> {
    const [existing] = await this.settings.find({ take: 1 });
    if (existing) return existing;

    const created = this.settings.create(DEFAULT_SETTINGS);
    return this.settings.save(created);
  }

  async update(dto: UpdateSiteSettingsDto): Promise<SiteSettings> {
    const current = await this.get();
    Object.assign(current, dto);
    return this.settings.save(current);
  }
}

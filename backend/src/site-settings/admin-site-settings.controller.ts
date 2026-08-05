import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('admin/settings')
@UseGuards(AdminAuthGuard)
export class AdminSiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Patch()
  update(@Body() dto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(dto);
  }
}

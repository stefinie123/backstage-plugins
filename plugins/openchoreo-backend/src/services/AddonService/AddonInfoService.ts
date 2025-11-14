import { LoggerService } from '@backstage/backend-plugin-api';
import {
  OpenChoreoApiClient,
  AddonListResponse,
  AddonSchemaResponse,
} from '@openchoreo/backstage-plugin-api';

export class AddonInfoService {
  private logger: LoggerService;
  private baseUrl: string;

  constructor(logger: LoggerService, baseUrl: string) {
    this.logger = logger;
    this.baseUrl = baseUrl;
  }

  async fetchAddons(
    orgName: string,
    page: number = 1,
    pageSize: number = 100,
  ): Promise<AddonListResponse> {
    this.logger.debug(
      `Fetching addons for organization: ${orgName} (page: ${page}, pageSize: ${pageSize})`,
    );

    try {
      const client = new OpenChoreoApiClient(this.baseUrl, '', this.logger);
      const response = await client.listAddons(orgName, page, pageSize);

      this.logger.debug(
        `Successfully fetched ${response.data.items.length} addons for org: ${orgName}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to fetch addons for org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async fetchAddonSchema(
    orgName: string,
    addonName: string,
  ): Promise<AddonSchemaResponse> {
    this.logger.debug(
      `Fetching schema for addon: ${addonName} in org: ${orgName}`,
    );

    try {
      const client = new OpenChoreoApiClient(this.baseUrl, '', this.logger);
      const response = await client.getAddonSchema(orgName, addonName);

      this.logger.debug(
        `Successfully fetched schema for addon: ${addonName}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to fetch schema for addon ${addonName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }
}

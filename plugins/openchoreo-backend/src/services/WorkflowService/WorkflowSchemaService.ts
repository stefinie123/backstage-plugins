import { LoggerService } from '@backstage/backend-plugin-api';
import {
  OpenChoreoApiClient,
  WorkflowSchemaResponse,
} from '@openchoreo/backstage-plugin-api';

export class WorkflowSchemaService {
  private logger: LoggerService;
  private baseUrl: string;

  constructor(logger: LoggerService, baseUrl: string) {
    this.logger = logger;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch JSONSchema for a specific workflow
   */
  async fetchWorkflowSchema(
    orgName: string,
    workflowName: string,
  ): Promise<WorkflowSchemaResponse> {
    this.logger.debug(
      `Fetching schema for workflow: ${workflowName} in org: ${orgName}`,
    );

    try {
      const client = new OpenChoreoApiClient(this.baseUrl, '', this.logger);
      const workflowSchema = await client.workflowSchemaGet(
        { orgName, workflowName },
        undefined,
      );

      if (!workflowSchema.success) {
        throw new Error('Failed to fetch workflow schema');
      }

      this.logger.debug(
        `Successfully fetched schema for workflow: ${workflowName}`,
      );
      return workflowSchema;
    } catch (error) {
      this.logger.error(
        `Failed to fetch schema for workflow ${workflowName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }
}

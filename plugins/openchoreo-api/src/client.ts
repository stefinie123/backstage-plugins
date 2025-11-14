import { DefaultApiClient } from './api';
import {
  ModelsProject,
  ModelsOrganization,
  ModelsComponent,
  ModelsEnvironment,
  ModelsDataPlane,
  ModelsBuildTemplate,
  ModelsBuild,
  OpenChoreoApiResponse,
  OpenChoreoApiSingleResponse,
  BuildConfig,
  BindingResponse,
  DeploymentPipelineResponse,
  ModelsCompleteComponent,
  ModelsWorkload,
  ComponentType,
  ComponentTypeListItem,
  ComponentTypeListResponse,
  ComponentTypeSchemaResponse,
  BuildTemplateListResponse,
  BuildTemplateSchemaResponse,
  AddonListResponse,
  AddonSchemaResponse,
  WorkflowSchemaResponse,
  ComponentResource,
  ApplyResourceResponse,
} from './models';
import { LoggerService } from '@backstage/backend-plugin-api';

export class OpenChoreoApiClient {
  private client: DefaultApiClient;
  private token?: string;
  private logger?: LoggerService;

  constructor(baseUrl: string, token?: string, logger?: LoggerService) {
    this.token = token;
    this.logger = logger;
    this.client = new DefaultApiClient(baseUrl, {});
  }

  async getAllProjects(orgName: string): Promise<ModelsProject[]> {
    this.logger?.info(`Fetching projects for organization: ${orgName}`);

    try {
      const response = await this.client.projectsGet(
        { orgName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsProject> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const projects = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${projects.length} projects for org: ${orgName} (total: ${apiResponse.data.totalCount})`,
      );

      return projects;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch projects for org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async getAllOrganizations(): Promise<ModelsOrganization[]> {
    this.logger?.info('Fetching all organizations');

    try {
      const response = await this.client.organizationsGet(
        {},
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsOrganization> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const organizations = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${organizations.length} organizations (total: ${apiResponse.data.totalCount})`,
      );

      return organizations;
    } catch (error) {
      this.logger?.error(`Failed to fetch organizations: ${error}`);
      throw error;
    }
  }

  async getAllEnvironments(orgName: string): Promise<ModelsEnvironment[]> {
    this.logger?.info(`Fetching environments for organization: ${orgName}`);

    try {
      const response = await this.client.environmentsGet(
        { orgName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsEnvironment> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const environments = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${environments.length} environments for org: ${orgName} (total: ${apiResponse.data.totalCount})`,
      );

      return environments;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch environments for org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async getAllDataplanes(orgName: string): Promise<ModelsDataPlane[]> {
    this.logger?.info(`Fetching dataplanes for organization: ${orgName}`);

    try {
      const response = await this.client.dataplanesGet(
        { orgName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsDataPlane> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const dataplanes = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${dataplanes.length} dataplanes for org: ${orgName} (total: ${apiResponse.data.totalCount})`,
      );

      return dataplanes;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch dataplanes for org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async getAllComponents(
    orgName: string,
    projectName: string,
  ): Promise<ModelsComponent[]> {
    this.logger?.info(
      `Fetching components for project: ${projectName} in organization: ${orgName}`,
    );

    try {
      const response = await this.client.componentsGet(
        { orgName, projectName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsComponent> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const components = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${components.length} components for project: ${projectName} in org: ${orgName} (total: ${apiResponse.data.totalCount})`,
      );

      return components;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch components for project ${projectName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async createProject(
    orgName: string,
    projectData: {
      name: string;
      displayName?: string;
      description?: string;
      deploymentPipeline?: string;
    },
  ): Promise<ModelsProject> {
    this.logger?.info(
      `Creating project: ${projectData.name} in organization: ${orgName}`,
    );

    try {
      const response = await this.client.projectsPost(
        {
          orgName,
          name: projectData.name,
          displayName: projectData.displayName,
          description: projectData.description,
          deploymentPipeline: projectData.deploymentPipeline,
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<ModelsProject> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const project = apiResponse.data;
      this.logger?.info(
        `Successfully created project: ${project.name} in org: ${orgName}`,
      );

      return project;
    } catch (error) {
      this.logger?.error(
        `Failed to create project ${projectData.name} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async createComponent(
    orgName: string,
    projectName: string,
    componentData: {
      name: string;
      displayName?: string;
      description?: string;
      type: string;
      buildConfig?: BuildConfig;
    },
  ): Promise<ModelsComponent> {
    this.logger?.info(
      `Creating component: ${componentData.name} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.componentsPost(
        {
          orgName,
          projectName,
          name: componentData.name,
          displayName: componentData.displayName,
          description: componentData.description,
          type: componentData.type,
          buildConfig: componentData.buildConfig,
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<ModelsComponent> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const component = apiResponse.data;
      this.logger?.info(
        `Successfully created component: ${component.name} in project: ${projectName}, org: ${orgName}`,
      );

      return component;
    } catch (error) {
      this.logger?.error(
        `Failed to create component ${componentData.name} in project ${projectName}, org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async getAllBuildTemplates(orgName: string): Promise<ModelsBuildTemplate[]> {
    this.logger?.info(`Fetching build templates for organization: ${orgName}`);

    try {
      const response = await this.client.buildTemplatesGet(
        { orgName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsBuildTemplate> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const buildTemplates = apiResponse.data?.items || [];
      this.logger?.info(
        `Successfully fetched ${buildTemplates.length} build templates for org: ${orgName}`,
      );

      return buildTemplates;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch build templates for org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async getAllBuilds(
    orgName: string,
    projectName: string,
    componentName: string,
  ): Promise<ModelsBuild[]> {
    this.logger?.info(
      `Fetching builds for component: ${componentName} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.buildsGet(
        { orgName, projectName, componentName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<ModelsBuild> =
        await response.json();
      this.logger?.info(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      if (!apiResponse.data.items) {
        this.logger?.info(`No builds found for component: ${componentName}`);
        return [];
      }

      const builds = apiResponse.data.items;
      this.logger?.info(
        `Successfully fetched ${builds.length} builds for component: ${componentName} (total: ${apiResponse.data.totalCount})`,
      );

      return builds;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch builds for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async triggerBuild(
    orgName: string,
    projectName: string,
    componentName: string,
    commit?: string,
  ): Promise<ModelsBuild> {
    this.logger?.info(
      `Triggering build for component: ${componentName} in project: ${projectName}, organization: ${orgName}${
        commit ? ` with commit: ${commit}` : ''
      }`,
    );

    try {
      const response = await this.client.buildsPost(
        { orgName, projectName, componentName, commit },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<ModelsBuild> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      if (!apiResponse.data) {
        throw new Error('No build data returned');
      }

      this.logger?.info(
        `Successfully triggered build for component: ${componentName}, build name: ${apiResponse.data.name}`,
      );

      return apiResponse.data;
    } catch (error) {
      this.logger?.error(
        `Failed to trigger build for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async getComponent(
    orgName: string,
    projectName: string,
    componentName: string,
  ): Promise<ModelsCompleteComponent> {
    this.logger?.info(
      `Fetching component details for: ${componentName} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.componentGet({
        orgName,
        projectName,
        componentName,
      });

      const apiResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const component = apiResponse.data;
      this.logger?.info(
        `Successfully fetched component details for: ${componentName}`,
      );
      return component;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch component details for ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async getComponentBindings(
    orgName: string,
    projectName: string,
    componentName: string,
    environments?: string[],
  ): Promise<BindingResponse[]> {
    this.logger?.info(
      `Fetching bindings for component: ${componentName} in project: ${projectName}, organization: ${orgName}${
        environments?.length
          ? ` for environments: ${environments.join(', ')}`
          : ''
      }`,
    );

    try {
      const response = await this.client.bindingsGet(
        {
          orgName,
          projectName,
          componentName,
          environment: environments,
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<BindingResponse> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      // Extract bindings from paginated data structure
      const bindings = apiResponse.data?.items || [];

      this.logger?.info(
        `Successfully fetched ${bindings.length} bindings for component: ${componentName}`,
      );

      return bindings;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch bindings for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async getProjectDeploymentPipeline(
    orgName: string,
    projectName: string,
  ): Promise<DeploymentPipelineResponse> {
    this.logger?.info(
      `Fetching deployment pipeline for project: ${projectName} in organization: ${orgName}`,
    );

    try {
      const response = await this.client.projectDeploymentPipelineGet(
        { orgName, projectName },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<DeploymentPipelineResponse> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const deploymentPipeline = apiResponse.data;
      this.logger?.info(
        `Successfully fetched deployment pipeline: ${deploymentPipeline.name} for project: ${projectName} in org: ${orgName}`,
      );

      return deploymentPipeline;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch deployment pipeline for project ${projectName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  async promoteComponent(
    orgName: string,
    projectName: string,
    componentName: string,
    sourceEnvironment: string,
    targetEnvironment: string,
  ): Promise<BindingResponse[]> {
    this.logger?.info(
      `Promoting component: ${componentName} from ${sourceEnvironment} to ${targetEnvironment} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.componentPromotePost(
        {
          orgName,
          projectName,
          componentName,
          promoteComponentRequest: {
            sourceEnv: sourceEnvironment,
            targetEnv: targetEnvironment,
          },
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiResponse<BindingResponse> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      // Extract bindings from paginated data structure
      const bindings = apiResponse.data?.items || [];

      this.logger?.info(
        `Successfully promoted component: ${componentName} from ${sourceEnvironment} to ${targetEnvironment}. Returned ${bindings.length} bindings.`,
      );

      return bindings;
    } catch (error) {
      this.logger?.error(
        `Failed to promote component ${componentName} from ${sourceEnvironment} to ${targetEnvironment}: ${error}`,
      );
      throw error;
    }
  }

  async getWorkload(
    orgName: string,
    projectName: string,
    componentName: string,
  ): Promise<ModelsWorkload> {
    this.logger?.info(
      `Fetching workload for component: ${componentName} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.workloadGet(
        {
          orgName,
          projectName,
          componentName,
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<ModelsWorkload> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      if (!apiResponse.data) {
        throw new Error('No workload data returned');
      }

      this.logger?.info(
        `Successfully fetched workload for component: ${componentName}`,
      );
      return apiResponse.data;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch workload for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async updateWorkload(
    orgName: string,
    projectName: string,
    componentName: string,
    workloadSpec: ModelsWorkload,
  ): Promise<ModelsWorkload> {
    this.logger?.info(
      `Updating workload for component: ${componentName} in project: ${projectName}, organization: ${orgName}`,
    );

    try {
      const response = await this.client.workloadPost(
        {
          orgName,
          projectName,
          componentName,
          workloadSpec,
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<ModelsWorkload> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      if (!apiResponse.data) {
        throw new Error('No workload data returned');
      }

      this.logger?.info(
        `Successfully updated workload for component: ${componentName}`,
      );
      return apiResponse.data;
    } catch (error) {
      this.logger?.error(
        `Failed to update workload for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  async updateComponentBinding(
    orgName: string,
    projectName: string,
    componentName: string,
    bindingName: string,
    releaseState: 'Active' | 'Suspend' | 'Undeploy',
  ): Promise<BindingResponse> {
    this.logger?.info(
      `Updating binding: ${bindingName} for component: ${componentName} in project: ${projectName}, organization: ${orgName} to state: ${releaseState}`,
    );

    try {
      const response = await this.client.bindingPatch(
        {
          orgName,
          projectName,
          componentName,
          bindingName,
          updateBindingRequest: {
            releaseState,
          },
        },
        { token: this.token },
      );

      const apiResponse: OpenChoreoApiSingleResponse<BindingResponse> =
        await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(apiResponse)}`);

      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const binding = apiResponse.data;
      this.logger?.info(
        `Successfully updated binding: ${bindingName} to state: ${releaseState}`,
      );

      return binding;
    } catch (error) {
      this.logger?.error(
        `Failed to update binding ${bindingName} for component ${componentName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * List all Component Types
   *
   * Returns a list of all component types with minimal metadata (name, workloadType, createdAt).
   * To get the full schema for a component type, use getComponentTypeSchema() or getComponentTypeWithSchema().
   *
   * @param orgName - Organization name
   * @param page - Page number (optional, for pagination)
   * @param pageSize - Number of items per page (optional, for pagination)
   * @returns Promise resolving to ComponentTypeListResponse
   *
   * API Endpoint: GET /orgs/{orgName}/component-types
   */
  async listCTDs(
    orgName: string,
    page: number = 1,
    pageSize: number = 100,
  ): Promise<ComponentTypeListResponse> {
    this.logger?.info(
      `Fetching component type list for organization: ${orgName} (page: ${page}, pageSize: ${pageSize})`,
    );

    try {
      const response = await this.client.componentTypesGet(
        { orgName, page, pageSize },
        { token: this.token },
      );

      const componentTypeListResponse: ComponentTypeListResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(componentTypeListResponse)}`);

      if (!componentTypeListResponse.success) {
        throw new Error('API request was not successful');
      }

      this.logger?.info(
        `Successfully fetched ${componentTypeListResponse.data.items.length} component types for org: ${orgName} (total: ${componentTypeListResponse.data.totalCount})`,
      );
      return componentTypeListResponse;
    } catch (error) {
      this.logger?.error(`Failed to fetch component type list for org ${orgName}: ${error}`);
      throw error;
    }
  }

  /**
   * Get the JSONSchema for a specific Component Type
   *
   * Returns the input parameter schema for the specified component type.
   *
   * @param orgName - Organization name
   * @param ctdName - Component type name
   * @returns Promise resolving to ComponentTypeSchemaResponse
   *
   * API Endpoint: GET /orgs/{orgName}/component-types/{ctdName}/schema
   */
  async getCTDSchema(
    orgName: string,
    ctdName: string,
  ): Promise<ComponentTypeSchemaResponse> {
    this.logger?.debug(
      `Fetching schema for component type: ${ctdName} in org: ${orgName}`,
    );

    try {
      const response = await this.client.componentTypeSchemaGet(
        { orgName, ctdName },
        { token: this.token },
      );

      const schemaResponse: ComponentTypeSchemaResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(schemaResponse)}`);

      if (!schemaResponse.success) {
        throw new Error('API request was not successful');
      }

      this.logger?.debug(
        `Successfully fetched schema for component type: ${ctdName}`,
      );
      return schemaResponse;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch schema for component type ${ctdName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get a full Component Type object (metadata + schema)
   *
   * Uses the 2-call pattern to fetch complete component type details:
   * 1. List component types (returns ComponentTypeListItem[] with all metadata including allowedWorkflows)
   * 2. Get component type schema (input parameters)
   *
   * @param orgName - Organization name
   * @param componentTypeItem - Component type list item from list endpoint (contains all metadata)
   * @returns Promise resolving to complete ComponentType object
   */
  async getCTDWithSchema(
    orgName: string,
    componentTypeItem: ComponentTypeListItem,
  ): Promise<ComponentType> {
    this.logger?.debug(
      `Fetching schema for component type: ${componentTypeItem.name} in org: ${orgName}`,
    );

    try {
      // Fetch schema for the component type
      const schemaResponse = await this.getCTDSchema(orgName, componentTypeItem.name);

      // Combine metadata from list item + schema into full ComponentType object
      const fullComponentType: ComponentType = {
        metadata: componentTypeItem, // All metadata is already in the list item
        spec: {
          inputParametersSchema: schemaResponse.data,
        },
      };

      this.logger?.debug(
        `Successfully fetched complete component type: ${componentTypeItem.name}`,
      );
      return fullComponentType;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch complete component type ${componentTypeItem.name} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * List all build templates for a specific CTD
   *
   * Returns a list of build templates available for the specified CTD.
   *
   * @param orgName - Organization name
   * @param ctdName - CTD name
   * @returns Promise resolving to BuildTemplateListResponse
   *
   * API Endpoint: GET /api/v1/orgs/{orgName}/component-type-definitions/{ctdName}/build-templates
   */
  async listBuildTemplates(
    orgName: string,
    ctdName: string,
  ): Promise<BuildTemplateListResponse> {
    this.logger?.debug(
      `Fetching build templates for CTD: ${ctdName} in org: ${orgName}`,
    );

    try {
      // TODO: Replace with actual API call when endpoint is available
      // For now, return a static list of common build templates regardless of CTD
      // since the build template API is not ready yet
      const staticTemplates: BuildTemplateListResponse = {
        success: true,
        data: {
          items: [
            { name: 'dockerfile' },
            { name: 'nodejs' },
            { name: 'python' },
            { name: 'java-maven' },
            { name: 'java-gradle' },
            { name: 'go' },
          ],
        },
      };

      this.logger?.debug(
        `Returning ${staticTemplates.data.items.length} static build templates for CTD: ${ctdName}`,
      );
      return staticTemplates;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch build templates for CTD ${ctdName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * List all Addons for an organization
   *
   * Returns a paginated list of addons available for the organization.
   *
   * @param orgName - Organization name
   * @param page - Page number (default: 1)
   * @param pageSize - Number of items per page (default: 100)
   * @returns Promise resolving to AddonListResponse
   *
   * API Endpoint: GET /orgs/{orgName}/addons
   */
  async listAddons(
    orgName: string,
    page: number = 1,
    pageSize: number = 100,
  ): Promise<AddonListResponse> {
    this.logger?.info(
      `Fetching addon list for organization: ${orgName} (page: ${page}, pageSize: ${pageSize})`,
    );

    try {
      const response = await this.client.addonsGet(
        { orgName, page, pageSize },
        { token: this.token },
      );

      const addonListResponse: AddonListResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(addonListResponse)}`);

      if (!addonListResponse.success) {
        throw new Error('API request was not successful');
      }

      this.logger?.info(
        `Successfully fetched ${addonListResponse.data.items.length} addons for org: ${orgName} (total: ${addonListResponse.data.totalCount})`,
      );
      return addonListResponse;
    } catch (error) {
      this.logger?.error(`Failed to fetch addon list for org ${orgName}: ${error}`);
      throw error;
    }
  }

  /**
   * Get the JSONSchema for a specific Addon
   *
   * Returns the configuration parameter schema for the specified addon.
   *
   * @param orgName - Organization name
   * @param addonName - Addon name
   * @returns Promise resolving to AddonSchemaResponse
   *
   * API Endpoint: GET /orgs/{orgName}/addons/{addonName}/schema
   */
  async getAddonSchema(
    orgName: string,
    addonName: string,
  ): Promise<AddonSchemaResponse> {
    this.logger?.debug(
      `Fetching schema for addon: ${addonName} in org: ${orgName}`,
    );

    try {
      const response = await this.client.addonSchemaGet(
        { orgName, addonName },
        { token: this.token },
      );

      const schemaResponse: AddonSchemaResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(schemaResponse)}`);

      if (!schemaResponse.success) {
        throw new Error('API request was not successful');
      }

      this.logger?.debug(
        `Successfully fetched schema for addon: ${addonName}`,
      );
      return schemaResponse;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch schema for addon ${addonName} in org ${orgName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get the JSONSchema for a specific Workflow
   *
   * Returns the parameter schema for the specified workflow.
   *
   * @param orgName - Organization name
   * @param workflowName - Workflow name
   * @returns Promise resolving to WorkflowSchemaResponse
   *
   * API Endpoint: GET /orgs/{orgName}/workflows/{workflowName}/schema
   */
  async workflowSchemaGet(
    request: { orgName: string; workflowName: string },
    options?: { token?: string },
  ): Promise<WorkflowSchemaResponse> {
    this.logger?.debug(
      `Fetching schema for workflow: ${request.workflowName} in org: ${request.orgName}`,
    );

    try {
      const response = await this.client.workflowSchemaGet(
        request,
        { token: options?.token || this.token },
      );

      const schemaResponse: WorkflowSchemaResponse = await response.json();
      this.logger?.debug(`API response: ${JSON.stringify(schemaResponse)}`);

      if (!schemaResponse.success) {
        throw new Error('API request was not successful');
      }

      this.logger?.debug(
        `Successfully fetched schema for workflow: ${request.workflowName}`,
      );
      return schemaResponse;
    } catch (error) {
      this.logger?.error(
        `Failed to fetch schema for workflow ${request.workflowName} in org ${request.orgName}: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Apply a component resource (similar to kubectl apply)
   *
   * Creates or updates a component based on the provided resource definition.
   * The resource should conform to the ComponentResource interface.
   * The organization is extracted from the resource metadata namespace.
   *
   * @param resource - Component resource definition (ComponentResource)
   * @returns Promise resolving to ApplyResourceResponse
   *
   * API Endpoint: POST /api/v1/apply
   */
  async applyResource(
    resource: ComponentResource,
  ): Promise<ApplyResourceResponse> {
    this.logger?.info(
      `Applying component resource: ${resource.metadata.name} in organization: ${resource.metadata.namespace}`,
    );

    try {
      const response = await this.client.applyResource(
        { resource },
        { token: this.token },
      );

      this.logger?.info(`API response status: ${response.status} ${response.statusText}`);
      this.logger?.info(`API response URL: ${response.url}`);

      // Log response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      this.logger?.debug(`API response headers: ${JSON.stringify(headers)}`);

      // Get the raw response text first
      const responseText = await response.text();
      this.logger?.debug(`API raw response body: ${responseText}`);

      // Try to parse as JSON
      let applyResponse: ApplyResourceResponse;
      try {
        applyResponse = JSON.parse(responseText);
      } catch (parseError) {
        this.logger?.error(`Failed to parse JSON response: ${parseError}`);
        this.logger?.error(`Raw response was: ${responseText}`);
        throw new Error(`Invalid JSON response from API: ${parseError}`);
      }

      this.logger?.info(`API parsed response: ${JSON.stringify(applyResponse)}`);

      if (!applyResponse.success) {
        throw new Error(
          `API request was not successful: ${applyResponse.message || 'Unknown error'}`,
        );
      }

      this.logger?.info(
        `Successfully applied component resource: ${resource.metadata.name}`,
      );
      return applyResponse;
    } catch (error) {
      this.logger?.error(
        `Failed to apply component resource ${resource.metadata.name} in org ${resource.metadata.namespace}: ${error}`,
      );
      throw error;
    }
  }
}

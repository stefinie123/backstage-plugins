import { JSONSchema7 } from 'json-schema';

/**
 * Build template list item - minimal metadata returned from list endpoint
 * @public
 */
export interface BuildTemplate {
  /**
   * Name of the build template
   */
  name: string;
}

/**
 * Response from the build templates list API
 * GET /api/v1/orgs/{orgName}/component-type-definitions/{ctdName}/build-templates
 * @public
 */
export interface BuildTemplateListResponse {
  /**
   * Success status
   */
  success: boolean;
  /**
   * Response data
   */
  data: {
    /**
     * Array of build templates
     */
    items: BuildTemplate[];
  };
}

/**
 * Response from the build template schema API
 * GET /api/v1/orgs/{orgName}/component-type-definitions/{ctdName}/build-templates/{templateName}/schema
 * @public
 */
export interface BuildTemplateSchemaResponse {
  /**
   * Success status
   */
  success: boolean;
  /**
   * JSONSchema7 for the build template's parameters
   */
  data: JSONSchema7;
}

// ========== DEPRECATED - For backward compatibility ==========

/**
 * @deprecated Build template parameter - use JSONSchema7 from BuildTemplateSchemaResponse instead
 * @public
 */
export interface BuildTemplateParameter {
  /**
   * Parameter name
   */
  name: string;
  /**
   * Parameter display name
   */
  displayName?: string;
  /**
   * Parameter description
   */
  description?: string;
  /**
   * Parameter type (e.g., string, number, boolean)
   */
  type?: string;
  /**
   * Default value for the parameter
   */
  default?: string;
  /**
   * Whether the parameter is required
   */
  required?: boolean;
}

/**
 * @deprecated Build template response - use BuildTemplateListItem instead
 * @public
 */
export interface ModelsBuildTemplate {
  /**
   * Name of the build template
   */
  name: string;
  /**
   * Build template parameters
   */
  parameters?: BuildTemplateParameter[];
  /**
   * Creation timestamp (ISO 8601 format)
   */
  createdAt: string;
}

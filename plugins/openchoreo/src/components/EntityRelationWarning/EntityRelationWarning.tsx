import { Entity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  useEntity,
} from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/esm/useAsync';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Kinds owned by the platform layer that regular users typically can't
 * access — hidden from the "related entity missing" warning to avoid noise
 * users can't act on.
 */
const PLATFORM_KINDS = new Set([
  'workflowplane',
  'clusterworkflowplane',
  'componenttype',
  'resourcetype',
  'clustercomponenttype',
  'clusterresourcetype',
  'traittype',
  'clustertraittype',
  'workflow',
  'componentworkflow',
  'observabilityplane',
  'clusterobservabilityplane',
  'dataplane',
  'clusterdataplane',
  'deploymentpipeline',
  'environment',
]);

async function getRelationWarnings(entity: Entity, catalogApi: CatalogApi) {
  const entityRefRelations = entity.relations?.map(
    relation => relation.targetRef,
  );
  if (
    !entityRefRelations ||
    entityRefRelations?.length < 1 ||
    entityRefRelations.length > 1000
  ) {
    return [];
  }

  const relatedEntities = await catalogApi.getEntitiesByRefs({
    entityRefs: entityRefRelations,
    fields: ['kind', 'metadata.name', 'metadata.namespace'],
  });

  return entityRefRelations.filter(
    (_, index) => relatedEntities.items[index] === undefined,
  );
}

/**
 * Warns when an entity has relations that can't be resolved in the catalog.
 * Only the count is shown, never the refs: an unresolved relation may just be
 * one the viewer lacks permission to see, so naming it would leak restricted
 * resources. Platform kinds are dropped as noise users can't act on.
 *
 * Wraps its own `<Grid item xs={12}>` so it can return null (all unresolved
 * refs platform-owned) without leaving a gap in the caller's Grid.
 */
export function EntityRelationWarning() {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value } = useAsync(async () => {
    return getRelationWarnings(entity, catalogApi);
  }, [entity, catalogApi]);

  if (error) {
    return (
      <Grid item xs={12}>
        <Box mb={1}>
          <ResponseErrorPanel error={error} />
        </Box>
      </Grid>
    );
  }

  if (loading || !value || value.length === 0) {
    return null;
  }

  const userFacingCount = value.filter(ref => {
    const kind = ref.split(':')[0].toLowerCase();
    return !PLATFORM_KINDS.has(kind);
  }).length;

  if (userFacingCount === 0) {
    return null;
  }

  const noun = userFacingCount === 1 ? 'related entity' : 'related entities';

  return (
    <Grid item xs={12}>
      <Alert severity="warning">
        {userFacingCount} {noun} could not be found in the catalog. This may be
        because they don't exist or you may not have permission to view them.
      </Alert>
    </Grid>
  );
}

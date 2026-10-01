import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef, EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { EntityRelationWarning } from './EntityRelationWarning';

const getEntitiesByRefs = jest.fn();

function renderWarning(entity: Entity) {
  return renderInTestApp(
    <TestApiProvider apis={[[catalogApiRef, { getEntitiesByRefs }]]}>
      <EntityProvider entity={entity}>
        <EntityRelationWarning />
      </EntityProvider>
    </TestApiProvider>,
  );
}

const entityWithRelations: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: { name: 'openchoreo-users', namespace: 'default' },
  relations: [
    { type: 'ownerOf', targetRef: 'component:default/ad' },
    { type: 'ownerOf', targetRef: 'component:default/payment' },
    { type: 'ownerOf', targetRef: 'system:default/gcp-microservice-demo' },
  ],
};

describe('EntityRelationWarning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('warns without disclosing the names of unresolved related entities', async () => {
    // All three refs resolve to `undefined` — missing or permission-hidden.
    getEntitiesByRefs.mockResolvedValue({
      items: [undefined, undefined, undefined],
    });

    await renderWarning(entityWithRelations);

    expect(
      await screen.findByText(/could not be found in the catalog/i),
    ).toBeInTheDocument();

    // Refs must never render — they'd disclose restricted resources.
    expect(screen.queryByText(/component:default\/ad/)).toBeNull();
    expect(screen.queryByText(/component:default\/payment/)).toBeNull();
    expect(
      screen.queryByText(/system:default\/gcp-microservice-demo/),
    ).toBeNull();
    expect(screen.queryByText(/Show details/i)).toBeNull();
  });

  it('reports the count of unresolved user-facing relations', async () => {
    getEntitiesByRefs.mockResolvedValue({
      items: [undefined, undefined, undefined],
    });

    await renderWarning(entityWithRelations);

    expect(
      await screen.findByText(/3 related entities could not be found/i),
    ).toBeInTheDocument();
  });

  it('renders nothing when all relations resolve', async () => {
    getEntitiesByRefs.mockResolvedValue({
      items: [{ kind: 'Component' }, { kind: 'Component' }, { kind: 'System' }],
    });

    const { container } = await renderWarning(entityWithRelations);

    expect(container.textContent).not.toMatch(/could not be found/i);
  });

  it('ignores unresolved platform-owned relations', async () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'openchoreo-users', namespace: 'default' },
      relations: [
        { type: 'ownerOf', targetRef: 'dataplane:default/default' },
        { type: 'ownerOf', targetRef: 'environment:default/dev' },
      ],
    };
    getEntitiesByRefs.mockResolvedValue({ items: [undefined, undefined] });

    const { container } = await renderWarning(entity);

    expect(container.textContent).not.toMatch(/could not be found/i);
  });
});

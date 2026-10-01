import Grid from '@material-ui/core/Grid';
import type { EntityContentLayoutProps } from '@backstage/plugin-catalog-react/alpha';
import { EntityWarningStrip } from './EntityWarningStrip';
import { ForeignCardsSection } from './foreignCards';

/**
 * Overview layout for Group/User, which OC doesn't otherwise customize.
 * Without it they use Backstage's `DefaultEntityContentLayout`, whose
 * `EntityRelationWarning` lists unresolved relation refs and so leaks the
 * names of resources the viewer may lack permission to see. This swaps in
 * OC's `EntityWarningStrip` (count only); all cards are non-OC and flow
 * through `ForeignCardsSection`, so the page is otherwise unchanged.
 */
export default function CoreEntityOverviewLayout({
  cards,
}: EntityContentLayoutProps) {
  return (
    <Grid container spacing={3} alignItems="stretch">
      <EntityWarningStrip />
      <ForeignCardsSection cards={cards} />
    </Grid>
  );
}

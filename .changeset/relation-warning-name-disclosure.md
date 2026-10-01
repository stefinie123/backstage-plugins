---
'@openchoreo/backstage-plugin': patch
---

Stop the "related entities not found" warning from disclosing the names of
entities the viewer cannot see. A relation the user lacks permission to view is
indistinguishable, client-side, from a genuinely dangling one, so echoing those
refs leaked the existence and names of restricted resources. The warning now
reports only a count and never lists the unresolved refs.

Group and User entity pages previously fell back to Backstage's default
overview layout, which renders the upstream relation warning that lists exact
refs. They now use an OpenChoreo overview layout with the hardened warning
strip, so the leak is closed there too.

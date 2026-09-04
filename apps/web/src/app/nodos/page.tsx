import { AppShell } from '@/components/app-shell';
import { DataPanel } from '@/components/data-panel';
import { NodeTable } from '@/components/node-table';

export default function NodesPage() {
  return (
    <AppShell title="Nodes" subtitle="Register, search, filter, and inspect IoT nodes.">
      <DataPanel title="Node inventory" subtitle="Edit, disable, delete, and credential rotation are API-backed TODO actions.">
        <NodeTable />
      </DataPanel>
    </AppShell>
  );
}

"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { nodes } from '@/lib/demo-data';
import { StatusBadge } from './status-badge';

export function NodeTable() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const filtered = useMemo(() => {
    return nodes.filter((node) => {
      const matchesQuery = [node.nodeId, node.name, node.site, node.area].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'ALL' || node.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes" className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/50" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/50">
          <option value="ALL">All statuses</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Node</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Firmware</th>
              <th className="px-4 py-3">Sensors</th>
              <th className="px-4 py-3">Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((node) => (
              <tr key={node.nodeId} className="bg-slate-950/30">
                <td className="px-4 py-4">
                  <Link href={`/nodos/${node.nodeId}/`} className="font-medium text-sky-200 hover:text-sky-100">{node.nodeId}</Link>
                  <div className="text-xs text-slate-500">{node.name}</div>
                </td>
                <td className="px-4 py-4 text-slate-300">{node.site} / {node.area}</td>
                <td className="px-4 py-4"><StatusBadge value={node.status} /></td>
                <td className="px-4 py-4 text-slate-300">{node.firmware}</td>
                <td className="px-4 py-4 text-slate-300">{node.sensors}</td>
                <td className="px-4 py-4 text-slate-400">{node.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">No nodes match the current filters.</div> : null}
    </div>
  );
}

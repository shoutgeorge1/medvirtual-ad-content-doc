import type { ConceptStatus } from '../types/concept';
import './StatusBadge.css';

const STATUS_CLASS: Record<ConceptStatus, string> = {
  Draft: 'status-draft',
  'In Progress': 'status-in-progress',
  'Ready For Review': 'status-ready-for-review',
  Approved: 'status-approved',
  Exported: 'status-exported',
};

interface StatusBadgeProps {
  status: ConceptStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const slug = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`status-badge status-${slug} ${STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}

import { ROLES, ANGLES, STATUSES } from '../utils/constants';
import './FilterBar.css';

export interface Filters {
  role: string;
  angle: string;
  status: string;
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  total: number;
  filtered: number;
}

export function FilterBar({ filters, onChange, total, filtered }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__counts">
        Showing <strong>{filtered}</strong> of <strong>{total}</strong> concepts
      </div>
      <div className="filter-bar__controls">
        <input
          type="search"
          className="filter-bar__search"
          placeholder="Search concepts..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
        />
        <select
          value={filters.role}
          onChange={(e) => update('role', e.target.value)}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select
          value={filters.angle}
          onChange={(e) => update('angle', e.target.value)}
          aria-label="Filter by angle"
        >
          <option value="all">All angles</option>
          {ANGLES.map((angle) => (
            <option key={angle} value={angle}>
              {angle}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

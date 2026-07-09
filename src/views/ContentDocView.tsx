import { useMemo } from 'react';
import { ContentDoc } from '../components/ContentDoc';
import { FilterBar, type Filters } from '../components/FilterBar';
import { useConcepts } from '../context/ConceptsContext';
import { filterConcepts } from '../utils/concepts';
import { useState } from 'react';
import './ContentDocView.css';

const DEFAULT_FILTERS: Filters = {
  role: 'all',
  angle: 'all',
  status: 'all',
  search: '',
};

export function ContentDocView() {
  const { concepts } = useConcepts();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterConcepts(concepts, filters),
    [concepts, filters]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-doc-view">
      <div className="content-doc-view__toolbar no-print">
        <div>
          <h2>Content Document</h2>
          <p>Manager review layout · print or share as PDF</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handlePrint}>
          Print / Save PDF
        </button>
      </div>

      <div className="no-print">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={concepts.length}
          filtered={filtered.length}
        />
      </div>

      <ContentDoc concepts={filtered} />
    </div>
  );
}

import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdPreview, AdPreviewScaler } from '../components/AdPreview';
import { ExportSizeToggle } from '../components/ExportButton';
import { FilterBar, type Filters } from '../components/FilterBar';
import { useConcepts } from '../context/ConceptsContext';
import type { Concept, ExportSize } from '../types/concept';
import { filterConcepts } from '../utils/concepts';
import { exportAdToPng, exportAllAds } from '../utils/export';
import './ExportView.css';

const DEFAULT_FILTERS: Filters = {
  role: 'all',
  angle: 'all',
  status: 'all',
  search: '',
};

export function ExportView() {
  const { concepts, saveConcept } = useConcepts();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [size, setSize] = useState<ExportSize>('1080x1350');
  const [selectedId, setSelectedId] = useState(
    searchParams.get('concept') ?? concepts[0]?.concept_id ?? ''
  );
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = useMemo(
    () => filterConcepts(concepts, filters),
    [concepts, filters]
  );

  const selected = useMemo(
    () => concepts.find((c) => c.concept_id === selectedId) ?? filtered[0],
    [concepts, selectedId, filtered]
  );

  const setRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      exportRefs.current.set(id, el);
    } else {
      exportRefs.current.delete(id);
    }
  }, []);

  const handleSingleExport = async () => {
    if (!selected) return;
    const el = exportRefs.current.get(selected.concept_id);
    if (!el) return;

    setExporting(true);
    setProgress(`Exporting ${selected.file_name}…`);
    try {
      await exportAdToPng(el, selected.file_name, size);
      saveConcept({ ...selected, status: 'Exported' });
      setProgress('Export complete.');
    } catch {
      setProgress('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    const targets = filtered
      .map((c) => ({
        concept: c,
        element: exportRefs.current.get(c.concept_id),
      }))
      .filter((t): t is { concept: Concept; element: HTMLDivElement } => !!t.element);

    if (targets.length === 0) return;

    setExporting(true);
    try {
      await exportAllAds(
        targets.map((t) => ({ element: t.element, fileName: t.concept.file_name })),
        size,
        (current, total) => setProgress(`Exporting ${current} of ${total}…`)
      );
      targets.forEach((t) => saveConcept({ ...t.concept, status: 'Exported' }));
      setProgress(`Exported ${targets.length} creatives.`);
    } catch {
      setProgress('Batch export failed. Try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-view">
      <div className="export-view__header">
        <div>
          <h2>Export Creatives</h2>
          <p>Download PNG files at Meta ad sizes · text rendered as overlays</p>
        </div>
        <ExportSizeToggle size={size} onChange={setSize} />
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        total={concepts.length}
        filtered={filtered.length}
      />

      <div className="export-view__layout">
        <div className="export-view__sidebar">
          <label className="export-view__label">Select concept</label>
          <select
            className="export-view__select"
            value={selected?.concept_id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {filtered.map((c) => (
              <option key={c.concept_id} value={c.concept_id}>
                {c.file_name} — {c.on_image_hook}
              </option>
            ))}
          </select>

          <div className="export-view__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSingleExport}
              disabled={exporting || !selected}
            >
              {exporting ? 'Exporting…' : 'Export Selected'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportAll}
              disabled={exporting || filtered.length === 0}
            >
              Export All ({filtered.length})
            </button>
          </div>

          {progress && <p className="export-view__progress">{progress}</p>}
        </div>

        <div className="export-view__preview">
          {selected && (
            <>
              <h3>{selected.file_name}</h3>
              <AdPreviewScaler concept={selected} size={size} maxWidth={320} />
            </>
          )}
        </div>
      </div>

      {/* Hidden full-size renders for export */}
      <div className="export-view__staging" aria-hidden="true">
        {filtered.map((concept) => (
          <AdPreview
            key={concept.concept_id}
            ref={(el) => setRef(concept.concept_id, el)}
            concept={concept}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

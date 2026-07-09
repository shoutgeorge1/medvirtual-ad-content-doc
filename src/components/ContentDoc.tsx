import { Link } from 'react-router-dom';
import type { Concept } from '../types/concept';
import { AdPreviewScaler } from './AdPreview';
import { StatusBadge } from './StatusBadge';
import './ContentDoc.css';

interface ContentDocProps {
  concepts: Concept[];
}

export function ContentDoc({ concepts }: ContentDocProps) {
  return (
    <div className="content-doc">
      <header className="content-doc__header">
        <h1>MedVirtual — Facebook Ad Content Doc</h1>
        <p className="content-doc__subtitle">
          National Meta static ads · {concepts.length} starter concepts · one per message angle
        </p>
        <p className="content-doc__date">
          Generated {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </header>

      {concepts.map((concept, index) => (
        <section key={concept.concept_id} className="content-doc__block">
          <div className="content-doc__block-header">
            <div>
              <span className="content-doc__number">Concept {index + 1}</span>
              <h2 className="content-doc__title">
                {concept.file_name}
              </h2>
              <p className="content-doc__meta-line">
                <strong>{concept.role}</strong> · {concept.angle}
              </p>
            </div>
            <StatusBadge status={concept.status} />
          </div>

          <p className="content-doc__edit no-print">
            <Link to={`/editor/${concept.concept_id}`}>Edit concept →</Link>
          </p>

          <div className="content-doc__grid">
            <div className="content-doc__preview-col">
              <AdPreviewScaler concept={concept} maxWidth={260} />
              <p className="content-doc__file-name">{concept.file_name}</p>
            </div>

            <div className="content-doc__copy-col">
              <div className="content-doc__field">
                <label>Source URL</label>
                <a href={concept.source_url} target="_blank" rel="noreferrer">
                  {concept.source_url}
                </a>
              </div>

              <div className="content-doc__field">
                <label>On-Image Hook</label>
                <p>{concept.on_image_hook}</p>
              </div>

              <div className="content-doc__field">
                <label>Bullets</label>
                <ul>
                  <li>{concept.bullet_1}</li>
                  <li>{concept.bullet_2}</li>
                  <li>{concept.bullet_3}</li>
                </ul>
              </div>

              <div className="content-doc__field">
                <label>CTA</label>
                <p>{concept.cta}</p>
              </div>

              <div className="content-doc__field">
                <label>Primary Text</label>
                <p>{concept.primary_text}</p>
              </div>

              <div className="content-doc__field">
                <label>Headline</label>
                <p>{concept.headline}</p>
              </div>

              {concept.description && (
                <div className="content-doc__field">
                  <label>Description</label>
                  <p>{concept.description}</p>
                </div>
              )}

              {concept.notes && (
                <div className="content-doc__field content-doc__field--notes">
                  <label>Notes</label>
                  <p>{concept.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

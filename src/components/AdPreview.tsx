import { forwardRef } from 'react';
import type { Concept, ExportSize } from '../types/concept';
import '../templates/AdTemplate.css';

interface AdPreviewProps {
  concept: Concept;
  size?: ExportSize;
  className?: string;
}

export const AdPreview = forwardRef<HTMLDivElement, AdPreviewProps>(
  function AdPreview({ concept, size = '1080x1350', className = '' }, ref) {
    const isSquare = size === '1080x1080';
    const bullets = [concept.bullet_1, concept.bullet_2, concept.bullet_3].filter(
      Boolean
    );

    return (
      <div
        ref={ref}
        className={`ad-preview ${isSquare ? 'ad-preview--square' : 'ad-preview--vertical'} ${className}`}
        data-export-size={size}
      >
        <div
          className="ad-preview__bg"
          style={{ backgroundImage: `url(${concept.image_file})` }}
        />
        <div className="ad-preview__overlay" />
        <div className="ad-preview__brand">MedVirtual</div>
        <div className="ad-preview__content">
          <div className="ad-preview__panel">
            <h2 className="ad-preview__hook">{concept.on_image_hook}</h2>
            <ul className="ad-preview__bullets">
              {bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
            <div className="ad-preview__cta-wrap">
              <span className="ad-preview__cta">{concept.cta}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

interface AdPreviewScalerProps {
  concept: Concept;
  size?: ExportSize;
  maxWidth?: number;
}

export function AdPreviewScaler({
  concept,
  size = '1080x1350',
  maxWidth = 280,
}: AdPreviewScalerProps) {
  const isSquare = size === '1080x1080';
  const fullWidth = 1080;
  const fullHeight = isSquare ? 1080 : 1350;
  const scale = maxWidth / fullWidth;

  return (
    <div
      className="ad-preview-scaler"
      style={{ width: maxWidth, height: fullHeight * scale }}
    >
      <div
        className="ad-preview-scaler__inner"
        style={{ transform: `scale(${scale})`, width: fullWidth, height: fullHeight }}
      >
        <AdPreview concept={concept} size={size} />
      </div>
    </div>
  );
}

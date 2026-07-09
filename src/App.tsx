import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ConceptsProvider } from './context/ConceptsContext';
import { ContentDocView } from './views/ContentDocView';
import { EditorView } from './views/EditorView';
import { ExportView } from './views/ExportView';

export default function App() {
  return (
    <BrowserRouter>
      <ConceptsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ContentDocView />} />
            <Route path="editor/:id" element={<EditorView />} />
            <Route path="export" element={<ExportView />} />
          </Route>
        </Routes>
      </ConceptsProvider>
    </BrowserRouter>
  );
}

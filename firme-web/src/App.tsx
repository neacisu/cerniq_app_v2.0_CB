import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { Skeleton } from './components/ui';
import Home from './pages/Home';

const Search = lazy(() => import('./pages/Search'));
const Company = lazy(() => import('./pages/Company'));
const Compare = lazy(() => import('./pages/Compare'));
const Nomenclatoare = lazy(() => import('./pages/Nomenclatoare'));
const Indicatori = lazy(() => import('./pages/Indicatori'));
const DateApi = lazy(() => import('./pages/DateApi'));
const Despre = lazy(() => import('./pages/Despre'));
const Setari = lazy(() => import('./pages/Setari'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Favorite = lazy(() => import('./pages/Library').then((m) => ({ default: m.Favorite })));
const Istoric = lazy(() => import('./pages/Library').then((m) => ({ default: m.Istoric })));

const Fallback = () => <div className="page" role="status" aria-label="Se încarcă pagina"><Skeleton h={120} r={26} /><Skeleton h={320} r={26} /></div>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="cauta" element={<Search />} />
          <Route path="firma/:cui" element={<Company />} />
          <Route path="inmatriculare/*" element={<Company />} />
          <Route path="comparare" element={<Compare />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="istoric" element={<Istoric />} />
          <Route path="nomenclatoare" element={<Nomenclatoare />} />
          <Route path="indicatori" element={<Indicatori />} />
          <Route path="date" element={<DateApi />} />
          <Route path="despre" element={<Despre />} />
          <Route path="setari" element={<Setari />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

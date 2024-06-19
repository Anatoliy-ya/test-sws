import './App.style.scss';
import Layout from './layout/Layout';
import Table from './table/Table';

export function App() {
  return (
    <Layout>
      <div className="App">
        <Table />
      </div>
    </Layout>
  );
}

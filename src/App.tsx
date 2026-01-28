import Layout from "./Layout/Layout";
import { useGlobalSearch } from "./hooks/useGlobalSearch";

function App() {
  useGlobalSearch();
  return (
    <>
      <Layout />
    </>
  );
}

export default App;

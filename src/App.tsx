import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./utils/AuthInitilizer";

function App() {
  return (
    <>
      <AuthInitializer />
      <AppRoutes />
    </>
  );
}
export default App;

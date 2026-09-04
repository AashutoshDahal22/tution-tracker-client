import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./utils/AuthInitilizer";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AuthInitializer />
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </>
  );
}
export default App;

import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <div className="grid w-screen min-h-screen bg-bg gap-10 ">
            <Toaster />
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
}

export default App;

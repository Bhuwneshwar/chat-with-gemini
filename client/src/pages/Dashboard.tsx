import InputSection from "../components/InputSection";
import Sidebar from "../components/Sidebar";
import MainContent from "./MainContent";

const Dashboard = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-wrapper">
        <MainContent />
        <InputSection />
      </div>
    </div>
  );
};

export default Dashboard;

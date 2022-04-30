import './App.css';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CustomSideBar from './components/SideBarComponents/CustomSideBar';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import DashBoard from './components/SideBarPages/admin/DashBoard';
import Sections from './components/SideBarPages/admin/Sections';
import Accounts from './components/SideBarPages/admin/Accounts';
import Materials from './components/SideBarPages/admin/Materials';
import Components from './components/SideBarPages/admin/Components';
import Products from './components/SideBarPages/admin/Products';
import Signin from './components/login/Signin';
import Orders from './components/SideBarPages/orderdepartment/Orders';
import SectionMaterials from './components/SideBarPages/sectiondepartment/SectionMaterials';
import { Attendance } from './components/SideBarPages/sectiondepartment/Attendance';
import WorkerList from './components/SideBarPages/sectiondepartment/WorkerList';
import OrderDetails from './components/SideBarPages/orderdepartment/OrderDetails';
import CreateProcess from './components/NonSideBarPage/CreateProcess';
import DivideProcessTabs from './components/Tabs/DivideProcessTabs';
import Profile from './components/SideBarPages/Profile';
import ProcessDetail from './components/SideBarPages/sectiondepartment/SectionCompo/ProcessDetail';
import Panel from './components/SideBarPages/sectiondepartment/SectionCompo/Panel';
import ImportForm from './components/SideBarPages/sectiondepartment/SectionCompo/ImportForm';
import { ImportCompo } from './components/SideBarPages/sectiondepartment/SectionAssemble/ImportCompo';
import { ExportCompo } from './components/SideBarPages/sectiondepartment/SectionAssemble/ExportCompo';
import Delivery from './components/SideBarPages/orderdepartment/Delivery';
import RequestDetail from './components/SideBarPages/admin/RequestDetail';
import RequestComponent from './components/SideBarPages/manufacturer/RequestComponent'
import SectionComponents from './components/SideBarPages/sectiondepartment/SectionCompo/SectionComponents';
import TrackingProcess from './components/SideBarPages/manufacturer/TrackingProcess';
import TrackingProcessDetails from './components/SideBarPages/manufacturer/TrackingProcessDetails';

const theme = createTheme({
  App: {
    backgroundColor: "#fff8fa"
  },
  palette: {
    primary: {
      main: "#2e1667"
    },
    secondary: {
      main: "#c7d8ed"
    },
  },
  typography: {
    fontFamily: [
      'Muli',
      'Arial'
    ],
    h4: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: '2rem'
    },
    h5: {
      fontWeight: 600,
      lineHeight: '2rem'
    }
  }
})


function App() {
  // localStorage.clear();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('currentRole');
  const userId = localStorage.getItem('currentId');
  if (!token) {
    return <Signin />
  }

  if (role == 'Admin') {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CustomSideBar />
            <Routes>
              <Route path='*' exact element={<DashBoard />}></Route>
              <Route path='/profile' exact element={<Profile />}></Route>
              <Route path='/dashboard/sections' exact element={<Sections />}></Route>
              <Route path='/dashboard/accounts' exact element={<Accounts />}></Route>
              <Route path='/dashboard/materials' exact element={<Materials />}></Route>
              <Route path='/dashboard/products' exact element={<Products />}></Route>
              <Route path='/dashboard/components' exact element={<Components />}></Route>
              <Route path='/dashboard/attendance' exact element={<Attendance />}></Route>
              <Route path='/requestDetail' exact element={< RequestDetail />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div >
    );
  }

  if (role == 'Manufacturer Department') {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CustomSideBar />
            <Routes>
              <Route path='*' exact element={<RequestComponent />}></Route>
              <Route path='/profile' exact element={<Profile />}></Route>
              <Route path='/manufacturer/requestComponent' exact element={< RequestComponent />}></Route>
              <Route path='/manufacturer/requestDetail' exact element={< RequestDetail />}></Route>
              <Route path='/manufacturer/process' exact element={< TrackingProcess />}></Route>
              <Route path='/manufacturer/process/processDetail' exact element={< TrackingProcessDetails />}></Route>
              <Route path='/dashboard/components' exact element={<Components />}></Route>
              <Route path='/dashboard/materials' exact element={<Materials />}></Route>
              <Route path='/dashboard/products' exact element={<Products />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div >
    );
  }

  if (role == 'Order Department') {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CustomSideBar />
            <Routes>
              <Route path='*' exact element={<Orders />}></Route>
              <Route path='/profile' exact element={<Profile />}></Route>
              <Route path='/orders' exact element={<Orders />}></Route>
              <Route path='/orders/orderdetails' exact element={<OrderDetails />}></Route>
              <Route path='/delivery' exact element={<Delivery />}></Route>
              <Route path='/createProcess' exact element={<CreateProcess />}></Route>
              <Route path='/divideProcessTabs' exact element={<DivideProcessTabs />}></Route>
              <Route path='/dashboard/attendance' exact element={<Attendance />}></Route>
              <Route path='/dashboard/products' exact element={<Products />}></Route>
              <Route path='/manufacturer/process' exact element={< TrackingProcess />}></Route>
              <Route path='/manufacturer/process/processDetail' exact element={< TrackingProcessDetails />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div >
    );
  }

  if (role == 'Section Department') {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CustomSideBar />
            <Routes>
              <Route path='*' exact element={<ProcessDetail />}></Route>
              <Route path='/dashboard/attendance' exact element={<Attendance />}></Route>
              <Route path='/profile' exact element={<Profile />}></Route>
              <Route path='/section/materials' exact element={<SectionMaterials />}></Route>
              <Route path='/section/components' exact element={<SectionComponents />}></Route>
              <Route path='/section/workers' exact element={<WorkerList />}></Route>
              <Route path='/createProcess' exact element={<CreateProcess />}></Route>
              <Route path='/divideProcessTabs' exact element={<DivideProcessTabs />}></Route>
              <Route path='/section/processDetail' exact element={< ProcessDetail />}></Route>
              <Route path='/section/exportElement' exact element={< Panel />}></Route>
              <Route path='/section/importElement' exact element={< ImportForm />}></Route>
              <Route path='/section/importCompo' exact element={< ImportCompo />}></Route>
              <Route path='/section/exportCompo' exact element={< ExportCompo />}></Route>
              <Route path='/section/attendance' exact element={<Attendance />}></Route>
              <Route path='/dashboard/products' exact element={<Products />}></Route>
              <Route path='/dashboard/components' exact element={<Components />}></Route>
              <Route path='/section/requests' exact element={<RequestComponent />}></Route>
              <Route path='/manufacturer/requestDetail' exact element={< RequestDetail />}></Route>
              <Route path='/section/tasks' exact element={< TrackingProcess />}></Route>
              <Route path='/manufacturer/process/processDetail' exact element={< TrackingProcessDetails />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div >
    );
  }
  if (role == 'Worker') {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CustomSideBar />
            <Routes>
              <Route path='/dashboard/attendance' exact element={<Attendance />}></Route>
              <Route path='/profile' exact element={<Profile />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div >
    )
  }
}
export default App;
//}


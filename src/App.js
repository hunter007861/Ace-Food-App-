import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar'
import FoodTable from './Components/FoodTable'



function App() {
    return (
        <div className="App">
            <Navbar />
            <FoodTable/>
        </div>
    );
}

export default App;

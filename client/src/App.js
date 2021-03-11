import './App.css';

import { Route, BrowserRouter} from 'react-router-dom';

import Layout from './containers/Layout/Layout';
import Home from './containers/Home/Home';
import BookReader from './containers/BookReader/BookReader';
import BookSelf from './containers/BookSelf/BookSelf';
import SignIn from './containers/UserControl/SignIn/SignIn';
import AdminControl from './containers/AdminControl/AdminControl';
import SignUp from './containers/UserControl/SignUp/Signup';
import SavedBooks from './containers/SavedBooks/SavedBooks';
import Payment from './containers/Payment/Payment';
import Search from './containers/Search/Search';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
            <Route path="/" exact component={Home}/>
            <Route path="/book/:bookId" exact component={BookReader}/>
            <Route path="/admin" exact component={AdminControl}/>
            <Route path="/bookself/:catId" exact component={BookSelf}/>
            <Route path="/user/signin" exact component={SignIn}/>
            <Route path="/user/signup" exact component={SignUp}/>
            <Route path="/saved-books" exact component={SavedBooks}/>
            <Route path="/payment" exact component={Payment}/>
            <Route path="/search/:searchText" exact component={Search}/>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;

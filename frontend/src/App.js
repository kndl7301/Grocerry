import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register'; // Make sure the path is correct
import Login from './pages/Login'; // Same for Login page
import Home from './pages/Homepage';
import CategoryPage from  './pages/CategoryPage'
import AdminPanel from './pages/AdminPanel'
import AddCategory from './pages/AddCategory'
import Categories from './pages/Categories'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import Messages from './pages/Messages'
import Users from './pages/Users'
import Orders from './pages/Orders'
import MyOrders from './pages/MyOrders'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import AdminRoute from './pages/AdminRoute';
import SearchResults from './pages/SearchResults';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />

        {/* Admin sayfalarını koruma altına al */}
        <Route
          path="/AdminPanel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/addcategory"
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <AdminRoute>
              <Messages />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
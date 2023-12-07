import {
    BrowserRouter as Router, 
    Routes, 
    Route
} from 'react-router-dom'

import HomePage from '../pages/HomePage/HomePage'
import ProductPage from '../pages/ProductPage/ProductPage'
import CollectionsPage from '../pages/CollectionsPage/CollectionsPage'
import CartPage from '../pages/CartPage/CartPage'
import SearchPage from '../pages/SearchPage/SearchPage'

import LayoutContent from '../components/LayoutContent'

const WebRoute = () => {
    return (
        <Router>
            <LayoutContent>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/collections/:category/:slug" element={<ProductPage/>} />
                    <Route path="/collections/:category" element={<CollectionsPage/>} />
                    <Route path="/cart" element={<CartPage/>} />
                    <Route path="/search" element={<SearchPage/>} />
                </Routes>
            </LayoutContent>
        </Router>
    )
}

export default WebRoute
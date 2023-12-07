import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Row, Spin } from 'antd';

import LayoutContent from '../components/Layout';
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

const ManageUser = lazy(() => import('../pages/user/ManageUser'));
const ManageGroup = lazy(() => import('../pages/group/ManageGroup'));

const ManageProduct = lazy(() => import('../pages/product/ManageProduct'));
const AddProduct = lazy(() => import('../pages/product/AddProduct'));
const ManageVariants = lazy(() => import('../pages/variants/ManageVariants'));

const ManageOrder = lazy(() => import('../pages/order/ManageOrder'));
const AddOrder = lazy(() => import('../pages/order/AddOrder'));
const UpdateOrder = lazy(() => import('../pages/order/UpdateOrder'));

const ManageBrand = lazy(() => import('../pages/brand/ManageBrand'));
const ManageCategory = lazy(() => import('../pages/category/ManageCategory'));
const ManageAttributes = lazy(() => import('../pages/attributes/ManageAttributes'));
const AttributesValue = lazy(() => import('../pages/attributes/AttributesValue'));
const ManageImage = lazy(() => import('../pages/image/ManageImage'));
const ManageProfile = lazy(() => import('../pages/profile/ManageProfile'));
const Setting = lazy(() => import('../pages/setting/Setting'));
const ErrorPage = lazy(() => import('../pages/error/ErrorPage'));

const AppRoute = () => {

  return (
    <Router>
      <LayoutContent>
        <Suspense
          fallback={
            <Row
              justify={"center"}
              align={"middle"}
              style={{
                width: "100%",
                height: "100vh"
              }}
            >
              <Spin size='large' />
            </Row>
          }
        >
          <Routes>
            <Route path='/' element={<Dashboard />} />

            <Route path='/user' element={<ManageUser />} />
            <Route path='/group' element={<ManageGroup />} />

            <Route path='/products/add' element={<AddProduct />} />
            <Route path='/products' element={<ManageProduct />} />
            <Route path='/products/variants/:slug' element={<ManageVariants />} />

            <Route path='/brands' element={<ManageBrand />} />
            <Route path='/category' element={<ManageCategory />} />
            <Route path='/attributes' element={<ManageAttributes />} />
            <Route path='/attributes/addvalue/:slug' element={<AttributesValue />} />

            <Route path='/orders' element={<ManageOrder />} />
            <Route path='/orders/add' element={<AddOrder />} />
            <Route path='/orders/update/:slug' element={<UpdateOrder />} />

            <Route path='/images' element={<ManageImage />} />
            <Route path='/profile' element={<ManageProfile />} />
            <Route path='/settings' element={<Setting />} />

            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route path='/error/:slug' element={<ErrorPage />} />

          </Routes>
        </Suspense>
      </LayoutContent>
    </Router>
  )
}

export default AppRoute
/* eslint-disable prettier/prettier */
import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Products',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Products',
        to: '/products',
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/addProduct',
      },
      {
        component: CNavItem,
        name: 'Categories',
        to: '/categories',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Doctor',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Doctors',
        to: '/doctors',
      },
      {
        component: CNavItem,
        name: 'Add Doctor',
        to: '/addDoctor',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Cutomer',
    to: '/customer',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    
  },
]

export default _nav

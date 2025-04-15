

import { CCard, CCardBody, CCardGroup, CCardImage, CCardText, CCardTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function CustomerOrderDetails() {
  const { id } = useParams()  // Get the dynamic ID from the URL
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    // Fetch all customers (you can adjust the API to return all customers or use a mock)
    fetch('https://run.mocky.io/v3/8193e788-fe29-49c8-9241-3eed1ae25ff1')
      .then((res) => res.json())
      .then((data) => {
        // Find the customer with the matching id
        const foundCustomer = data.find((customer) => customer.id === parseInt(id))
        setCustomer(foundCustomer)
      })
      .catch((err) => console.error('Error fetching customer:', err))
  }, [id])  // Only re-run effect when ID changes

  return (
    <>
    <div className="p-0">
      <h1 className="text-xl font-bold mb-4">Customer Order Details</h1>
      {customer ? (
        <div className="space-y-2">
     
          <p><strong>Name:</strong> {customer.name}</p>
        
          <h2 className="mt-4 text-lg font-semibold">Orders:</h2>
          <CCardGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ">
  {customer.orders && customer.orders.length > 0 ? (
    customer.orders.map((order) => (
      <CCard key={order.id} className="flex shadow rounded">
        <img
    src={order.image || 'the image will temporary not displyed'} // Fallback image if `order.image` is not available
     alt='the image will temporary not displyed'
    className="w-full h-48 object-cover"
  />
        <div className="p-3 w-2/2">
          <h3 className="text-lg font-semibold mb-2">Order : {order.id}</h3>
          <p><strong>Product:</strong> {order.product}</p>
          <p><strong>Category:</strong> {order.category}</p>
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
         </p>
        </div>
      </CCard>
    ))
  ) : (
    <p className="col-span-full">No orders found.</p>
  )}
</CCardGroup>




        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>



    

</>
  )
}

export default CustomerOrderDetails

import React, { useState, useEffect } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { getAPICall, deleteAPICall } from "../../../util/api.js";
import ProductModal from "./ProductModal";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    try {
      const response = await getAPICall(`/api/products?page=${page}`);

      if (
        response &&
        response.products &&
        Array.isArray(response.products.data)
      ) {
        setProducts(response.products.data);
        setCurrentPage(response.products.current_page);
        setTotalPages(response.products.last_page);
      } else {
        console.error("Invalid response structure:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteAPICall(`/api/products/${id}`);
        fetchProducts(currentPage);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchProducts(pageNumber);
    }
  };

  const renderPagination = () => {
    let items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }

    return (
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div>
      <h2 className="mb-4">Product List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount %</th>
            <th>Cutting Status</th>
            <th>Manufacturer</th>
            <th>Schedule H</th>
            <th>Available</th>
            <th>Weight</th>
            <th>Weight Type</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Thumbnail</th>
            <th>Product Images</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.discount_percentage}</td>
                <td>{product.cutting_status}</td>
                <td>{product.manufacturer}</td>
                <td>{product.schedule_h ? "Yes" : "No"}</td>
                <td>{product.available ? "Yes" : "No"}</td>
                <td>{product.weight}</td>
                <td>{product.weight_type}</td>
                <td>{product.category?.category || "N/A"}</td>
                <td>{product.qty}</td>
                <td>
                  {product.thumbnail ? (
                    <img src={product.thumbnail} alt="Thumbnail" width="50" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {product.images && product.images.length > 0
                    ? product.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Product Image"
                          width="50"
                        />
                      ))
                    : "No Images"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleUpdateClick(product)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {renderPagination()}

      <ProductModal
        show={selectedProduct !== null}
        product={selectedProduct}
        onHide={() => setSelectedProduct(null)}
        fetchProducts={fetchProducts}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductTable;

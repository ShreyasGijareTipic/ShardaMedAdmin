/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import {
  getAPICall,
  post,
  putAPICall,
  deleteAPICall,
} from "../../../util/api.js";

const CategoryManager = ({ onCategoriesChange }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await getAPICall("/api/categories");
      setCategories(response);
      if (onCategoriesChange) {
        onCategoriesChange(response); // Update parent dropdown
      }
    } catch (err) {
      window.alert("Failed to load categories");
    }
  };

  const handleSearch = (term) => {
    const filtered = categories.filter((cat) =>
      cat.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  const openModal = (category = null) => {
    setCurrentCategory(category);
    setCategoryInput(category ? category.category : "");
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
    setCurrentCategory(null);
    setCategoryInput("");
  };

  const handleSave = async () => {
    if (!categoryInput.trim()) {
      window.alert("Category name is required");
      return;
    }

    try {
      if (currentCategory) {
        await putAPICall(`/api/categories/${currentCategory.id}`, {
          category: categoryInput,
        });
        window.alert("Category updated successfully");
      } else {
        await post("/api/categories", { category: categoryInput });
        window.alert("Category added successfully");
      }

      closeModal();
      fetchCategories();
    } catch (err) {
      window.alert("Error saving category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteAPICall(`/api/categories/${id}`);
        window.alert("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        window.alert("Error deleting category");
      }
    }
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const renderPagination = () => {
    const items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div>
      <h3 className="mb-4">Category Management</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: "300px" }}>
          <Form.Control
            placeholder="Search category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button variant="primary" onClick={() => openModal()}>
          + Add Category
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.category}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openModal(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {renderPagination()}

      <Modal show={modalShow} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="categoryInput">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManager;

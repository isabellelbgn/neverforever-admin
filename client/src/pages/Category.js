import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";

function Category() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const data = { product_category_name: categoryName };

    try {
      if (editedCategory) {
        await axios.put(
          `http://localhost:8081/categories/${editedCategory.product_category_id}`,
          data
        );
      } else {
        await axios.post("http://localhost:8081/categories", data);
      }

      setCategoryName("");
      setEditedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setCategoryName(category.product_category_name);
  };

  const deleteCategory = async (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/categories/${categoryId}`);
          fetchCategories();
          Swal.fire(
            "Category Deleted",
            "The category has been deleted successfully.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the category.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <h1 className="mt-5">CATEGORIES</h1>
      <label className="font-semibold">
        {editedCategory
          ? `EDIT CATEGORY ${editedCategory.product_category_name.toUpperCase()}`
          : "ADD CATEGORY"}
      </label>

      <form onSubmit={saveCategory} className="flex gap-1 mt-3">
        <input
          className="mb-0"
          type="text"
          placeholder="Category Name"
          onChange={(e) => setCategoryName(e.target.value)}
          value={categoryName}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          {editedCategory ? "UPDATE" : "ADD"}
        </button>
      </form>

      <table className="basic mt-6">
        <thead>
          <tr>
            <td>CATEGORY NAME</td>
            <td>ACTIONS</td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.product_category_id}>
              <td>{category.product_category_name}</td>
              <td>
                <button
                  onClick={() => editCategory(category)}
                  className="btn-green mr-1"
                >
                  <BiEdit />
                </button>
                <button
                  onClick={() => deleteCategory(category.product_category_id)}
                  className="btn-red"
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Category;

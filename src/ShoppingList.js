import React, { useState, useEffect } from "react";
import "./ShoppingList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

function ShoppingList() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("shoppingList");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const categoryOptions = [
    "Health",
    "Food & Drink",
    "Household",
    "Electronics",
    "Clothing",
  ];
  const [editIndex, setEditIndex] = useState(null);
  const [editValues, setEditValues] = useState({ itemName: "", category: "" });

  const [inputValue, setInputValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const addItem = (
    itemName,
    quantity = 1,
    unit = "",
    category = categoryValue
  ) => {
    if (itemName.trim() !== "") {
      setItems([...items, { itemName, quantity, unit, category }]);
      setInputValue("");
      setCategoryValue("");
    }
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditValues({
      itemName: items[index].itemName,
      category: items[index].category,
    });
  };

  const saveEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      itemName: editValues.itemName,
      category: editValues.category,
    };
    setItems(updatedItems);
    setEditIndex(null);
    setEditValues({ itemName: "", category: "" });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className={`shopping-list ${isDarkMode ? "dark-mode" : ""}`}>
      <div>
        <h1>Shopping List</h1>
        <button onClick={toggleTheme} className="toggle-button">
          <FontAwesomeIcon icon={isDarkMode ? faToggleOn : faToggleOff} />
        </button>
      </div>

      <div className="form-container">
        <div className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add an item"
          />
        </div>
        <div className="input-form">
          <select
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={addItem}>Add</button>
        </div>
      </div>

      <div>
        <ul>
          {items
            .filter(
              (item) =>
                filterCategory === "" || item.category === filterCategory
            )
            .map((item, index) => (
              <li key={index}>
                {editIndex === index ? (
                  <>
                    <div className="edit-form">
                      <div>
                        <input
                          type="text"
                          value={editValues.itemName}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              itemName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <select
                          value={editValues.category}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((category, idx) => (
                            <option key={idx} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => saveEdit(index)}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    {item.itemName} - {item.category}
                    <div className="edit-remove-btns">
                      <button onClick={() => startEditing(index)}>Edit</button>
                      <button onClick={() => removeItem(index)}>Remove</button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      </div>
      <div className="filter">
        <p>Filter by Category</p>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ShoppingList;

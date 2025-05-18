import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";

function AddUserModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const { setUser } = useContext(UserContext);
  const { ipad } = useContext(UserContext);

  const ip=ipad; // for backen
  const onSelect = (user) => {
    setUser([user.id, user.name]);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      fetch(`${ip}/users`) // or your actual endpoint
        .then((res) => res.json())
        .then((data) => setExistingUsers(data))
        .catch((err) => console.error("Failed to load users", err));
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${ip}/users`);
      const data = await res.json();
      setExistingUsers(data);
    //   console.log("Users set:", data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };
  
  const handleAddUser = async () => {
    if (!name.trim()) return;
    console.log("first1")
    try {
      const response = await fetch(`${ip}/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
  
      console.log("right1");
      if (response.ok) {
        setName("");
        await fetchUsers();
      } else {
        console.error("Failed to add user");
      }
    } catch (err) {
      console.error("Error1:", err);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-2">Existing Users:</h2>
          <ul className="max-h-40 overflow-y-auto space-y-1">
            {existingUsers.map((user) => (
              <li
                key={user.id}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                onClick={() => onSelect(user)}
              >
                {user.id}{". "}
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <input
          type="text"
          placeholder="Enter name"
          value={typeof name === "string" ? name : ""}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;

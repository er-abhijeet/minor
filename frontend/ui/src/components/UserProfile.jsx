import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import BottomNavigation from "./BottomNavigation";
import AddUserModal from "./ui/AddUserModal";
import UserContext from "@/context/UserContext";


function UserProfile() {
  const { ipad } = useContext(UserContext);
  const ip=ipad; // for backend
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [modalOpen, setModalOpen]=useState(false);
  const { user } = useContext(UserContext);
  const userId = user[0];
  // console.log(`user is `,user[0])
  // let userId=

  // console.log(userData);
  useEffect(() => {
    axios
      .get(`${ip}/userdata/?userId=${userId}`)
      .then((res) => setUserData(res.data[0]))
      .catch(console.error);
  }, [userId]);


  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      console.log(userData);
      await axios.post(`${ip}/changeinfo/?userId=${userId}`,{data: userData});
      setEditing(false);
      alert("Details updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const addNewField = async () => {
    if (!newKey.trim()) return alert("Key is required");
    try {
      const data = { [newKey]: newValue } ;
      await axios.post(
        `${ip}/changeinfo?userId=${userId}`,
        {data: data}
      );
      // Refresh userData data
      const res = await axios.get(`${ip}/userdata/?userId=${userId}`);
      setUserData(res.data[0]);
      setNewKey("");
      setNewValue("");
    } catch (err) {
      console.error(err);
      alert("Adding new detail failed");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">{`Hi, User ${user[1]}`}</h2>
      <div>
      {/* Other content like userData list */}

      <button
    onClick={() => setModalOpen(true)}
    className="fixed top-4 right-6 bg-blue-600 text-white text-3xl w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
  >
    +
  </button>

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
      {Object.entries(userData).map(([key, value]) =>
        key === "id" ? (
          <p key={key}>
            <strong>ID:</strong> {value}
          </p>
        ) : (
          <div key={key} className="mb-2">
            <label className="block text-sm font-medium">{key}</label>
            <input
              name={key}
              value={value?value:""}
              disabled={!editing}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        )
      )}

      <div className="flex gap-2 mt-4">
        {editing ? (
          <>
            <button
              onClick={saveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>

      {/* Add New Field Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium mb-2">Add New Detail</h3>
        <input
          placeholder="Field name"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          placeholder="Field value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={addNewField}
          className=" bg-purple-600 text-white px-4 py-2 rounded w-full mb-20"
        >
          Add Detail
        </button>
      </div>
    </div>
    <BottomNavigation act="profile"/>
    </>
  );
}

export default UserProfile;

import React, { useReducer, useEffect, useState, lazy, Suspense } from "react";

// Lazy Loading Components
const About = lazy(() => import("./About"));
const StudentDetails = lazy(() => import("./StudentDetails"));

// =====================================
// TASK 1 - COUNTER APPLICATION
// =====================================

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;

    case "DECREMENT":
      return state - 1;

    case "RESET":
      return 0;

    default:
      return state;
  }
}

// =====================================
// TASK 2 - CUSTOM VALUE COUNTER
// =====================================

function customReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return state + action.payload;

    case "SUBTRACT":
      return state - action.payload;

    case "RESET":
      return 10;

    default:
      return state;
  }
}

// =====================================
// TASK 3 - SHOW / HIDE PASSWORD
// =====================================

function passwordReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return !state;

    default:
      return state;
  }
}

// =====================================
// TASK 4 - STUDENT FORM
// =====================================

const initialStudent = {
  name: "",
  email: "",
  course: ""
};

function studentReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.payload.name]: action.payload.value
      };

    case "RESET":
      return initialStudent;

    default:
      return state;
  }
}

// =====================================
// TASK 5 & 6 - API FETCH + SEARCH
// =====================================

const initialUsers = {
  users: [],
  loading: true,
  error: ""
};

function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: ""
      };

    case "FETCH_SUCCESS":
      return {
        users: action.payload,
        loading: false,
        error: ""
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: "Something went wrong!"
      };

    default:
      return state;
  }
}

// =====================================
// TASK 7 - TODO APPLICATION
// =====================================

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, {
        id: Date.now(),
        text: action.payload,
        completed: false
      }];

    case "DELETE":
      return state.filter(item => item.id !== action.payload);

    case "TOGGLE":
      return state.map(item =>
        item.id === action.payload
          ? { ...item, completed: !item.completed }
          : item
      );

    default:
      return state;
  }
}

// =====================================
// MAIN APP COMPONENT
// =====================================

function App() {

  // TASK 1
  const [count, dispatch] = useReducer(counterReducer, 0);

  // TASK 2
  const [number, customDispatch] = useReducer(customReducer, 10);

  // TASK 3
  const [show, passwordDispatch] = useReducer(passwordReducer, false);

  // TASK 4
  const [student, studentDispatch] = useReducer(
    studentReducer,
    initialStudent
  );

  // TASK 5 & 6
  const [data, userDispatch] = useReducer(
    userReducer,
    initialUsers
  );

  const [search, setSearch] = useState("");

  // TASK 7
  const [todos, todoDispatch] = useReducer(todoReducer, []);

  const [task, setTask] = useState("");

  // TASK 8 & 9
  const [showAbout, setShowAbout] = useState(false);
  const [showStudent, setShowStudent] = useState(false);

  // FETCH API
  useEffect(() => {
    userDispatch({ type: "FETCH_START" });

    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        if (!res.ok) {
          throw new Error("API Error");
        }
        return res.json();
      })
      .then(result => {
        userDispatch({
          type: "FETCH_SUCCESS",
          payload: result
        });
      })
      .catch(() => {
        userDispatch({ type: "FETCH_ERROR" });
      });

  }, []);

  // SEARCH FILTER
  const filteredUsers = data.users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>


      

      {/* TASK 1 */}

      <h2>Task 1</h2>

      <h3>Count: {count}</h3>

      <button onClick={() => dispatch({ type: "INCREMENT" })}>
        Increment
      </button>

      <button onClick={() => dispatch({ type: "DECREMENT" })}>
        Decrement
      </button>

      <button onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>

      <hr />

      {/* TASK 2 */}

      <h2>Task 2 </h2>

      <h3>Count: {number}</h3>

      <button onClick={() => customDispatch({
        type: "ADD",
        payload: 5
      })}>
        Add 5
      </button>

      <button onClick={() => customDispatch({
        type: "ADD",
        payload: 10
      })}>
        Add 10
      </button>

      <button onClick={() => customDispatch({
        type: "SUBTRACT",
        payload: 5
      })}>
        Subtract 5
      </button>

      <button onClick={() => customDispatch({ type: "RESET" })}>
        Reset
      </button>

      <hr />

      {/* TASK 3 */}

      <h2>Task 3 </h2>

      <input
        type={show ? "text" : "password"}
        placeholder="Enter Password"
      />

      <button onClick={() => passwordDispatch({ type: "TOGGLE" })}>
        {show ? "Hide Password" : "Show Password"}
      </button>

      <hr />

      {/* TASK 4 */}

      <h2>Task 4 </h2>

      <input
        placeholder="Enter Name"
        value={student.name}
        onChange={e => studentDispatch({
          type: "UPDATE",
          payload: { name: "name", value: e.target.value }
        })}
      />

      <br /><br />

      <input
        placeholder="Enter Email"
        value={student.email}
        onChange={e => studentDispatch({
          type: "UPDATE",
          payload: { name: "email", value: e.target.value }
        })}
      />

      <br /><br />

      <input
        placeholder="Enter Course"
        value={student.course}
        onChange={e => studentDispatch({
          type: "UPDATE",
          payload: { name: "course", value: e.target.value }
        })}
      />

      <br /><br />

      <button onClick={() => studentDispatch({ type: "RESET" })}>
        Reset
      </button>

      <h3>Student Details</h3>

      <p>Name: {student.name}</p>
      <p>Email: {student.email}</p>
      <p>Course: {student.course}</p>

      <hr />

      {/* TASK 5 */}

      <h2>Task 5</h2>

      {data.loading && <p>Loading...</p>}

      {data.error && <p>{data.error}</p>}

      {!data.loading && !data.error && data.users.map(user => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}

      <hr />

      {/* TASK 6 */}

      <h2>Task 6 </h2>

      <input
        placeholder="Search User"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {data.loading && <p>Loading...</p>}

      {data.error && <p>{data.error}</p>}

      {!data.loading && !data.error && filteredUsers.length === 0 &&
        <p>No Users Found</p>
      }

      {!data.loading && !data.error && filteredUsers.map(user => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}

      <hr />

      {/* TASK 7 */}

      <h2>Task 7 </h2>

      <input
        placeholder="Enter Task"
        value={task}
        onChange={e => setTask(e.target.value)}
      />

      <button onClick={() => {
        if (task.trim() !== "") {
          todoDispatch({ type: "ADD", payload: task });
          setTask("");
        }
      }}>
        Add Task
      </button>

      <h3>Total Tasks: {todos.length}</h3>

      {todos.map(item => (
        <div key={item.id}>
          <span>
            {item.text} - {item.completed ? "Completed" : "Pending"}
          </span>

          <button onClick={() => todoDispatch({
            type: "TOGGLE",
            payload: item.id
          })}>
            Complete / Pending
          </button>

          <button onClick={() => todoDispatch({
            type: "DELETE",
            payload: item.id
          })}>
            Delete
          </button>
        </div>
      ))}

      <hr />

      {/* TASK 8 */}

      <h2>Task 8 </h2>

      <h3>Home Component</h3>

      <button onClick={() => setShowAbout(true)}>
        Show About
      </button>

      {showAbout && (
        <Suspense fallback={<p>Loading...</p>}>
          <About />
        </Suspense>
      )}

      <hr />

      {/* TASK 9 */}

      <h2>Task 9 </h2>

      <button onClick={() => setShowStudent(true)}>
        View Student
      </button>

      {showStudent && (
        <Suspense fallback={<p>Loading Student Details...</p>}>
          <StudentDetails />
        </Suspense>
      )}

    </div>
  );
}

export default App;
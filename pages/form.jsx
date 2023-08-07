import React from "react";
import Layout from "./layout";
import { useRouter } from "next/router";
import Link from "next/link";

const Form = () => {
  console.log(typeof window);
  const router = useRouter();
  const [name, setName] = React.useState("");
  const initial = {
    id: null,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  };

  const [currentUser, setCurrentUser] = React.useState(initial);
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCurrentUser({ ...currentUser, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(currentUser));
  };
  console.log(currentUser);
  return (
    <Layout>
      <Link href="/main"> Go to main </Link>
      <button onClick={() => router.push("main")}>Go </button>
      <div className="container">
        <hr />
        <div className="row">
          <aside className="col-sm-6">
            <div className="card text-white bg-dark mb-3">
              <div className="card-header text-center">Edit user</div>
              <article className="card-body">
                <form method="true" className="add-form">
                  <div className="form-group">
                    <label htmlFor="firstname">FirstName</label>
                    <input
                      name="firstName"
                      type="text"
                      onChange={handleInputChange}
                      //  e.targ
                      className="form-control"
                    />
                    <span className="text-danger col-sm-4"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">LastName</label>
                    <input
                      name="lastName"
                      type="text"
                      onChange={handleInputChange}
                      //  e.targ
                      className="form-control"
                    />
                    <span className="text-danger col-sm-4"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      name="username"
                      type="text"
                      onChange={handleInputChange}
                      //   onChange={(e) => setLoginId(e.target.value)}
                      className="form-control"
                    />
                    <span className="text-danger col-sm-4"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      name="email"
                      type="text"
                      onChange={handleInputChange}
                      //   onChange={(e) => setLoginId(e.target.value)}
                      className="form-control"
                    />
                    <span className="text-danger col-sm-4"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      name="phone"
                      type="text"
                      onChange={handleInputChange}
                      //   onChange={(e) => setLoginId(e.target.value)}
                      className="form-control"
                    />
                    <span className="text-danger col-sm-4"></span>
                  </div>
                  <div className="form-group col-sm-4">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </article>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Form;

import Layout from "../layout.jsx";
import React from "react";
import { useRouter } from "next/router";

const Edit = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({});
  //  console.log(router);
  const { id } = router.query;
  const userDetail = async (id) => {
    try {
      const response = await fetch(`/api/getuser/${id}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    console.log(user);
    userDetail(id);
  }, [id]);

  return (
    <Layout>
      <p>Id:</p>
      <h1>{user.id}</h1>
      <p>Name:</p>
      <h1>{user.name}</h1>
    </Layout>
  );
};
export default Edit;

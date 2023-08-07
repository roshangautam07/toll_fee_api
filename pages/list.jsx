import Link from "next/link";
import React from "react";

import Layout from "./layout";

export async function getServerSideProps({ req, res }) {
  return {
    props: {
      data: res.data,
    },
  };
}
const List = (props) => {
  const { data } = props;
  console.log(props);
  //  console.log(process.browser);
  //  const [value, setValue] = React.useState(props.data);
  //  console.log(value);

  return (
    <Layout>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            {Object.keys(data[0]).map((m) => (
              <th scope="col">{m.toUpperCase()}</th>
            ))}
            {/*<th scope="col">Name</th>*/}
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>
                <Link href={`/user/${d.id}`}>Show detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default List;

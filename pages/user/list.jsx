import Link from "next/link";
import React from "react";

import Layout from "../layout";

//export async function getServerSideProps({ req, res }) {
//  return {
//    props: {
//      user: res.pageParams.value,
//    },
//  };
//}
export const UserList = ({ props }) => {
  return (
    <Layout>
      <table>
        <tr>
          <th>id</th>
          <th>Name</th>
        </tr>
        <tr>
          <td></td>
        </tr>
      </table>
    </Layout>
  );
};

export default UserList;

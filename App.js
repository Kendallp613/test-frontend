import React from "react";
import { useQuery, gql } from "@apollo/client";
import AddFamilyMember from "./AddFamilyMember";

const GET_FAMILY_MEMBERS = gql`
  query {
    getFamilyMembers {
      id
      first_name
      last_name
      birth_date
      gender
      parent_id
    }
  }
`;

function App() {
  const { loading, error, data, refetch } = useQuery(GET_FAMILY_MEMBERS);

  if (loading) return <p>Loading family members...</p>;
  if (error) return <p>Error loading family members.</p>;

  return (
    <div>
      <h1>Family Members</h1>
      <ul>
        {data.getFamilyMembers.map((member) => (
          <li key={member.id}>
            {member.first_name} {member.last_name} - {member.birth_date} -{" "}
            {member.gender} {member.parent_id ? `(Parent ID: ${member.parent_id})` : ""}
          </li>
        ))}
      </ul>

      <h2>Add New Family Member</h2>
      <AddFamilyMember onAdded={() => refetch()} />
    </div>
  );
}

export default App;

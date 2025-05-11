import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_FAMILY_MEMBER = gql`
  mutation AddFamilyMember(
    $first_name: String!
    $last_name: String!
    $birth_date: String
    $gender: String
    $parent_id: ID
  ) {
    addFamilyMember(
      first_name: $first_name
      last_name: $last_name
      birth_date: $birth_date
      gender: $gender
      parent_id: $parent_id
    ) {
      id
      first_name
      last_name
    }
  }
`;

function AddFamilyMember({ onAdded }) {
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    parent_id: ""
  });

  const [addFamilyMember] = useMutation(ADD_FAMILY_MEMBER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFamilyMember({
      variables: {
        first_name: formState.first_name,
        last_name: formState.last_name,
        birth_date: formState.birth_date,
        gender: formState.gender,
        parent_id: formState.parent_id || null
      }
    });
    setFormState({
      first_name: "",
      last_name: "",
      birth_date: "",
      gender: "",
      parent_id: ""
    });
    if (onAdded) onAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="First Name"
        value={formState.first_name}
        onChange={(e) =>
          setFormState({ ...formState, first_name: e.target.value })
        }
      />
      <input
        placeholder="Last Name"
        value={formState.last_name}
        onChange={(e) =>
          setFormState({ ...formState, last_name: e.target.value })
        }
      />
      <input
        placeholder="Birth Date"
        value={formState.birth_date}
        onChange={(e) =>
          setFormState({ ...formState, birth_date: e.target.value })
        }
      />
      <input
        placeholder="Gender"
        value={formState.gender}
        onChange={(e) =>
          setFormState({ ...formState, gender: e.target.value })
        }
      />
      <input
        placeholder="Parent ID (optional)"
        value={formState.parent_id}
        onChange={(e) =>
          setFormState({ ...formState, parent_id: e.target.value })
        }
      />
      <button type="submit">Add Family Member</button>
    </form>
  );
}

export default AddFamilyMember;

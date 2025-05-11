import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
});

// GraphQL Queries & Mutations
const GET_FAMILY_MEMBERS = gql`
    query GetFamilyMembers {
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

const ADD_FAMILY_MEMBER = gql`
    mutation AddFamilyMember($first_name: String!, $last_name: String!, $birth_date: String, $gender: String, $parent_id: ID) {
        addFamilyMember(first_name: $first_name, last_name: $last_name, birth_date: $birth_date, gender: $gender, parent_id: $parent_id) {
            id
            first_name
            last_name
        }
    }
`;

const FamilyTree: React.FC = () => {
    const { loading, error, data } = useQuery(GET_FAMILY_MEMBERS);
    const [addFamilyMember] = useMutation(ADD_FAMILY_MEMBER, {
        refetchQueries: [{ query: GET_FAMILY_MEMBERS }], // Refresh after mutation
    });

    const [newMember, setNewMember] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        parent_id: '',
    });

    const handleAddMember = async () => {
        if (!newMember.first_name || !newMember.last_name) {
            alert('First Name and Last Name are required!');
            return;
        }
        try {
            await addFamilyMember({ variables: { ...newMember } });
            setNewMember({ first_name: '', last_name: '', birth_date: '', gender: '', parent_id: '' }); // Reset form
        } catch (err) {
            console.error('Error adding family member:', err);
        }
    };

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error loading family members</p>);

    return (
        <div>
            <h1>Family Tree</h1>
            <ul>
                {data.getFamilyMembers.map((member: any) => (
                    <li key={member.id}>
                        {member.first_name} {member.last_name} ({member.gender})
                    </li>
                ))}
            </ul>
            <h2>Add Family Member</h2>
            <input
                type="text"
                placeholder="First Name"
                value={newMember.first_name}
                onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={newMember.last_name}
                onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })}
            />
            <button onClick={handleAddMember}>Add Member</button>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <FamilyTree />
        </ApolloProvider>
    );
};

export default App;

import React from 'react'
import { withRouter, RouteComponentProps } from "react-router";


const Home = withRouter((props: RouteComponentProps) => {
  const [username, setUsername] = React.useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: validae username
    props.history.push(`/playlists/${username}`);
  };
  return (
    <>
      <p>Search by username</p>
      <form onSubmit={submit}>
        <input
          autoFocus
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button>Search</button>
      </form>
    </>
  );
});

export default Home
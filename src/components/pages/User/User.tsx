import React, { useState, useEffect } from "react";
import "./User.css";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import Repo from "../../ui/Repo";

interface UserTypes {
  avatar_url: string
  bio: string
  blog: string
  name: string
  created_at: string
  email: string
  followers: number
  following: number
  id: number
  location: string
}

export interface RepoTypes {
  id: number
  name:string
  html_url: string
  description: string
  language:string
}
const User = () => {
  const { login } = useParams();

  const [userInfo, setUserInfo] = useState<UserTypes>();
  const [repos, setRepos] = useState<Array<RepoTypes>>([]);
  const [value, setValue] = useState("")

  const filtredRepos = repos.filter(repo => {
    return repo.name.toLowerCase().includes(value.toLowerCase())
  })

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await Promise.all([
          axios.get(`/users/${login}`),
          axios.get(`/users/${login}/repos`),
        ]);
        setUserInfo(response[0].data);
        setRepos(response[1].data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInformation();
  }, []);

  return (
    <div className="container">
      <div className="user-repos">
        <h1>GitHub Searcher</h1>
      </div>
      <div className="user-information">
        <div className="image">
          <img src={userInfo?.avatar_url} />
        </div>
        <div className="user-content">
          <h3>{userInfo?.name}</h3>
          <p>{userInfo?.email}</p>
          <div className="more-data">
            <p>
              {userInfo?.followers} Followers. Following {userInfo?.following}
            </p>
            {userInfo?.location && (
              <p>
                {userInfo?.location}
              </p>
            )}
            <p>Created at {userInfo?.created_at}</p>
            {userInfo?.blog && (
              <p>
                {userInfo?.blog}
              </p>
            )}
            <p>{userInfo?.bio}</p>
          </div>
        </div>
      </div>
      <form className="user-repos">
        <input
        type="text"
        placeholder="Search user repo"
        className="input" 
        onChange={(e) => setValue(e.target.value) }/>
      </form>
      <div className="user-repos">
        {repos ? (
          filtredRepos.map((repo) => {
            return <Repo repo={repo} key={repo.id} />;
          })
        ) : (
          <h2>No repos for this user...</h2>
        )}
      </div>
    </div>
  );
};

export default User;

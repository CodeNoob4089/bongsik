import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SignUp from "../pages/SignUp";
import Layout from "./Layout";
import Signin from "../pages/Signin";
import Mypage from "../pages/Mypage";
import Community from "../pages/Community";
import Admin from "../pages/Admin";
import Intro from "../pages/Intro";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Intro/>} />
          <Route path="/main" element={<Main />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

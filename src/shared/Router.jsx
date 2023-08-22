import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SignUp from "../pages/SignUp";
import Layout from "./Layout";
import Signin from "../pages/Signin";
import Community from "../pages/Community";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />

          <Route path="/community" element={<Community />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

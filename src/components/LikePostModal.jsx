
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  where,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import useAuthStore from "../store/auth";
import {
  ModalWrapper,
  ModalContent,
  SubmitButton,
  InputBox,
  Form,
  CommentWrap,
  CommentButton,
  CloseButton,
  CommentInput,
  ContentArea,
} from "./TabPostStyled";
import { nanoid } from "nanoid";
import { faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function LikePostModal  ({
    Button,
    openModal,
    setOpenModal,
    selectedPost,
    setSelectedPostId,
  })
  const authStore = useAuthStore();
  const displayName = authStore.user?.displayName;
  const isLogIn = authStore.user !== null;
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  //모달 닫기
  const handleCloseModal = () => {
    // 배경 페이지 스크롤 활성화
    document.body.style.overflow = "auto";
    setOpenModal(false);
    setSelectedPostId(null);
  }; {
  return (
    <div>LikePostModal</div>
  )
}

export default LikePostModal
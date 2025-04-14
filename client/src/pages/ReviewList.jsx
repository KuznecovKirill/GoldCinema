import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import configs from "../api/configs/configs";
import UI from "../configs/UI";
import reviewModule from "../api/modules/reviewModule";
import Container from "../components/common/Container";
import { routesGen } from "../routes/routes";

import { setGlobalLoading } from "../redux/slices/globalLoadingSlice";


const ReviewItem = ({review, onRemoved}) => {
    const [onRequest, setOnRequest] = useState(false);

    const onRemove = async () => {
      if (onRequest) return;
      setOnRequest(true);
      const { response, err } = await reviewModule.remove({ id_review: review.id_review });
      setOnRequest(false);
  
      if (err) toast.error(err.message);
      if (response) {
        toast.success("Успешное удаление отзыва!");
        onRemoved(review.id_review);
      }
}
const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
  
    const dispatch = useDispatch();
  
    const skip = 2;
  
    useEffect(() => {
      const getReviews = async () => {
        dispatch(setGlobalLoading(true));
        const { response, err } = await reviewModule.getList();
        dispatch(setGlobalLoading(false));
  
        if (err) toast.error(err.message);
        if (response) {
          setCount(response.length);
          setReviews([...response]);
          setFilteredReviews([...response].splice(0, skip));
        }
      };
  
      getReviews();
    }, []);
  
    const onLoadMore = () => {
      setFilteredReviews([...filteredReviews, ...[...reviews].splice(page * skip, skip)]);
      setPage(page + 1);
    };
  
    const onRemoved = (id) => {
      console.log({ reviews });
      const newReviews = [...reviews].filter(e => e.id !== id);
      console.log({ newReviews });
      setReviews(newReviews);
      setFilteredReviews([...newReviews].splice(0, page * skip));
      setCount(count - 1);
    };
  
    

  };
  return (
    <div>ReviewList</div>
  )
}

export default ReviewList
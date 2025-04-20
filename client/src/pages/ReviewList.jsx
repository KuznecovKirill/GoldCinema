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
};

return (
  <Box sx={{
    position: "relative",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    padding: 1,
    opacity: onRequest ? 0.6 : 1,
    "&:hover": { backgroundColor: "background.paper" }
  }}>
    <Box sx={{ width: { xs: 0, md: "10%" } }}>
      <Link
        to={routesGen.mediaInfo(review.media.mediaType, review.media.id_media)}
        style={{ color: "unset", textDecoration: "none" }}
      >
        <Box sx={{
          paddingTop: "160%",
          ...UI.style.backgroundImage(configs.posterPath(review.media.id_media))
        }} />
      </Link>
    </Box>

    <Box sx={{
      width: { xs: "100%", md: "80%" },
      padding: { xs: 0, md: "0 2rem" }
    }}>
      <Stack spacing={1}>
        <Link
          to={routesGen.mediaInfo(review.media.mediaType, review.media.id_media)}
          style={{ color: "unset", textDecoration: "none" }}
        >
          <Typography
            variant="h6"
            sx={{ ...UI.style.typoLines(1, "left") }}
          >
            {review.media.title}
          </Typography>
        </Link>
        <Typography variant="caption">
          {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </Typography>
        <Typography>{review.comment_text}</Typography>
      </Stack>
    </Box>

    <LoadingButton
      variant="contained"
      sx={{
        position: { xs: "relative", md: "absolute" },
        right: { xs: 0, md: "10px" },
        marginTop: { xs: 2, md: 0 },
        width: "max-content"
      }}
      startIcon={<DeleteIcon />}
      loadingPosition="start"
      loading={onRequest}
      onClick={onRemove}
    >
      удалить
    </LoadingButton>
  </Box>
);
};


const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
  
    const dispatch = useDispatch();
  
    const skip = 2;
  
    useEffect(() => {
      const getReviews = async () => {
        console.log("Страница обзоров");
        dispatch(setGlobalLoading(true));
        const { response, err } = await reviewModule.getReviewsOfUser();
        dispatch(setGlobalLoading(false));
        console.log(response);
  
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

    return (
      <Box sx={{ ...UI.style.mainContent }}>
        <Container header={`Ваши обзоры (${count})`}>
          <Stack spacing={2}>
            {filteredReviews.map((item) => (
              <Box key={item.id}>
                <ReviewItem review={item} onRemoved={onRemoved} />
                <Divider sx={{
                  display: { xs: "block", md: "none" }
                }} />
              </Box>
            ))}
            {filteredReviews.length < reviews.length && (
              <Button onClick={onLoadMore}>загрузить ещё</Button>
            )}
          </Stack>
        </Container>
      </Box>
    );
  };

export default ReviewList
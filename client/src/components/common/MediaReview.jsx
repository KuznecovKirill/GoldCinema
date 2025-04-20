import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Container from "./Container";
import reviewModule from "../../api/modules/reviewModule";
import AvatarUser from "./AvatarUser";
import isEqual from "lodash/isEqual";

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector((state) => state.user);
  const [onRequest, setOnRequest] = useState(false);
  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await reviewModule.remove({
      id_review: review.id_review,
    });

    if (err) toast.error(err.message);
    if (response) onRemoved(review.id_review);
    console.log(review);
  };
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: "5px",
        position: "relative",
        opacity: onRequest ? 0.6 : 1,
        "&:hover": { backgroundColor: "background.paper" },
      }}
    >
      <Stack direction="row" spacing={2}>
        {/* Аватар пользователя */}
        <AvatarUser text={review.user?.username} />
        {/* Аватар пользователя */}
        <Stack spacing={2} flexGrow={1}>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight="700">
              {review.user?.username}
            </Typography>
            <Typography variant="caption">
              {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight="700">
          <Rating name="rating" value={review.rating_user}/>
          </Typography> 
          <Typography variant="body1" textAlign="justify">
            {review.comment_text}
          </Typography>
          {user && user.id_user === review.user.id_user && (
            <LoadingButton
              variant="contained"
              startIcon={<DeleteIcon />}
              loadingPosition="start"
              loading={onRequest}
              onClick={onRemove}
              sx={{
                position: { xs: "relative", md: "absolute" },
                right: { xs: 0, md: "10px" },
                marginTop: { xs: 2, md: 0 },
                width: "max-content",
              }}
            >
              удалить
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const MediaReview = ({ reviews = [], media }) => {
  const { user } = useSelector((state) => state.user);
  const [listReviews, setListReviews] = useState([]); //Полный список отзывов
  const [filteredReviews, setFilteredReviews] = useState([]); //Часть от списка отзывов
  const [page, setPage] = useState(1);
  const [onRequest, setOnRequest] = useState(false);
  const [rating_user, setRating_user] = useState(0);
  const [comment_text, setComment] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const skip = 4;
  // const safeReviews = useMemo(() => Array.isArray(reviews) ? reviews : [], [reviews]);
  useEffect(() => {
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    if (!isEqual(listReviews, safeReviews)) {
      // Проверка на изменение
      setListReviews([...safeReviews]);
      setFilteredReviews([...safeReviews].slice(0, skip));
      setReviewCount(safeReviews.length);
    }
  }, [reviews]);
  const onAddReview = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const body = {
      id_user: user.id_user,
      id_media: media.id_media,
      rating_user,
      comment_text,
    };

    const { response, err } = await reviewModule.create(body);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      toast.success("Отзыв создан успешно!");

      setFilteredReviews([...filteredReviews, response]);
      setReviewCount(reviewCount + 1);
      setComment("");
      setRating_user(0);
    }
  };

  const onLoadMore = () => {
    const start = page * skip;
    const end = start + skip;
    const newReviews = listReviews.slice(start, end);
    setFilteredReviews([...filteredReviews, ...newReviews]);
    setPage(page + 1);
  };


  const onRemoved = (id_review) => {
    const newListReviews = listReviews.filter((e) => e.id_review !== id_review);
    setListReviews(newListReviews);
    setFilteredReviews(newListReviews.slice(0, page * skip));

    setReviewCount(newListReviews.length); // Обновление кол-ва отзывов
    toast.success("Удаление успешно");
  };

  return (
    <>
      <Container header={`Обзоры (${reviewCount})`}>
        <Stack spacing={4} marginBottom={2}>
          {filteredReviews.map((item) => {
            if (!item || !item.user) return null; // Проверяем наличие данных перед рендерингом

            return (
              <Box key={item.id_review}>
                <ReviewItem review={item} onRemoved={onRemoved} />
                <Divider
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                />
              </Box>
            );
          })}
          {filteredReviews.length < listReviews.length && (
            <Button onClick={onLoadMore}>Загрузить ещё</Button>
          )}
        </Stack>
        {user && (
          <>
            <Divider />
            <Stack direction="row" spacing={2}>
              {/* <AvatarUser text={user.username} /> */}
              <Stack spacing={2} flexGrow={1}>
                <Typography variant="h6" fontWeight="700">
                  {/* Компонент Rating */}
                  {user.username}
                  <Rating
                    name="rating"
                    value={rating_user}
                    onChange={(event, newValue) => {
                      setRating_user(newValue);
                    }}
                  />
                  
                </Typography>
                <TextField
                  value={comment_text}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Напишите свой обзор"
                  variant="outlined"
                />
                <LoadingButton
                  variant="contained"
                  size="large"
                  sx={{ width: "max-content" }}
                  startIcon={<SendOutlinedIcon />}
                  loadingPosition="start"
                  loading={onRequest}
                  onClick={onAddReview}
                >
                  отправить
                </LoadingButton>
              </Stack>
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};

export default MediaReview;

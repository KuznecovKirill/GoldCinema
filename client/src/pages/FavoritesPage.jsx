import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import favoriteModule from "../api/modules/favoriteModule";
import { setGlobalLoading } from "../redux/slices/globalLoadingSlice";
import { removeFavorite } from "../redux/slices/userSlice";
import UI from "../configs/UI";

import Container from "../components/common/Container";
import { Box, Button, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import DeleteIcon from "@mui/icons-material/Delete";

import MediaItem from "../components/common/MediaItem";
import mediaModule from "../api/modules/mediaModule";

const FavoritesItem = ({ favorite, onRemoved }) => {
  const { user, listFavorites } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);
  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const fav = listFavorites.find(
      (e) => e.id_media.toString() === favorite.id_media.toString()
    );
    const { response, err } = await favoriteModule.remove({
      id_favorite: fav.id_favorite,
    });
    setOnRequest(true);

    if (err) toast.error(err.message);
    if (response) {
      toast.success("Удаление из избранного успешно!");
      dispatch(removeFavorite({ id_media: favorite.id_media }));
      onRemoved(favorite.id_media);
    }
  };

  return (
    <>
      <MediaItem media={favorite.media} mediaType={favorite.media.mediaType} />
      <LoadingButton fullWidth variant="contained" sx={{ marginTop: 2 }} startIcon={<DeleteIcon />} loadingPosition="start" loading={onRequest} onClick={onRemove}>
        удалить
      </LoadingButton>
    </>
  );
};
const FavoritesPage = () => {
  // const [favorites, setFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filtredFavorites, setFiltredFavorites] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const skip = 4;

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await favoriteModule.getList();
      dispatch(setGlobalLoading(false));

      if (err) {
        toast.error(err.message);
        return;
      }
      if (response && Array.isArray(response)) {
        setCount(response.length);
        //   setFavorites([...response]);

        const mediasData = [];
        for (const fav of response) {
          const { response: mediaInfo, err: mediaErr } =
            await mediaModule.getInfo({
              id_media: fav.id_media,
            });
          if (mediaErr) {
            toast.error(`Ошибка загрузки медиа с id ${fav.id_media}`);
          } else if (mediaInfo && mediaInfo.media) {
            mediasData.push(mediaInfo.media);
          }
        }

        const result = response.map((fav) => {
          const media = mediasData.find((m) => m.id_media === fav.id_media);
          return { ...fav, media };
        });

        setFavorites(result);
        setFiltredFavorites(result.slice(0, skip));
      }
    };
    getFavorites();
  }, []);

  const onLoadMore = () => {
    const newItems = favorites.slice((page + 1) * skip,(page + 1) * skip + skip);
    setFiltredFavorites((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
  };

  const onRemoved = (id_media) => {
    const newFavorites = favorites.filter((e) => e.id_media !== id_media);
    setFavorites(newFavorites);
    setCount((prev) => prev - 1);

    // Проверяем, сколько страниц теперь нужно для отображения
    const maxPage = Math.ceil(newFavorites.length / skip) - 1;

    // Если текущая страница больше максимальной, уменьшаем её
    const newPage = page > maxPage ? maxPage : page;

    setPage(newPage);

    // Обновляем filtredFavorites с учётом новой страницы
    setFiltredFavorites(newFavorites.slice(0, (newPage + 1) * skip));
  };


  return (
    <Box sx={{ ...UI.style.mainContent }}>
      <Container header={`Ваш список избранного (${count})`}>
        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
          {filtredFavorites.map((fav) => (
            <Grid item xs={6} sm={4} md={3} key={fav.id_favorite || fav.id_media}>
              <FavoritesItem favorite={fav} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filtredFavorites.length < favorites.length && (
          <Button onClick={onLoadMore}>загрузить ещё</Button>
        )}
      </Container>
    </Box>
  );
};
export default FavoritesPage;

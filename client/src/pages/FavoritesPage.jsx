import React, { useEffect, useState } from "react";
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

const FavoritesItem = ({media, onRemoved}) => {
    const { user, listFavorites } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [onRequest, setOnRequest] = useState(false);
    const onRemove = async() => {
        if (onRequest) return;
        setOnRequest(true);
        const favorite = listFavorites.find(
            (e) => e.id_media.toString() === media.id_media.toString()
          );
        const {response, err} = await favoriteModule.remove({id_favorite: favorite.id_favorite});
        setOnRequest(true);

        if (err) toast.error(err.message);
        if (response) {
            toast.success("Удаление из избранного успешно!");
            dispatch(removeFavorite({id_media: media.id_media}));
            onRemoved(media.id_media);
        };
    };
    
  return (
    <>
    <MediaItem media={media} mediaType={media.mediaType} />
    <LoadingButton
    fullWidth
    variant="contained"
    sx={{marginTop: 2}}
    startIcon={<DeleteIcon />}
    loadingPosition="start"
    loading={onRequest}
    onClick={onRemove}
    >
        удалить
    </LoadingButton>
    </>);
};
const FavoritesPage = () => {
    const [medias, setMedias] = useState([]);
    const [filtredMedias, setFiltredMedias] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const dispatch = useDispatch();
    const skip = 5;

    useEffect(() => {
        const getFavorites = async() => {
        dispatch(setGlobalLoading(true));
        const {response, err} = await favoriteModule.getList();
        dispatch(setGlobalLoading(false));

        if (err) toast.error(err.message);
        if (response) {
            setCount(response.length);
            setMedias([...response]);
            setFiltredMedias([...response].splice(0, skip));
        }
    };
    getFavorites();
    }, []);

    const onLoadMore = () => {
        setFiltredMedias([...filtredMedias, ...[medias].splice(page * skip, skip)]);
        setPage(page + 1);
    };
    const onRemoved = (id_media) => {
        const newMedias = [...medias].filter(e => e.id_media !== id_media);
        setMedias(newMedias);
        setFiltredMedias([...newMedias].splice(0, page * skip));
        setCount(count - 1);
    };
    console.log("Это страница избранного списка");
    return(
        <Box sx={{...UI.style.mainContent}} >
            <Container header={`Ваш список избранного (${count})`}>
                <Grid container spacing={1} sx={{marginRight: "-8px!important"}}>
                    {filtredMedias.map((media, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <FavoritesItem media={media} onRemoved={onRemoved} />
                        </Grid>
                    ))}
                </Grid>
                {filtredMedias.length > medias.length && (
                    <Button onClick={onLoadMore}> загрузить ещё</Button>
                )}
            </Container>
        </Box>
    )
      
}

export default FavoritesPage;
import {Tooltip, Autocomplete, Typography, Stack, Container, Button, Backdrop, Alert, Dialog, DialogActions, DialogTitle} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Routes, Route, Link, useNavigate, Outlet, useParams} from 'react-router-dom'
import CommunityReply from '../../components/Community/CommunityReply';
import axios from 'axios';
import DOMPurify from "dompurify";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function CommunityDetail(){
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    // 좋아요용 변수
	const [canLike, setCanLike] = useState(false)
	const toggleLike = () => setCanLike(!canLike)

    // 북마크용 변수
	const [canScrap, setCanScrap] = useState(false)
	const toggleBookmark = () => setCanScrap(!canScrap)

    //수정 및 삭제 가능 여부
    const [canUpdate, setCanUpdate] = useState(false)

    const [detailData, setDetailData] = useState([]); //받아온 데이터 저장할 배열
    const { communityId } = useParams();
    // 게시글 상세 조회
    useEffect(() => {
        axios.get(`https://i10a810.p.ssafy.io/api/communities/v0/details/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
          .then((response) => {
            // 받아온 데이터 필요에 맞게 처리
            setDetailData(response.data.result);
            setCanLike(response.data.result.canLike);
            setCanScrap(response.data.result.canScrap);
            setCanUpdate(response.data.result.canUpdate);
            console.log(response.data.result)
            console.log(detailData)
          })
          .catch((err) => console.log(err));
      }, [communityId]);

    // 게시글 삭제
    const deleteData = (communityId) =>{
        axios.delete(`https://i10a810.p.ssafy.io/api/communities/v1/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
        .then((response) => {
            console.log('게시물 삭제 성공')
            navigate('/community'); //삭제 후 커뮤니티 홈으로 이동
            window.location.reload(); //페이지 새로고침
        })
        .catch((err) => console.log(err));
    }

    //좋아요
    const postLike = (communityId) => {
        axios.post(`https://i10a810.p.ssafy.io/api/communities/v1/likes/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
        .then(() => {
            console.log('좋아요 등록 성공')
            // window.location.reload(); //페이지 새로고침
        })
        .catch((err) => console.log(err));
    }

    //좋아요 취소
    const deleteLike = (communityId) => {
        axios.delete(`https://i10a810.p.ssafy.io/api/communities/v1/unlikes/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
        .then(() => {
            console.log('좋아요 취소 성공')
            // window.location.reload(); //페이지 새로고침
        })
        .catch((err) => console.log(err));
    }

    //스크랩
    const postScrap = (communityId) => {
        axios.post(`https://i10a810.p.ssafy.io/api/communities/v1/scrap/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
        .then(() => {
            console.log('게시글 스크랩 성공')
            // window.location.reload(); //페이지 새로고침
        })
        .catch((err) => console.log(err));
    }

    //스크랩 취소
    const deleteScrap = (communityId) => {
        axios.delete(`https://i10a810.p.ssafy.io/api/communities/v1/unscrap/${communityId}`, {
            headers: {
              Authorization: '10'
            }
          })
        .then(() => {
            console.log('스크랩 취소 성공')
            // window.location.reload(); //페이지 새로고침
        })
        .catch((err) => console.log(err));
    }


    // 삭제 확인 Dialog용
    const handleDeleteDialogOpen = (communityId) => {
      MySwal.fire({
        title: "정말 삭제하시겠습니까?",
        text: "게시물이 완전히 삭제됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 삭제할래요",
        confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
        cancelButtonText: "아니오, 취소할게요",
        cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire({
            title: "삭제되었습니다!",
            text: "게시물이 정상적으로 삭제되었습니다.",
            icon: "success"
          }).then(() =>{
              deleteData(communityId);
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          MySwal.fire({
            title: "취소되었습니다",
            text: "게시물 삭제가 취소되었습니다.",
            icon: "error"
          });
        }
      });
    };

    return(
        <div>
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px'}}>
                <Stack style={{width: "80%"}}>
                    <Typography variant="h4" fontWeight="bold">
                        {detailData.title}
                    </Typography>
                    <Stack direction="row" style={{justifyContent: 'space-between', marginTop:'40px'}}>
                        <div>
                            <span style={{marginRight: '20px'}}>{detailData.createdAt}</span>
                            <Tooltip title="조회수">
                                <VisibilityIcon/>
                            </Tooltip>
                            <span> {detailData.viewCount}</span>
                        </div>
                        <div>
                            <Tooltip title="작성자">
                                <PersonIcon/>
                            </Tooltip>
                             {detailData.memberNickname}
                        </div>
                        
                    </Stack>
                    <hr/>

                    {/* 내용 */}
                    <div style={{ marginTop: '40px' }}>
                        <div
                            style={{
                              width: "60vw",
                              whiteSpace: "normal",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(String(detailData?.content)),
                            }}
                        />

                        <Stack sx={{ marginTop: '40px', justifyContent: "space-between" }}  direction="row" >
                            {/* 해시태그 */}
                            <Stack direction="row">
                                {
                                    detailData.tagList && detailData.tagList.map((tag,index) => (
                                        <Button
                                            key={index}
                                            size="small" 
                                            variant="contained" 
                                            sx={{ height: '2rem', borderRadius: '20px', marginRight: '0.5em'}}
                                        >
                                            #{tag.name}
                                        </Button>
                                    ))
                                }
                                
                            </Stack>

                            <Stack sx={{justifyContent: "space-between"}} direction="row">
                                <div style={{justifyContent:"center"}}>
                                    {/* 좋아요 */}
                                    {
                                        canLike ? (
                                            <Tooltip title="좋아요">
                                                <IconButton size='small' onClick={() => {toggleLike(); postLike(communityId); }} >
                                                    <FavoriteBorderIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="좋아요 취소">
                                                <IconButton size='small' onClick={() => {toggleLike(); deleteLike(communityId); }} >
                                                    <FavoriteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }
                                    {/* 스크랩 */}
                                    {
                                        canScrap ? (
                                            <Tooltip title="스크랩">
                                                <IconButton size='small' onClick={() => {toggleBookmark(); postScrap(communityId); }} >
                                                    <BookmarkBorderIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="스크랩 취소">
                                                <IconButton size='small' onClick={() => {toggleBookmark(); deleteScrap(communityId);}}>
                                                    <BookmarkIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }
                                    {/* 수정 & 삭제 */}
                                    {
                                        canUpdate ? (
                                            <>
                                                <Tooltip title="수정">
                                                    <IconButton onClick={() => {navigate(`/community/modify/${communityId}` ); }} >
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="삭제">
                                                <IconButton onClick={() => {handleDeleteDialogOpen(communityId); }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    
                                    
                                </div>
                            </Stack>
                        </Stack>
                        
                        <hr style={{ marginTop: '20px' }}/>
                    </div>

                    {/* 댓글 */}
                    <CommunityReply detailData={detailData}/>
                </Stack>
            </Container>
        </div>
    )
}

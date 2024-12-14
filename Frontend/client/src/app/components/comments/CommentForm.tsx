'use client'

// ** React
import { useContext, useState } from "react"

// ** Auth Context
import { AuthContext } from "@/context/AuthContext";

// ** apiSlice - RTK-Q
import { useCreateCommentMutation } from "@/store/apiSlice";

// ** MUI
import { Box, Button, Rating, TextareaAutosize, Typography } from "@mui/material";

// ** Toast
import toast from "react-hot-toast";

// ** Components
import Heading from "../Heading";


interface CommentFormProps {
    productId: string | undefined;
    onCommentAdded: () => void;
}


const CommentForm: React.FC<CommentFormProps> = ({ productId, onCommentAdded }) => {

    const [content, setContent] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { user, isAuthenticated } = authContext;


    // POST Comment
    const [createComment] = useCreateCommentMutation();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            console.error('User must be logged in to post a comment');
            toast.error('ابتدا در سایت عضو شوید');
            return;
        };

        if (rating === null) {
            toast.error('لطفا امتیاز دهید');
            return;
        };

        try {

            await createComment({
                userId: user?._id,
                productId,
                content,
                rating,
            }).unwrap();

            setContent('');
            setRating(null);
            onCommentAdded();
            toast.success('دیدگاه با موفقیت ثبت شد');

        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };


    return (
        <Box
            component="div"
            sx={{
                position: 'sticky',
                top: '7rem'
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}
                >
                    <Box
                        component="div"
                        sx={{
                            width: 'fit-content'
                        }}
                    >
                        <Heading title="امتیاز و دیدگاه کاربران" />
                    </Box>

                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'start',
                                justifyContent: 'start'
                            }}
                        >
                            <Rating
                                value={rating || 0}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                sx={{ direction: 'ltr', fontSize: '1.8rem' }}
                            />
                        </Box>
                        <TextareaAutosize
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="متن نظر..."
                            required
                            style={{
                                resize: 'none',
                                fontSize: '0.875rem',
                                lineHeight: '1.25rem',
                                border: '1px solid',
                                borderColor: '#cbd5e1',
                                outlineColor: '#64748b',
                                borderRadius: '0.37rem',
                                height: '10rem',
                                padding: '0.75rem'
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            disabled={!isAuthenticated || !content}
                            sx={{
                                background: '#334155',
                                cursor: "pointer",
                                py: '0.5rem',
                                height: '2.5rem',
                                textTransform: 'none',
                                borderRadius: '0.37rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s',
                                opacity: '0.9',
                                ":disabled": { opacity: "0.5" },
                                '&:hover': {
                                    opacity: '1',
                                    background: '#334155',
                                }
                            }}
                        >
                            <Typography sx={{ color: '#fff', fontWeight: 900 }}>
                                ثبت دیدگاه
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CommentForm
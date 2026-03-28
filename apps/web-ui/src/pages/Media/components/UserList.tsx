import { Avatar, Box, Stack, Tooltip, Typography } from "@mui/material";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import { useCallback, useMemo, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import MemberSkeleton from "../../../components/skeleton/MemberSkeleton";
import useConfig from "../../../hooks/useConfig";
import UserListStack from "./UserListStack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface UserListInterface {
    anilistUsers: MediaAnilistUser[] | undefined;
    selectedUser?: MediaAnilistUser;
    setSelectedUser?: Dispatch<SetStateAction<MediaAnilistUser | undefined>>;
    dataIsLoading: boolean;
}

function UserList(props: UserListInterface) {
    const { anilistUsers, selectedUser, setSelectedUser, dataIsLoading } = props;

    const { isMobile } = useConfig();
    const { t } = useTranslation();

    const onUserSelection = useCallback((newUser: MediaAnilistUser) => {
        if (setSelectedUser === undefined) {
            return;
        }
        if (selectedUser?.user.id === newUser.user.id) {
            setSelectedUser(undefined);
            return;
        }
        setSelectedUser(newUser);
    }, [selectedUser?.user.id, setSelectedUser]);

    const sortedUsers = useMemo(() => {
        if (anilistUsers === undefined) {
            return undefined;
        }
        return [...anilistUsers].sort((a, b) => {
            return a.user?.name?.localeCompare(b.user?.name ?? '') ?? 1;
        });
    }, [anilistUsers]);

    if (dataIsLoading) {
        return (
            <UserListStack>
                {[...Array(5)].map((_, i) => <MemberSkeleton key={i} />)}
            </UserListStack>
        );
    }

    return (
        <Box>
            <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {t('user_list.members')}
                </Typography>
                <Tooltip
                    title={t('user_list.members_tooltip')}
                    placement={isMobile ? 'bottom-end' : 'right-start'}
                    enterTouchDelay={0}
                >
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help', mb: '-1px' }} />
                </Tooltip>
            </Stack>
            {(sortedUsers === undefined || sortedUsers.length === 0) ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    fontStyle="italic"
                    sx={{ opacity: 0.5, p: 2 }}
                >
                    {t('user_list.no_members')}
                </Typography>
            ) : (
                <UserListStack>
                    {sortedUsers.map((user) => (
                        <Box
                            key={user.user.id}
                            onClick={() => onUserSelection(user)}
                            sx={{
                                textAlign: 'center',
                                cursor: 'pointer',
                                opacity: selectedUser?.user.id === user?.user.id ? 1 : 0.5,
                                transition: '0.2s'
                            }}
                        >
                            <Avatar
                                src={user?.user.avatar.medium}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    border: selectedUser?.user.id === user?.user.id ? '2px solid' : 'none',
                                    borderColor: 'primary.main',
                                    mx: "auto",
                                }}
                            />
                            <Tooltip title={user?.user.name} enterDelay={500} enterTouchDelay={0} arrow>
                                <Typography
                                    noWrap
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        maxWidth: '66px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mt: 0.5,
                                    }}
                                >
                                    {user?.user.name}
                                </Typography>
                            </Tooltip>
                        </Box>
                    ))}
                </UserListStack>
            )
            }

        </Box >
    );
}

export default UserList;
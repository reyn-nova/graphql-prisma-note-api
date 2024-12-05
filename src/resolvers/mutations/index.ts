import loginMutation from "./login";
import signUpMutation from "./signUp";
import updatePasswordMutation from "./updatePassword";
import updateUsernameMutation from "./updateUsername";
import addCommentMutation from "./addComment";
import createNoteMutation from "./createNote";
import deleteCommentMutation from "./deleteComment";
import markSeenNoteMutation from "./markSeenNote";
import toggleArchiveNoteMutation from "./toggleArchiveNote";
import toggleLikeNoteMutation from "./toggleLikeNote";
import updateNoteMutation from "./updateNote";

const mutations = {
    signUp: signUpMutation,
    login: loginMutation,
    updateUsername: updateUsernameMutation,
    updatePassword: updatePasswordMutation,
    createNote: createNoteMutation,
    updateNote: updateNoteMutation,
    markSeenNote: markSeenNoteMutation,
    toggleLikeNote: toggleLikeNoteMutation,
    toggleArchiveNote: toggleArchiveNoteMutation,
    addComment: addCommentMutation,
    deleteComment: deleteCommentMutation,
}

export default mutations;

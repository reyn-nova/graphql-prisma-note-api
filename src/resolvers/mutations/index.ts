import addCommentMutation from "./addComment";
import createNoteMutation from "./createNote";
import deleteCommentMutation from "./deleteComment";
import loginMutation from "./login";
import markSeenNoteMutation from "./markSeenNote";
import signUpMutation from "./signUp";
import toggleArchiveNoteMutation from "./toggleArchiveNote";
import toggleLikeNoteMutation from "./toggleLikeNote";
import updateNoteMutation from "./updateNote";

const mutations = {
    signUp: signUpMutation,
    login: loginMutation,
    createNote: createNoteMutation,
    updateNote: updateNoteMutation,
    markSeenNote: markSeenNoteMutation,
    toggleLikeNote: toggleLikeNoteMutation,
    toggleArchiveNote: toggleArchiveNoteMutation,
    addComment: addCommentMutation,
    deleteComment: deleteCommentMutation
}

export default mutations;

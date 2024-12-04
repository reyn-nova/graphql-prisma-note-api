import addCommentMutation from "./addComment";
import createNoteMutation from "./createNote";
import loginMutation from "./login";
import markSeenMutation from "./markSeen";
import signUpMutation from "./signUp";
import toggleArchiveNoteMutation from "./toggleArchiveNote";
import toggleLikeNoteMutation from "./toggleLikeNote";

const mutations = {
    signUp: signUpMutation,
    login: loginMutation,
    createNote: createNoteMutation,
    markSeen: markSeenMutation,
    toggleLikeNote: toggleLikeNoteMutation,
    toggleArchiveNote: toggleArchiveNoteMutation,
    addComment: addCommentMutation
  }

export default mutations;

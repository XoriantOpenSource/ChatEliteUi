/**
 * Socket api constants
 */
export const socketIOConstants = {

    ticker: "ticker",
    history: "history",
    chat: "chats",
    group_change: "groupChange",
    new_group_message: "newGroupMessage",
    user_joined: "userJoined",
    conversation_user_online: "conversationUserOnline",
    logout: "logout",
    conversation: "conversation",
    chat_history: "chatHistory",
    chat_User: "chatUser",
    create_Chat_Group: "createsChatGroup",
    all_Users: "allUsers",
    show_Existing_Chat: "showExistingChat",
    get_Chat_History: "getChatHistory",
    typing: "typing",
    unread_Messages: "unreadMessages",
    transfer_Chat: "transferChat",
    all_Users_Chat_Transfer: "allUsersChatTransfer",
    transfer_Chat_Group_Change: "transferChatGroupChange",
    download: "downloadLink",
    delete_Mess: "deleteMessage",
    chat_History_Updation: "chatHistoryUpdation",
    user_message_prompt: "userMessagePrompt",
    user_Message: "userMessage",
    add_User: "addUser",
    leave_Group: "leaveGroup",
    leave_Group_Change: "leaveGroupChange",
    add_User_Change: "addUserChange",
    add_Users_In_current_Grp: "addUsersIncurrentGrp",
    group_Users_Updation: "groupUsersUpdation",
    mark_favorite: "markfavorite",
    unmark_favorite: "unmarkfavorite",
    download_chats: "downloadChats",
    change_Group_Subject: "changeGroupSubject",
    unread_Chat: "unreadChat",
    add_user_in_ticker_list: "addUserInTickerList",
    ticker_all_Users: "tickerAllUsers",
    get_Links: "getLinks",
    add_To_Links: "addToLinks",
    get_Favorite_Messages: "getFavoriteMessages",
    group_Details: "groupDetails",
    last_Seen: "lastSeen",
    removeUser: "removeUser",
    removeUserRecent: "removeUserRecent",
    get_Common_Groups: "getCommonGroups",
    common_Grp: "commonGrp",
    last_Message: "lastMessage",
    unread_Posts: "unreadPosts",
    remove_user_from_grp: "removeUserFromGrp",
    remove_user_from_grp_change: "removeUserFromGrpChange",
    remove_user_change_in_recent: "removeUserChangeInRecent"

};

/**
 * Event Listener constants
 */
export const event_listeners = {
    cacheChat: "cacheChat",
    cacheHistory: "cacheHistory"
};

/**
 * @class
 * @classdesc Contains constants
 */
export class Constants {
    public static LOGINURL: string = "/login";
    public static REGISTERURL: string = "/register";
}

declare namespace collab.component {


    interface IUser {
        user_id: string;
        user_name: string;
        profile_img: string;

    }

    interface IChatHistory {
        _id: string;
        subject: string;
        created_date_time: string;
        created_by_user: IUser;
        unread_messages?: number;

    }

    interface IConversation {
        _id: string;
        text: string;
        created_date_time: string;
        user: IUser;
    }

    interface ITicker {
        online_status: string;
        user: IUser;
        created_date_time: string;
    }
}

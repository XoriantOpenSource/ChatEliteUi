declare namespace collab.config {

    interface IAppConfig {
        server_url: string;
        user_details: any;
        user_details_url: string;
        session_header: {
            key: string,
            value: string
        },
        debug_mode: number,
        user_token: string,
        env: string,
        firebase_config_for_web: Object
    }
}

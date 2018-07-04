/**
 * @class
 * @classdesc Injects scripts
 */
export default class injectScript {

    /**@function injectJQueryDep
     * @returns A Promise object
     * @description Injects JQuery dependencies
     */
    private injectJQueryDep() {

        return Promise.all([
            new Promise((resolve) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/webui-popover/2.1.15/jquery.webui-popover.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/js/standalone/selectize.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/chardin.js/0.1.3/chardinjs.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://www.gstatic.com/firebasejs/4.6.2/firebase.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            })
        ]);

    }

    /**
     * @function injectJquery
     * @returns A Promise object
     * @description Injects JQuery
     */
    private injectJquery() {
        const win: any = window;
        return new Promise((resolve, reject) => {
            if (!win.jQuery) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
                script.integrity = "sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=";
                script.crossOrigin = "anonymous";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = () => {
                    this.injectJQueryDep().then(resolve);
                };

            } else {

                this.injectJQueryDep().then(resolve);
            }

        });
    }

    /**
     * @function injectMoment
     * @returns A Promise object
     * @description Injects Moment.js for time formats
     */
    private async injectMoment() {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js";
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onload = () => {
                const win: any = window;
                win.moment.localeData("en")._relativeTime.s = "Moments";
                resolve();
            };
        });

    }

    /**
     * @function injectEmbed
     * @returns A promise object
     * @description Injects Embed JS
     */
    private async injectEmbed() {

        return this.injectEmbedDepen().then(() => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/embed-js/4.2.3/embed.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            });
        });

    }

    /**
     * @function injectEmbedDepen
     * @returns A promise object
     * @description Injects Embed JS dependencies
     */
    private async injectEmbedDepen() {
        return Promise.all([
            // new Promise((resolve, reject) => {
            //     const script = document.createElement("script");
            //     script.type = "text/javascript";
            //     script.src = "https://cdnjs.cloudflare.com/ajax/libs/plyr/2.0.13/plyr.js";
            //     document.getElementsByTagName("head")[0].appendChild(script);
            //     script.onload = resolve
            // }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.6/marked.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            }),
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.onload = resolve;
            })
        ]);
    }

    public electronEnvStart() {
        return Promise.all([
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.innerText = 'if (typeof module === "object") {window.module = module; module = undefined;}';
                document.getElementsByTagName("head")[0].appendChild(script);
                resolve();
            })
        ]);
    }

    public electronEnvEnd() {
        return Promise.all([
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.innerText = "if (window.module) module = window.module;";
                document.getElementsByTagName("head")[0].appendChild(script);
                resolve();
            })
        ]);
    }

    /**
     * @function inject
     * @description Injects all scripts required
     */
    public async inject() {
        await this.electronEnvStart();
        await Promise.all([this.injectJquery(), this.injectMoment(), this.injectEmbed()]);
        await this.electronEnvStart();
    }

    constructor() {

    }
}
